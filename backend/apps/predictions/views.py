"""
Views for Prediction API endpoints.
"""
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg, Max, Count, Sum
from django.shortcuts import get_object_or_404
from django.db.models.functions import TruncMonth
from django.utils import timezone
from datetime import datetime

from .models import Prediction
from .serializers import (
    PredictionSerializer,
    PredictionInputSerializer,
    DashboardSerializer
)
from apps.ml_model.predict import predict_yield
import logging

logger = logging.getLogger(__name__)


class PredictionCreateView(APIView):
    """
    API endpoint for creating crop yield predictions.
    
    POST /api/predict/
    
    Request Body:
    {
        "location": "West Bengal",
        "soil_type": "LOAMY",
        "crop_type": "Rice",
        "season": "KHARIF",
        "rainfall": 2000,
        "temperature": 28,
        "humidity": 75,
        "fertilizer": 150,
        "pesticide": 50,
        "area": 10
    }
    
    Response:
    {
        "id": 1,
        "predicted_yield": 45.8,
        "yield_per_hectare": 4.58,
        "unit": "tons",
        "message": "Prediction successful"
    }
    """
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        # Validate input
        input_serializer = PredictionInputSerializer(data=request.data)
        if not input_serializer.is_valid():
            return Response({
                'error': True,
                'message': 'Invalid input data',
                'errors': input_serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        validated_data = input_serializer.validated_data
        
        try:
            # Prepare data for ML model
            input_features = {
                'Crop': validated_data['crop_type'],
                'Season': validated_data['season'],
                'State': validated_data['location'],
                'Area': validated_data['area'],
                'Annual_Rainfall': validated_data['rainfall'],
                'Fertilizer': validated_data['fertilizer'],
                'Pesticide': validated_data.get('pesticide', 0),
            }
            
            # Get prediction from ML model
            predicted_yield = predict_yield(input_features)
            
            # Save prediction to database
            prediction = Prediction.objects.create(
                user=request.user,
                location=validated_data['location'],
                soil_type=validated_data['soil_type'],
                crop_type=validated_data['crop_type'],
                season=validated_data['season'],
                rainfall=validated_data['rainfall'],
                temperature=validated_data['temperature'],
                humidity=validated_data['humidity'],
                fertilizer=validated_data['fertilizer'],
                pesticide=validated_data.get('pesticide', 0),
                area=validated_data['area'],
                predicted_yield=predicted_yield
            )
            
            logger.info(f"Prediction created for user {request.user.email}: {prediction.id}")
            
            return Response({
                'id': prediction.id,
                'predicted_yield': round(predicted_yield, 2),
                'yield_per_hectare': round(prediction.yield_per_hectare, 2),
                'unit': 'tons',
                'crop_type': prediction.crop_type,
                'location': prediction.location,
                'message': 'Prediction successful'
            }, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            return Response({
                'error': True,
                'message': 'Prediction failed',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PredictionListView(generics.ListAPIView):
    """
    API endpoint for listing user's prediction history.
    
    GET /api/predictions/
    
    Query Parameters:
    - page: Page number (default: 1)
    - page_size: Number of items per page (default: 20)
    - crop_type: Filter by crop type
    
    Response:
    {
        "count": 50,
        "next": "http://api/predictions/?page=2",
        "previous": null,
        "results": [...]
    }
    """
    
    serializer_class = PredictionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return predictions for the current user only."""
        queryset = Prediction.objects.filter(user=self.request.user)
        
        # Optional filtering
        crop_type = self.request.query_params.get('crop_type', None)
        if crop_type:
            queryset = queryset.filter(crop_type__icontains=crop_type)
        
        return queryset.select_related('user')


class PredictionDetailView(generics.RetrieveAPIView):
    """
    API endpoint for retrieving a single prediction.
    
    GET /api/predictions/{id}/
    
    Response:
    {
        "id": 1,
        "location": "West Bengal",
        "crop_type": "Rice",
        ...
    }
    """
    
    serializer_class = PredictionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return predictions for the current user only."""
        return Prediction.objects.filter(user=self.request.user)


class DashboardView(APIView):
    """
    API endpoint for dashboard analytics.
    
    GET /api/dashboard/
    
    Response:
    {
        "total_predictions": 25,
        "average_yield": 4.5,
        "highest_yield_crop": "Rice",
        "total_area_predicted": 250,
        "predictions_by_crop": {
            "Rice": 10,
            "Wheat": 8,
            "Maize": 7
        },
        "recent_predictions": [...]
    }
    """
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user_predictions = Prediction.objects.filter(user=request.user)
        
        if not user_predictions.exists():
            return Response({
                'total_predictions': 0,
                'average_yield': 0,
                'highest_yield_crop': None,
                'total_area_predicted': 0,
                'predictions_by_crop': {},
                'recent_predictions': []
            })
        
        # Aggregate data
        stats = user_predictions.aggregate(
            total=Count('id'),
            avg_yield=Avg('predicted_yield'),
            total_area=Sum('area')
        )
        
        # Get highest yield crop
        highest_yield = user_predictions.order_by('-predicted_yield').first()
        
        # Predictions by crop type with average yield
        yield_by_crop = []
        crop_stats = user_predictions.values('crop_type').annotate(
            count=Count('id'),
            avg_yield=Avg('predicted_yield')
        ).order_by('-avg_yield')
        
        for item in crop_stats:
            yield_by_crop.append({
                'crop': item['crop_type'],
                'yield': round(item['avg_yield'], 2) if item['avg_yield'] else 0
            })
        
        # Recent predictions
        recent = user_predictions.order_by('-created_at')[:5]
        recent_serializer = PredictionSerializer(recent, many=True)
        
        # Prediction trends by month
        prediction_trends = []
        trends_data = user_predictions.annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            predictions=Count('id'),
            avg_yield=Avg('predicted_yield')
        ).order_by('month')[:12]  # Last 12 months
        
        for trend in trends_data:
            month_name = trend['month'].strftime('%b %Y') if trend['month'] else 'Unknown'
            prediction_trends.append({
                'month': month_name,
                'predictions': trend['predictions'],
                'avg_yield': round(trend['avg_yield'], 2) if trend['avg_yield'] else 0
            })
        
        dashboard_data = {
            'total_predictions': stats['total'],
            'average_yield': round(stats['avg_yield'], 2) if stats['avg_yield'] else 0,
            'best_crop': highest_yield.crop_type if highest_yield else None,
            'yield_by_crop': yield_by_crop,
            'prediction_trends': prediction_trends,
            'recent_predictions': recent_serializer.data
        }
        
        return Response(dashboard_data)
