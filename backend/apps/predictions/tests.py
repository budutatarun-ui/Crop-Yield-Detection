"""
Tests for Predictions app.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from apps.predictions.models import Prediction

User = get_user_model()


class PredictionModelTests(TestCase):
    """Test Prediction model."""
    
    def setUp(self):
        """Create a user for tests."""
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
    
    def test_create_prediction(self):
        """Test creating a prediction."""
        prediction = Prediction.objects.create(
            user=self.user,
            location='West Bengal',
            soil_type='LOAMY',
            crop_type='Rice',
            season='KHARIF',
            rainfall=2000,
            temperature=28,
            humidity=75,
            fertilizer=150,
            pesticide=50,
            area=10,
            predicted_yield=45.8
        )
        
        self.assertEqual(prediction.user, self.user)
        self.assertEqual(prediction.crop_type, 'Rice')
        self.assertEqual(prediction.predicted_yield, 45.8)
    
    def test_yield_per_hectare(self):
        """Test yield per hectare calculation."""
        prediction = Prediction.objects.create(
            user=self.user,
            location='West Bengal',
            soil_type='LOAMY',
            crop_type='Rice',
            season='KHARIF',
            rainfall=2000,
            temperature=28,
            humidity=75,
            fertilizer=150,
            area=10,
            predicted_yield=45.8
        )
        
        self.assertEqual(prediction.yield_per_hectare, 4.58)


class PredictionAPITests(APITestCase):
    """Test Prediction API endpoints."""
    
    def setUp(self):
        """Set up authentication."""
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        
        # Login and get token
        url = '/api/auth/login/'
        data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = self.client.post(url, data, format='json')
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
    
    def test_create_prediction_success(self):
        """Test creating a prediction."""
        url = '/api/predict/'
        data = {
            'location': 'West Bengal',
            'soil_type': 'LOAMY',
            'crop_type': 'Rice',
            'season': 'KHARIF',
            'rainfall': 2000,
            'temperature': 28,
            'humidity': 75,
            'fertilizer': 150,
            'pesticide': 50,
            'area': 10
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('predicted_yield', response.data)
        self.assertEqual(Prediction.objects.count(), 1)
    
    def test_create_prediction_invalid_data(self):
        """Test creating prediction with invalid data fails."""
        url = '/api/predict/'
        data = {
            'location': 'West Bengal',
            'soil_type': 'INVALID',
            'crop_type': 'Rice',
            'rainfall': -100,  # Invalid negative value
            'temperature': 28,
            'humidity': 75,
            'fertilizer': 150,
            'area': 10
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_list_predictions(self):
        """Test listing user's predictions."""
        # Create some predictions
        Prediction.objects.create(
            user=self.user,
            location='West Bengal',
            soil_type='LOAMY',
            crop_type='Rice',
            season='KHARIF',
            rainfall=2000,
            temperature=28,
            humidity=75,
            fertilizer=150,
            area=10,
            predicted_yield=45.8
        )
        
        url = '/api/predictions/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_dashboard(self):
        """Test dashboard endpoint."""
        # Create a prediction
        Prediction.objects.create(
            user=self.user,
            location='West Bengal',
            soil_type='LOAMY',
            crop_type='Rice',
            season='KHARIF',
            rainfall=2000,
            temperature=28,
            humidity=75,
            fertilizer=150,
            area=10,
            predicted_yield=45.8
        )
        
        url = '/api/dashboard/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_predictions'], 1)
        self.assertIn('average_yield', response.data)
    
    def test_unauthenticated_access(self):
        """Test that unauthenticated users cannot access predictions."""
        self.client.credentials()  # Remove authentication
        
        url = '/api/predict/'
        data = {
            'location': 'West Bengal',
            'crop_type': 'Rice',
            'rainfall': 2000
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
