# Configuration Template for Customer Churn Prediction & Sales Forecasting Backend
# Copy this file to config.py and update with your actual values

# Database Configuration
DATABASE_CONFIG = {
    'DB_NAME': 'hackathon',
    'DB_USER': 'postgres',
    'DB_PASS': 'your_password_here',  # Change this!
    'DB_HOST': 'localhost',
    'DB_PORT': '5432'
}

# Flask Configuration
FLASK_CONFIG = {
    'HOST': '0.0.0.0',
    'PORT': 5000,
    'DEBUG': True
}

# Model Configuration
MODEL_CONFIG = {
    'CHURN_MODEL_PATH': 'churn_model.pkl',
    'SALES_MODEL_PATH': 'sales_forecaster.pkl',
    'RANDOM_STATE': 42
}

# Data Processing Configuration
DATA_CONFIG = {
    'REFERENCE_DATE': '2025-09-27',  # Fixed reference date for consistency
    'CHURN_THRESHOLD_DAYS': 365,    # Days since last purchase to consider churned
    'DEFAULT_FORECAST_DAYS': 30      # Default number of days to forecast
}

# API Configuration
API_CONFIG = {
    'MAX_CHURN_PREDICTIONS': 100,   # Maximum number of churn predictions to return
    'MAX_FORECAST_DAYS': 365,       # Maximum days for sales forecast
    'CORS_ORIGINS': ['*']           # CORS allowed origins
}
