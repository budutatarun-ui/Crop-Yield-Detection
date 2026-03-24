#!/bin/bash

# Smart Crop Yield Prediction System - Setup Script
# This script automates the setup process for the backend

set -e  # Exit on error

echo "=========================================="
echo "Smart Crop Yield Prediction System Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python 3 is not installed.${NC}"
    echo "Please install Python 3.8 or higher."
    exit 1
fi

echo -e "${GREEN}✓ Python 3 found${NC}"

# Check Python version
PYTHON_VERSION=$(python3 --version | cut -d " " -f 2 | cut -d "." -f 1,2)
REQUIRED_VERSION="3.8"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo -e "${RED}Error: Python version must be 3.8 or higher${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Python version: $PYTHON_VERSION${NC}"

# Create virtual environment
echo ""
echo "Creating virtual environment..."
python3 -m venv venv

echo -e "${GREEN}✓ Virtual environment created${NC}"

# Activate virtual environment
echo ""
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo ""
echo "Upgrading pip..."
pip install --upgrade pip

echo -e "${GREEN}✓ pip upgraded${NC}"

# Install dependencies
echo ""
echo "Installing dependencies..."
pip install -r requirements.txt

echo -e "${GREEN}✓ Dependencies installed${NC}"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "Creating .env file from template..."
    cp .env.example .env
    echo -e "${YELLOW}⚠ Please update .env file with your database credentials${NC}"
else
    echo -e "${YELLOW}⚠ .env file already exists${NC}"
fi

# Create logs directory
mkdir -p logs
echo -e "${GREEN}✓ Logs directory created${NC}"

# Check if PostgreSQL is running
echo ""
echo "Checking PostgreSQL connection..."
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✓ PostgreSQL client found${NC}"
else
    echo -e "${YELLOW}⚠ PostgreSQL client not found. Please install PostgreSQL.${NC}"
fi

# Run migrations
echo ""
echo "Running database migrations..."
python manage.py makemigrations
python manage.py migrate

echo -e "${GREEN}✓ Migrations completed${NC}"

# Ask if user wants to create superuser
echo ""
read -p "Do you want to create a superuser? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    python manage.py createsuperuser
fi

# Check if ML model exists
echo ""
if [ -f "ml_models/crop_model.pkl" ]; then
    echo -e "${GREEN}✓ ML model found${NC}"
else
    echo -e "${YELLOW}⚠ ML model not found${NC}"
    read -p "Do you want to train the ML model now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd ml_models
        python train_model.py
        cd ..
        echo -e "${GREEN}✓ Model trained successfully${NC}"
    else
        echo -e "${YELLOW}⚠ You can train the model later using: cd ml_models && python train_model.py${NC}"
    fi
fi

# Collect static files
echo ""
echo "Collecting static files..."
python manage.py collectstatic --noinput

echo -e "${GREEN}✓ Static files collected${NC}"

# Print success message
echo ""
echo "=========================================="
echo -e "${GREEN}Setup completed successfully!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Update .env file with your database credentials"
echo "2. Activate virtual environment: source venv/bin/activate"
echo "3. Run the development server: python manage.py runserver"
echo ""
echo "For more information, see README.md"
echo ""
