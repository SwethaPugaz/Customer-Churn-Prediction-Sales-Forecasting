# API Documentation

Base URL: `http://localhost:5000/api`

## Customer Churn Prediction

### GET /predict_churn
Predict customers most likely to churn.

**Parameters:**
- `count` (optional): Number of predictions to return (default: 10)

**Response:**
```json
[
  {
    "customer_id": "C001",
    "last_purchase_date": "2024-12-15",
    "total_cancellations": 2,
    "subscription_status": "active",
    "churn_probability": 0.85
  }
]
```

### GET /churn_trends
Get churn trends over time.

**Response:**
```json
{
  "months": ["2024-01", "2024-02", "2024-03"],
  "churn_counts": [15, 23, 18]
}
```

### GET /churn_segmentation
Get customer segmentation by churn risk.

**Response:**
```json
{
  "Low Risk": 450,
  "Medium Risk": 250,
  "High Risk": 100
}
```

## Sales Forecasting

### GET /sales_forecast
Generate sales forecast.

**Parameters:**
- `days` (optional): Number of days to forecast (default: 30)

**Response:**
```json
{
  "dates": ["2025-01-01", "2025-01-02"],
  "predicted_sales": [1250.50, 1340.25],
  "confidence_lower": [1100.20, 1200.15],
  "confidence_upper": [1400.80, 1480.35]
}
```

### GET /full_sales_view
Get historical sales data and future forecast.

**Parameters:**
- `days` (optional): Number of forecast days (default: 90)

**Response:**
```json
{
  "historical_dates": ["2024-06-01", "2024-06-02"],
  "historical_sales": [1200.50, 1150.25],
  "forecast_dates": ["2025-01-01", "2025-01-02"],
  "forecast_sales": [1250.50, 1340.25]
}
```

### GET /sales_kpis
Get sales key performance indicators.

**Response:**
```json
{
  "total_revenue": 850000.50,
  "average_daily_sales": 2500.75,
  "best_month": "December 2024",
  "best_month_sales": 95000.25,
  "worst_month": "February 2024",
  "worst_month_sales": 45000.10
}
```

## Analytics & Insights

### GET /main_kpis
Get main dashboard KPIs.

**Response:**
```json
{
  "total_revenue": 850000.50,
  "total_orders": 1250,
  "average_order_value": 680.00,
  "churn_rate": 15.5
}
```

### GET /top_products
Get top 10 products by sales.

**Response:**
```json
[
  {
    "product_name": "Premium Widget",
    "category": "Electronics",
    "total_sales": 25000.50
  }
]
```

### GET /user_distribution
Get user distribution by country.

**Response:**
```json
[
  {
    "country": "USA",
    "user_count": 450
  },
  {
    "country": "UK",
    "user_count": 320
  }
]
```

### GET /sales_by_age
Get sales distribution by age groups.

**Response:**
```json
[
  {
    "age_group": "26-35",
    "total_sales": 25000
  },
  {
    "age_group": "36-45",
    "total_sales": 18000
  }
]
```

### GET /monthly_sales
Get monthly sales data.

**Response:**
```json
[
  {
    "month": "January 2024",
    "total_quantity": 1200
  }
]
```

### GET /yearly_sales
Get yearly sales data.

**Response:**
```json
[
  {
    "year": 2024,
    "total_quantity": 15000
  }
]
```

### GET /product_demand_forecast
Get product demand forecast for top products.

**Response:**
```json
[
  {
    "product_id": "P001",
    "product_name": "Premium Widget",
    "forecasted_demand_30_days": 150
  }
]
```

### GET /db_stats
Get database statistics.

**Response:**
```json
{
  "total_entries": 5000,
  "cancelled_count": 450,
  "cancelled_percentage": 9.0
}
```

## Data Management

### POST /upload_data
Upload Excel file to populate database.

**Request:**
- Content-Type: multipart/form-data
- Body: Excel file (.xls or .xlsx)

**Response:**
```json
{
  "message": "Successfully processed 1000 rows."
}
```

**Error Response:**
```json
{
  "error": "No file selected for uploading"
}
```

### GET /orders
Get all orders from database.

**Response:**
```json
[
  {
    "order_id": "O001",
    "customer_id": "C001",
    "product_id": "P001",
    "last_purchase_date": "2024-12-15",
    "unit_price": 50.00,
    "quantity": 2,
    "ratings": 4.5
  }
]
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `404`: Not Found
- `500`: Internal Server Error

Error response format:
```json
{
  "error": "Description of the error"
}
```

## Rate Limiting

Currently no rate limiting is implemented. For production deployment, consider implementing rate limiting based on IP address or API keys.

## Authentication

Currently no authentication is required. For production deployment, consider implementing:
- API key authentication
- JWT tokens
- OAuth 2.0

## CORS

CORS is enabled for all origins. In production, restrict to specific domains:
```python
CORS(app, origins=['https://yourdomain.com'])
```
