"""
URL configuration for predictions app.
"""
from django.urls import path

from .views import (
    PredictionCreateView,
    PredictionListView,
    PredictionDetailView,
    DashboardView
)

app_name = 'predictions'

urlpatterns = [
    # Prediction endpoints
    path('predict/', PredictionCreateView.as_view(), name='predict'),
    path('predictions/', PredictionListView.as_view(), name='prediction-list'),
    path('predictions/<int:pk>/', PredictionDetailView.as_view(), name='prediction-detail'),
    
    # Dashboard
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]
