"""
Admin configuration for Prediction model.
"""
from django.contrib import admin
from .models import Prediction


@admin.register(Prediction)
class PredictionAdmin(admin.ModelAdmin):
    """Admin interface for Prediction model."""
    
    list_display = (
        'id',
        'user',
        'crop_type',
        'location',
        'predicted_yield',
        'area',
        'created_at'
    )
    
    list_filter = (
        'crop_type',
        'soil_type',
        'season',
        'location',
        'created_at'
    )
    
    search_fields = (
        'user__email',
        'crop_type',
        'location'
    )
    
    readonly_fields = (
        'created_at',
        'updated_at',
        'yield_per_hectare'
    )
    
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Location & Crop Details', {
            'fields': ('location', 'soil_type', 'crop_type', 'season')
        }),
        ('Environmental Factors', {
            'fields': ('rainfall', 'temperature', 'humidity')
        }),
        ('Agricultural Inputs', {
            'fields': ('fertilizer', 'pesticide', 'area')
        }),
        ('Prediction Results', {
            'fields': ('predicted_yield', 'yield_per_hectare')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    
    def yield_per_hectare(self, obj):
        """Display yield per hectare."""
        return round(obj.yield_per_hectare, 2)
    yield_per_hectare.short_description = 'Yield/Hectare'
