"""
Prediction Model for storing crop yield predictions.
"""
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator


class Prediction(models.Model):
    """
    Model to store crop yield prediction data.
    
    Fields:
    - user: ForeignKey to User
    - location: Geographic location/state
    - soil_type: Type of soil
    - crop_type: Type of crop
    - rainfall: Annual rainfall in mm
    - temperature: Average temperature in Celsius
    - humidity: Average humidity percentage
    - fertilizer: Fertilizer usage in kg
    - area: Area in hectares
    - predicted_yield: ML model prediction result
    - created_at: Timestamp of prediction
    """
    
    SOIL_TYPES = [
        ('SANDY', 'Sandy'),
        ('LOAMY', 'Loamy'),
        ('CLAY', 'Clay'),
        ('SILT', 'Silt'),
        ('PEATY', 'Peaty'),
        ('CHALKY', 'Chalky'),
    ]
    
    CROP_TYPES = [
        ('RICE', 'Rice'),
        ('WHEAT', 'Wheat'),
        ('MAIZE', 'Maize'),
        ('COTTON', 'Cotton'),
        ('SUGARCANE', 'Sugarcane'),
        ('POTATO', 'Potato'),
        ('SOYBEAN', 'Soybean'),
        ('ONION', 'Onion'),
        ('BANANA', 'Banana'),
        ('OTHER', 'Other'),
    ]
    
    SEASON_TYPES = [
        ('KHARIF', 'Kharif'),
        ('RABI', 'Rabi'),
        ('SUMMER', 'Summer'),
        ('AUTUMN', 'Autumn'),
        ('WINTER', 'Winter'),
        ('WHOLE_YEAR', 'Whole Year'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='predictions',
        db_index=True
    )
    
    location = models.CharField(
        max_length=100,
        help_text='State or geographic location'
    )
    
    soil_type = models.CharField(
        max_length=50,
        choices=SOIL_TYPES,
        default='LOAMY'
    )
    
    crop_type = models.CharField(
        max_length=50,
        help_text='Type of crop'
    )
    
    season = models.CharField(
        max_length=50,
        choices=SEASON_TYPES,
        default='KHARIF'
    )
    
    rainfall = models.FloatField(
        validators=[MinValueValidator(0)],
        help_text='Annual rainfall in mm'
    )
    
    temperature = models.FloatField(
        validators=[MinValueValidator(-50)],
        help_text='Average temperature in Celsius'
    )
    
    humidity = models.FloatField(
        validators=[MinValueValidator(0)],
        help_text='Average humidity percentage (0-100)'
    )
    
    fertilizer = models.FloatField(
        validators=[MinValueValidator(0)],
        help_text='Fertilizer usage in kg'
    )
    
    pesticide = models.FloatField(
        validators=[MinValueValidator(0)],
        default=0,
        help_text='Pesticide usage in kg'
    )
    
    area = models.FloatField(
        validators=[MinValueValidator(0)],
        help_text='Area in hectares'
    )
    
    predicted_yield = models.FloatField(
        help_text='Predicted crop yield'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True
    )
    
    updated_at = models.DateTimeField(
        auto_now=True
    )
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['crop_type']),
            models.Index(fields=['-created_at']),
        ]
        verbose_name = 'Prediction'
        verbose_name_plural = 'Predictions'
    
    def __str__(self):
        return f"{self.user.email} - {self.crop_type} - {self.predicted_yield:.2f}"
    
    @property
    def yield_per_hectare(self):
        """Calculate yield per hectare."""
        if self.area > 0:
            return self.predicted_yield / self.area
        return 0
