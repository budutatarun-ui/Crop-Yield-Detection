"""
Utility functions for predictions app.
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom exception handler for consistent error responses.
    
    Returns:
    {
        "error": "Error message",
        "detail": "Detailed error information",
        "status_code": 400
    }
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    if response is not None:
        custom_response_data = {
            'error': True,
            'status_code': response.status_code,
        }
        
        # Handle different error formats
        if isinstance(response.data, dict):
            if 'detail' in response.data:
                custom_response_data['message'] = response.data['detail']
            else:
                custom_response_data['errors'] = response.data
        elif isinstance(response.data, list):
            custom_response_data['message'] = response.data[0] if response.data else 'An error occurred'
        else:
            custom_response_data['message'] = str(response.data)
        
        response.data = custom_response_data
    
    # Log the exception
    logger.error(f"Exception: {exc}, Context: {context}")
    
    return response


def validate_prediction_input(data):
    """
    Validate prediction input data.
    
    Args:
        data (dict): Input data for prediction
    
    Returns:
        tuple: (is_valid, error_message)
    """
    required_fields = [
        'location', 'crop_type', 'rainfall', 'temperature',
        'humidity', 'fertilizer', 'area'
    ]
    
    for field in required_fields:
        if field not in data:
            return False, f"Missing required field: {field}"
    
    # Validate numeric fields
    numeric_fields = {
        'rainfall': (0, 5000),
        'temperature': (-10, 50),
        'humidity': (0, 100),
        'fertilizer': (0, float('inf')),
        'area': (0.01, float('inf')),
    }
    
    for field, (min_val, max_val) in numeric_fields.items():
        if field in data:
            try:
                value = float(data[field])
                if value < min_val or value > max_val:
                    return False, f"{field} must be between {min_val} and {max_val}"
            except (ValueError, TypeError):
                return False, f"{field} must be a valid number"
    
    return True, None
