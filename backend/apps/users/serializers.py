"""
Serializers for User Authentication and Registration.
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'password', 'password_confirm', 'created_at')
        read_only_fields = ('id', 'created_at')
    
    def validate(self, attrs):
        """Validate that passwords match."""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
            })
        return attrs
    
    def validate_email(self, value):
        """Validate email uniqueness."""
        if User.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()
    
    def create(self, validated_data):
        """Create a new user with encrypted password."""
        validated_data.pop('password_confirm')
        
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data.get('name', ''),
            password=validated_data['password']
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile."""
    
    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'created_at')
        read_only_fields = ('id', 'email', 'created_at')


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT token serializer with additional user data."""
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['email'] = user.email
        token['name'] = user.name
        
        return token
    
    def validate(self, attrs):
        """Add user data to the response."""
        data = super().validate(attrs)
        
        # Add user information
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'name': self.user.name,
        }
        
        return data
