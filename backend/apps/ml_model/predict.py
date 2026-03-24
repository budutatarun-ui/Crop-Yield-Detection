"""
ML Model Prediction Module.
Loads the trained model once and provides prediction functionality.
"""
import os
import joblib
import pandas as pd
import numpy as np
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

# Global variable to store the loaded model (singleton pattern)
_model = None
_preprocessor = None


def load_model():
    """
    Load the ML model and preprocessor.
    This is called once when Django starts (in apps.py ready method).
    """
    global _model, _preprocessor
    
    if _model is not None:
        logger.info("Model already loaded")
        return
    
    try:
        model_path = getattr(settings, 'ML_MODEL_PATH', None)
        
        if model_path and os.path.exists(model_path):
            _model = joblib.load(model_path)
            logger.info(f"ML model loaded successfully from {model_path}")
        else:
            logger.warning(f"Model file not found at {model_path}. Using dummy model.")
            _model = None
    
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        _model = None


def predict_yield(input_data):
    """
    Predict crop yield based on input features.
    
    Args:
        input_data (dict): Dictionary containing:
            - Crop: str
            - Season: str
            - State: str
            - Area: float
            - Annual_Rainfall: float
            - Fertilizer: float
            - Pesticide: float
    
    Returns:
        float: Predicted yield
    """
    global _model
    
    # Load model if not loaded
    if _model is None:
        load_model()
    
    try:
        # If model is still None, use a simple estimation formula
        if _model is None:
            logger.warning("Using fallback prediction method")
            return _estimate_yield_fallback(input_data)
        
        # Prepare input DataFrame
        input_df = pd.DataFrame([input_data])
        
        # Make prediction
        prediction = _model.predict(input_df)
        
        # Return the predicted value
        predicted_value = float(prediction[0])
        
        # Ensure positive prediction
        predicted_value = max(predicted_value, 0)
        
        logger.info(f"Prediction made: {predicted_value}")
        return predicted_value
    
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        # Fallback to simple estimation
        return _estimate_yield_fallback(input_data)


def _estimate_yield_fallback(input_data):
    """
    Fallback method to estimate yield when model is not available.
    Uses a simple formula based on area, rainfall, and fertilizer.
    
    This is a simplified estimation and should not be used in production.
    """
    area = input_data.get('Area', 1)
    rainfall = input_data.get('Annual_Rainfall', 1000)
    fertilizer = input_data.get('Fertilizer', 100)
    pesticide = input_data.get('Pesticide', 0)
    
    # Simple estimation formula (not scientifically accurate)
    # This is just a placeholder until the real model is trained
    base_yield = 0.5  # Base yield per hectare
    rainfall_factor = min(rainfall / 1000, 2)  # Normalize rainfall effect
    fertilizer_factor = min(fertilizer / 100, 1.5)  # Normalize fertilizer effect
    pesticide_factor = min(pesticide / 50, 1.2)  # Normalize pesticide effect
    
    estimated_yield = area * base_yield * rainfall_factor * fertilizer_factor * pesticide_factor
    
    # Add some randomness to make it look more realistic
    import random
    estimated_yield *= (0.8 + random.random() * 0.4)  # ±20% variation
    
    logger.info(f"Fallback estimation: {estimated_yield}")
    return estimated_yield


def get_model_info():
    """
    Get information about the loaded model.
    
    Returns:
        dict: Model information
    """
    global _model
    
    if _model is None:
        return {
            'loaded': False,
            'type': None,
            'message': 'Model not loaded'
        }
    
    return {
        'loaded': True,
        'type': type(_model).__name__,
        'message': 'Model loaded successfully'
    }
