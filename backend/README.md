# Smart Crop Yield Prediction System - Backend

A production-ready Django REST API backend for crop yield prediction using Machine Learning.

## 🚀 Features

- ✅ **User Authentication**: JWT-based authentication with registration and login
- ✅ **Crop Yield Prediction**: ML-powered predictions using Random Forest
- ✅ **Prediction History**: Store and retrieve user's past predictions
- ✅ **Dashboard Analytics**: Aggregate statistics and insights
- ✅ **RESTful API**: Clean, well-documented API endpoints
- ✅ **PostgreSQL Database**: Production-grade database with optimized queries
- ✅ **Security**: Password hashing, JWT tokens, CORS configuration
- ✅ **Scalable Architecture**: Modular app structure following Django best practices

## 📋 Prerequisites

- Python 3.8+
- PostgreSQL 12+
- pip (Python package manager)
- virtualenv (recommended)

## 🛠️ Installation

### 1. Clone the repository

```bash
cd backend
```

### 2. Create and activate virtual environment

```bash
python -m venv venv

# On Linux/Mac
source venv/bin/activate

# On Windows
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` file with your configurations:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=crop_prediction_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
```

### 5. Set up PostgreSQL database

```bash
# Create database
createdb crop_prediction_db

# Or using psql
psql -U postgres
CREATE DATABASE crop_prediction_db;
\q
```

### 6. Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 7. Create superuser (optional)

```bash
python manage.py createsuperuser
```

### 8. Train the ML Model

```bash
cd ml_models
python train_model.py
```

### 9. Run the development server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register a new user |
| POST | `/api/auth/login/` | Login and get JWT tokens |
| POST | `/api/auth/refresh/` | Refresh access token |
| GET | `/api/auth/profile/` | Get user profile |
| PUT | `/api/auth/profile/` | Update user profile |

### Predictions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predict/` | Create a new prediction |
| GET | `/api/predictions/` | List user's predictions |
| GET | `/api/predictions/{id}/` | Get specific prediction |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/` | Get dashboard analytics |

## 📝 API Usage Examples

### Register User

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "SecurePass123",
    "password_confirm": "SecurePass123"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

Response:
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

### Make Prediction

```bash
curl -X POST http://localhost:8000/api/predict/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
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
  }'
```

Response:
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

### Get Dashboard

```bash
curl -X GET http://localhost:8000/api/dashboard/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🏗️ Project Structure

```
backend/
├── crop_prediction/          # Django project settings
│   ├── settings.py           # Main settings file
│   ├── urls.py               # Main URL configuration
│   ├── wsgi.py               # WSGI configuration
│   └── asgi.py               # ASGI configuration
│
├── apps/                     # Django apps
│   ├── users/                # User authentication app
│   │   ├── models.py         # Custom User model
│   │   ├── serializers.py    # User serializers
│   │   ├── views.py          # Authentication views
│   │   └── urls.py           # User URLs
│   │
│   ├── predictions/          # Predictions app
│   │   ├── models.py         # Prediction model
│   │   ├── serializers.py    # Prediction serializers
│   │   ├── views.py          # Prediction views
│   │   └── urls.py           # Prediction URLs
│   │
│   └── ml_model/             # ML model app
│       ├── predict.py        # Prediction logic
│       └── apps.py           # App configuration
│
├── ml_models/                # ML model files
│   ├── train_model.py        # Model training script
│   ├── crop_model.pkl        # Trained model
│   └── crop_yield.csv        # Training dataset
│
├── requirements.txt          # Python dependencies
├── manage.py                 # Django management script
└── .env.example              # Environment variables template
```

## 🔒 Security Features

- ✅ Password hashing using Django's built-in system
- ✅ JWT-based authentication with token expiration
- ✅ CORS configuration for frontend integration
- ✅ Input validation and sanitization
- ✅ SQL injection protection via Django ORM
- ✅ HTTPS enforcement in production
- ✅ Secure cookie settings

## 🚀 Performance Optimizations

- ✅ Database indexing on frequently queried fields
- ✅ Query optimization with `select_related` and `prefetch_related`
- ✅ ML model loaded once at startup (singleton pattern)
- ✅ Pagination for list endpoints
- ✅ Efficient aggregation queries

## 📊 ML Model Details

- **Algorithm**: Random Forest Regressor
- **Training Samples**: 15,751
- **Test Samples**: 3,938
- **R² Score**: 0.9739 (Test Set)
- **RMSE**: 144.54 (Test Set)
- **Features**: Crop, Season, State, Area, Rainfall, Fertilizer, Pesticide

## 🧪 Testing

```bash
# Run tests
python manage.py test

# Run tests with coverage
coverage run --source='.' manage.py test
coverage report
```

## 📦 Deployment

### Using Gunicorn

```bash
pip install gunicorn
gunicorn crop_prediction.wsgi:application --bind 0.0.0.0:8000
```

### Using Docker

```bash
docker build -t crop-prediction-backend .
docker run -p 8000:8000 crop-prediction-backend
```

### Environment Variables for Production

```env
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
SECRET_KEY=generate-a-strong-secret-key
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ using Django and Machine Learning

## 🆘 Support

For support, email support@example.com or open an issue in the repository.
