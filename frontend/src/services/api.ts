// Real API service for Django backend

const API_BASE_URL = 'http://localhost:8000/api';

export interface PredictionInput {
  location: string;
  soil_type: string;
  crop_type: string;
  season: string;
  rainfall: number;
  temperature: number;
  humidity: number;
  fertilizer: number;
  pesticide: number;
  area: number;
}

export interface PredictionResult {
  id: string;
  predicted_yield: number;
  yield_per_hectare?: number;
  unit?: string;
  crop_type: string;
  location: string;
  message?: string;
  created_at?: string;
}

export interface DashboardStats {
  total_predictions: number;
  average_yield: number;
  best_crop: string;
  recent_predictions: PredictionResult[];
  yield_by_crop: { crop: string; yield: number }[];
  prediction_trends: { month: string; predictions: number; avg_yield: number }[];
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

class ApiError extends Error {
  constructor(public status: number, message: string, public errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
  }
}

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('access_token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let message = errorData.message || errorData.detail || 'API request failed';
      
      // Handle validation errors
      if (errorData.errors && typeof errorData.errors === 'object') {
        const errorMessages = Object.entries(errorData.errors)
          .map(([field, messages]) => {
            const fieldErrors = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${fieldErrors.join(', ')}`;
          });
        message = errorMessages.join('; ');
      }
      
      throw new ApiError(response.status, message, errorData.errors);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new Error('Network error occurred');
  }
};

// Authentication
export const auth = {
  register: async (name: string, email: string, password: string, password_confirm: string) => {
    return apiRequest('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, password_confirm }),
    });
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const data = await apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    
    return data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  refreshToken: async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('No refresh token');

    const data = await apiRequest('/auth/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    });
    
    localStorage.setItem('access_token', data.access);
    return data;
  },

  getProfile: async (): Promise<User> => {
    return apiRequest('/auth/profile/');
  },
};

// Predictions
export const predictions = {
  create: async (input: PredictionInput): Promise<PredictionResult> => {
    return apiRequest('/predict/', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  getAll: async (): Promise<PredictionResult[]> => {
    return apiRequest('/predictions/');
  },

  getById: async (id: string): Promise<PredictionResult> => {
    return apiRequest(`/predictions/${id}/`);
  },
};

// Dashboard
export const dashboard = {
  getStats: async (): Promise<DashboardStats> => {
    return apiRequest('/dashboard/');
  },
};

// Soil types (from backend enum)
export const soilTypes = [
  'SANDY',
  'LOAMY',
  'CLAY',
  'SILT',
  'PEATY',
  'CHALKY',
];

// Crop types (from backend enum)
export const cropTypes = [
  'RICE',
  'WHEAT',
  'MAIZE',
  'COTTON',
  'SUGARCANE',
  'POTATO',
  'SOYBEAN',
  'ONION',
  'BANANA',
  'OTHER',
];

// Seasons (from backend enum)
export const seasons = [
  'KHARIF',
  'RABI',
  'SUMMER',
  'AUTUMN',
  'WINTER',
  'WHOLE_YEAR',
];

// States (Indian states - should match backend)
export const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];
