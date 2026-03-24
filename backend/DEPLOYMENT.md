# Deployment Guide - Smart Crop Yield Prediction System

This guide covers different deployment options for the backend.

## Table of Contents

1. [Local Development](#local-development)
2. [Production Deployment](#production-deployment)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment](#cloud-deployment)

---

## Local Development

### Prerequisites
- Python 3.8+
- PostgreSQL 12+
- Git

### Steps

1. **Clone and Setup**
```bash
git clone <repository-url>
cd backend
./setup.sh
```

2. **Activate Virtual Environment**
```bash
source venv/bin/activate
```

3. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your settings
```

4. **Run Development Server**
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

---

## Production Deployment

### Preparing for Production

1. **Update Settings**

Edit `.env`:
```env
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
SECRET_KEY=<generate-a-strong-secret-key>
```

2. **Install Gunicorn**
```bash
pip install gunicorn
```

3. **Collect Static Files**
```bash
python manage.py collectstatic
```

4. **Run with Gunicorn**
```bash
gunicorn --bind 0.0.0.0:8000 --workers 3 crop_prediction.wsgi:application
```

### Nginx Configuration

Create `/etc/nginx/sites-available/crop-prediction`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location = /favicon.ico { access_log off; log_not_found off; }

    location /static/ {
        root /path/to/backend;
    }

    location /media/ {
        root /path/to/backend;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/crop-prediction /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Systemd Service

Create `/etc/systemd/system/crop-prediction.service`:

```ini
[Unit]
Description=Crop Prediction Django Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/backend
Environment="PATH=/path/to/backend/venv/bin"
ExecStart=/path/to/backend/venv/bin/gunicorn \
    --workers 3 \
    --bind 127.0.0.1:8000 \
    crop_prediction.wsgi:application

[Install]
WantedBy=multi-user.target
```

Start the service:
```bash
sudo systemctl start crop-prediction
sudo systemctl enable crop-prediction
sudo systemctl status crop-prediction
```

### SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Docker Deployment

### Using Docker Compose

1. **Build and Run**
```bash
docker-compose up -d --build
```

2. **Run Migrations**
```bash
docker-compose exec web python manage.py migrate
```

3. **Create Superuser**
```bash
docker-compose exec web python manage.py createsuperuser
```

4. **View Logs**
```bash
docker-compose logs -f web
```

5. **Stop Services**
```bash
docker-compose down
```

### Production Docker Setup

1. **Build Production Image**
```bash
docker build -t crop-prediction:latest .
```

2. **Run Container**
```bash
docker run -d \
  --name crop-prediction \
  -p 8000:8000 \
  -e DEBUG=False \
  -e DB_HOST=postgres-host \
  -e DB_NAME=crop_prediction_db \
  -e DB_USER=postgres \
  -e DB_PASSWORD=password \
  crop-prediction:latest
```

---

## Cloud Deployment

### AWS (Elastic Beanstalk)

1. **Install EB CLI**
```bash
pip install awsebcli
```

2. **Initialize EB**
```bash
eb init -p python-3.11 crop-prediction
```

3. **Create Environment**
```bash
eb create crop-prediction-env
```

4. **Deploy**
```bash
eb deploy
```

### Heroku

1. **Create Procfile**
```
web: gunicorn crop_prediction.wsgi:application --log-file -
release: python manage.py migrate
```

2. **Create runtime.txt**
```
python-3.11.0
```

3. **Deploy**
```bash
heroku create crop-prediction-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

### Google Cloud Platform (Cloud Run)

1. **Create Dockerfile** (already exists)

2. **Build and Push**
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/crop-prediction
```

3. **Deploy**
```bash
gcloud run deploy crop-prediction \
  --image gcr.io/PROJECT_ID/crop-prediction \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### DigitalOcean App Platform

1. **Create app.yaml**
```yaml
name: crop-prediction
services:
- name: web
  github:
    repo: your-username/crop-prediction
    branch: main
  build_command: pip install -r requirements.txt
  run_command: gunicorn --worker-tmp-dir /dev/shm crop_prediction.wsgi:application
  envs:
  - key: DEBUG
    value: "False"
databases:
- name: db
  engine: PG
  version: "15"
```

2. **Deploy via Dashboard or CLI**

---

## Post-Deployment Checklist

- [ ] Set `DEBUG=False` in production
- [ ] Generate a strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Set up SSL certificate
- [ ] Configure database backups
- [ ] Set up monitoring and logging
- [ ] Configure CORS for frontend domain
- [ ] Test all API endpoints
- [ ] Set up rate limiting
- [ ] Configure email backend (if needed)
- [ ] Set up static file serving (CDN)
- [ ] Train and deploy ML model

---

## Monitoring and Logging

### Using Sentry

1. **Install Sentry SDK**
```bash
pip install sentry-sdk
```

2. **Configure in settings.py**
```python
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn="your-sentry-dsn",
    integrations=[DjangoIntegration()],
    traces_sample_rate=1.0,
)
```

### Using PostgreSQL Logs

```bash
# View PostgreSQL logs
tail -f /var/log/postgresql/postgresql-15-main.log
```

### Application Logs

```bash
# View Django logs
tail -f /path/to/backend/logs/django.log
```

---

## Backup and Restore

### Database Backup

```bash
# Backup
pg_dump -U postgres crop_prediction_db > backup.sql

# Restore
psql -U postgres crop_prediction_db < backup.sql
```

### Using Docker

```bash
# Backup
docker-compose exec db pg_dump -U postgres crop_prediction_db > backup.sql

# Restore
docker-compose exec -T db psql -U postgres crop_prediction_db < backup.sql
```

---

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Static Files Not Loading**
   - Run `python manage.py collectstatic`
   - Check `STATIC_ROOT` and `STATIC_URL` settings
   - Verify Nginx configuration

3. **CORS Errors**
   - Update `CORS_ALLOWED_ORIGINS` in `.env`
   - Check CORS middleware is installed

4. **JWT Token Errors**
   - Check token expiration settings
   - Verify token is included in Authorization header

---

## Support

For deployment assistance:
- Email: support@example.com
- Documentation: https://docs.example.com
- GitHub Issues: https://github.com/username/repo/issues
