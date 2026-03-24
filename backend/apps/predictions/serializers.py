"""
Serializers for Prediction model.
"""
from rest_framework import serializers
from .models import Prediction


class PredictionSerializer(serializers.ModelSerializer):
    """Serializer for creating and viewing predictions."""
    
    user_email = serializers.EmailField(source='user.email', read_only=True)
    yield_per_hectare = serializers.FloatField(read_only=True)
    
    class Meta:
        model = Prediction
        fields = [
            'id',
            'user',
            'user_email',
            'location',
            'soil_type',
            'crop_type',
            'season',
            'rainfall',
            'temperature',
            'humidity',
            'fertilizer',
            'pesticide',
            'area',
            'predicted_yield',
            'yield_per_hectare',
            'created_at',
        ]
        read_only_fields = ['id', 'user', 'predicted_yield', 'created_at']
    
    def validate_rainfall(self, value):
        """Validate rainfall is within reasonable range."""
        if value < 0:
            raise serializers.ValidationError("Rainfall cannot be negative.")
        if value > 5000:
            raise serializers.ValidationError("Rainfall value seems unrealistic (max 5000mm).")
        return value
    
    def validate_temperature(self, value):
        """Validate temperature is within reasonable range."""
        if value < -10:
            raise serializers.ValidationError("Temperature too low.")
        if value > 50:
            raise serializers.ValidationError("Temperature too high.")
        return value
    
    def validate_humidity(self, value):
        """Validate humidity is between 0 and 100."""
        if value < 0 or value > 100:
            raise serializers.ValidationError("Humidity must be between 0 and 100.")
        return value
    
    def validate_area(self, value):
        """Validate area is positive."""
        if value <= 0:
            raise serializers.ValidationError("Area must be greater than 0.")
        return value


class PredictionInputSerializer(serializers.Serializer):
    """Serializer for prediction input validation."""
    
    location = serializers.CharField(max_length=100)
    soil_type = serializers.ChoiceField(choices=Prediction.SOIL_TYPES)
    crop_type = serializers.CharField(max_length=50)
    season = serializers.ChoiceField(choices=Prediction.SEASON_TYPES)
    rainfall = serializers.FloatField(min_value=0, max_value=5000)
    temperature = serializers.FloatField(min_value=-10, max_value=50)
    humidity = serializers.FloatField(min_value=0, max_value=100)
    fertilizer = serializers.FloatField(min_value=0)
    pesticide = serializers.FloatField(min_value=0, default=0)
    area = serializers.FloatField(min_value=0.01)


class DashboardSerializer(serializers.Serializer):
    """Serializer for dashboard analytics."""
    
    total_predictions = serializers.IntegerField()
    average_yield = serializers.FloatField()
    highest_yield_crop = serializers.CharField()
    total_area_predicted = serializers.FloatField()
    predictions_by_crop = serializers.DictField()
    recent_predictions = PredictionSerializer(many=True)
