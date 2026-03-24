"""
Tests for Users app.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status

User = get_user_model()


class UserModelTests(TestCase):
    """Test User model."""
    
    def test_create_user(self):
        """Test creating a user with email."""
        email = 'test@example.com'
        password = 'testpass123'
        user = User.objects.create_user(
            email=email,
            password=password
        )
        
        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
    
    def test_create_superuser(self):
        """Test creating a superuser."""
        email = 'admin@example.com'
        password = 'testpass123'
        user = User.objects.create_superuser(
            email=email,
            password=password
        )
        
        self.assertEqual(user.email, email)
        self.assertTrue(user.is_active)
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)
    
    def test_email_normalization(self):
        """Test email normalization."""
        email = 'test@EXAMPLE.COM'
        user = User.objects.create_user(email=email, password='test123')
        
        self.assertEqual(user.email, email.lower())


class UserRegistrationTests(APITestCase):
    """Test user registration endpoint."""
    
    def test_register_user_success(self):
        """Test successful user registration."""
        url = '/api/auth/register/'
        data = {
            'email': 'newuser@example.com',
            'name': 'New User',
            'password': 'TestPass123!',
            'password_confirm': 'TestPass123!'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().email, data['email'])
    
    def test_register_duplicate_email(self):
        """Test registration with duplicate email fails."""
        User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        
        url = '/api/auth/register/'
        data = {
            'email': 'test@example.com',
            'name': 'Test User',
            'password': 'TestPass123!',
            'password_confirm': 'TestPass123!'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_register_password_mismatch(self):
        """Test registration with mismatched passwords fails."""
        url = '/api/auth/register/'
        data = {
            'email': 'test@example.com',
            'name': 'Test User',
            'password': 'TestPass123!',
            'password_confirm': 'DifferentPass123!'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserLoginTests(APITestCase):
    """Test user login endpoint."""
    
    def setUp(self):
        """Create a user for login tests."""
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
    
    def test_login_success(self):
        """Test successful login."""
        url = '/api/auth/login/'
        data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials fails."""
        url = '/api/auth/login/'
        data = {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
