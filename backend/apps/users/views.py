"""
Views for User Authentication.
"""
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model

from .serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    CustomTokenObtainPairSerializer
)

User = get_user_model()


class UserRegistrationView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    
    POST /api/auth/register
    
    Request Body:
    {
        "email": "user@example.com",
        "name": "John Doe",
        "password": "SecurePass123",
        "password_confirm": "SecurePass123"
    }
    
    Response:
    {
        "id": 1,
        "email": "user@example.com",
        "name": "John Doe",
        "created_at": "2024-02-08T10:00:00Z",
        "message": "User registered successfully"
    }
    """
    
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'created_at': user.created_at,
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    API endpoint for user login.
    
    POST /api/auth/login
    
    Request Body:
    {
        "email": "user@example.com",
        "password": "SecurePass123"
    }
    
    Response:
    {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
        "user": {
            "id": 1,
            "email": "user@example.com",
            "name": "John Doe"
        }
    }
    """
    
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint for retrieving and updating user profile.
    
    GET /api/auth/profile
    
    Response:
    {
        "id": 1,
        "email": "user@example.com",
        "name": "John Doe",
        "created_at": "2024-02-08T10:00:00Z"
    }
    """
    
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
