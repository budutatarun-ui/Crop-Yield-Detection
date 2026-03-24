# API Documentation - Smart Crop Yield Prediction System

## Base URL
```
http://localhost:8000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 1. Authentication Endpoints

### 1.1 Register User
**Endpoint**: `POST /auth/register/`

**Description**: Create a new user account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecurePass123",
  "password_confirm": "SecurePass123"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2024-02-08T10:00:00Z",
  "message": "User registered successfully"
}
```

**Error Responses**:
- 400 Bad Request: Invalid input or email already exists

---

### 1.2 Login
**Endpoint**: `POST /auth/login/`

**Description**: Authenticate user and receive JWT tokens.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response** (200 OK):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Responses**:
- 401 Unauthorized: Invalid credentials

---

### 1.3 Refresh Token
**Endpoint**: `POST /auth/refresh/`

**Description**: Get a new access token using refresh token.

**Request Body**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response** (200 OK):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### 1.4 Get User Profile
**Endpoint**: `GET /auth/profile/`

**Description**: Get current user's profile information.

**Authentication**: Required

**Response** (200 OK):
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2024-02-08T10:00:00Z"
}
```

---

### 1.5 Update User Profile
**Endpoint**: `PUT /auth/profile/`

**Description**: Update user's profile information.

**Authentication**: Required

**Request Body**:
```json
{
  "name": "John Smith"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Smith",
  "created_at": "2024-02-08T10:00:00Z"
}
```

---

## 2. Prediction Endpoints

### 2.1 Create Prediction
**Endpoint**: `POST /predict/`

**Description**: Create a new crop yield prediction.

**Authentication**: Required

**Request Body**:
```json
{
  "location": "West Bengal",
  "soil_type": "LOAMY",
  "crop_type": "Rice",
  "season": "KHARIF",
  "rainfall": 2000,
  "temperature": 28,
  "humidity": 75,
  "fertilizer": 150,
  "pesticide": 50,
  "area": 10
}
```

**Field Descriptions**:
- `location` (string): State or geographic location
- `soil_type` (string): One of: SANDY, LOAMY, CLAY, SILT, PEATY, CHALKY
- `crop_type` (string): Type of crop (e.g., Rice, Wheat, Maize)
- `season` (string): One of: KHARIF, RABI, SUMMER, AUTUMN, WINTER, WHOLE_YEAR
- `rainfall` (float): Annual rainfall in mm (0-5000)
- `temperature` (float): Average temperature in Celsius (-10 to 50)
- `humidity` (float): Average humidity percentage (0-100)
- `fertilizer` (float): Fertilizer usage in kg (≥0)
- `pesticide` (float): Pesticide usage in kg (≥0)
- `area` (float): Area in hectares (>0)

**Response** (201 Created):
```json
{
  "id": 1,
  "predicted_yield": 45.8,
  "yield_per_hectare": 4.58,
  "unit": "tons",
  "crop_type": "Rice",
  "location": "West Bengal",
  "message": "Prediction successful"
}
```

**Error Responses**:
- 400 Bad Request: Invalid input data
- 500 Internal Server Error: Prediction failed

---

### 2.2 List Predictions
**Endpoint**: `GET /predictions/`

**Description**: Get paginated list of user's predictions.

**Authentication**: Required

**Query Parameters**:
- `page` (int, optional): Page number (default: 1)
- `page_size` (int, optional): Items per page (default: 20)
- `crop_type` (string, optional): Filter by crop type

**Example Request**:
```
GET /predictions/?page=1&crop_type=Rice
```

**Response** (200 OK):
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/predictions/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "user": 1,
      "user_email": "user@example.com",
      "location": "West Bengal",
      "soil_type": "LOAMY",
      "crop_type": "Rice",
      "season": "KHARIF",
      "rainfall": 2000,
      "temperature": 28,
      "humidity": 75,
      "fertilizer": 150,
      "pesticide": 50,
      "area": 10,
      "predicted_yield": 45.8,
      "yield_per_hectare": 4.58,
      "created_at": "2024-02-08T10:30:00Z"
    }
  ]
}
```

---

### 2.3 Get Prediction Detail
**Endpoint**: `GET /predictions/{id}/`

**Description**: Get details of a specific prediction.

**Authentication**: Required

**Response** (200 OK):
```json
{
  "id": 1,
  "user": 1,
  "user_email": "user@example.com",
  "location": "West Bengal",
  "soil_type": "LOAMY",
  "crop_type": "Rice",
  "season": "KHARIF",
  "rainfall": 2000,
  "temperature": 28,
  "humidity": 75,
  "fertilizer": 150,
  "pesticide": 50,
  "area": 10,
  "predicted_yield": 45.8,
  "yield_per_hectare": 4.58,
  "created_at": "2024-02-08T10:30:00Z"
}
```

**Error Responses**:
- 404 Not Found: Prediction not found or doesn't belong to user

---

## 3. Dashboard Endpoint

### 3.1 Get Dashboard Analytics
**Endpoint**: `GET /dashboard/`

**Description**: Get aggregated analytics and statistics for the user.

**Authentication**: Required

**Response** (200 OK):
```json
{
  "total_predictions": 25,
  "average_yield": 4.52,
  "highest_yield_crop": "Rice",
  "total_area_predicted": 250.5,
  "predictions_by_crop": {
    "Rice": 10,
    "Wheat": 8,
    "Maize": 7
  },
  "recent_predictions": [
    {
      "id": 25,
      "crop_type": "Rice",
      "predicted_yield": 45.8,
      "created_at": "2024-02-08T15:00:00Z"
    }
  ]
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": true,
  "status_code": 400,
  "message": "Error description",
  "errors": {
    "field_name": ["Error detail"]
  }
}
```

**Common HTTP Status Codes**:
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 401: Unauthorized (authentication required)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

---

## Rate Limiting

Currently, there are no rate limits imposed. However, for production use, it's recommended to implement rate limiting.

---

## CORS

CORS is configured to allow requests from:
- `http://localhost:3000` (React default)
- `http://localhost:5173` (Vite default)

Additional origins can be added in the `.env` file.

---

## Example Integration (JavaScript)

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:8000/api/auth/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  return data;
};

// Make Prediction
const makePrediction = async (token, predictionData) => {
  const response = await fetch('http://localhost:8000/api/predict/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(predictionData),
  });
  const data = await response.json();
  return data;
};

// Get Dashboard
const getDashboard = async (token) => {
  const response = await fetch('http://localhost:8000/api/dashboard/', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};
```

---

## Support

For API support, please contact: support@example.com
