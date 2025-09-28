# Customer Churn Prediction & Sales Forecasting Backend

A comprehensive Flask-based REST API for customer churn prediction and sales forecasting using machine learning models.

## 🚀 Features

- **Customer Churn Prediction**: Predict which customers are likely to churn using Random Forest model
- **Sales Forecasting**: Forecast future sales using SARIMAX time series model
- **Data Analytics**: Various endpoints for customer insights and business KPIs
- **Data Import**: Upload Excel files to populate the database
- **Real-time Predictions**: Get instant predictions via REST API endpoints

## 📋 Prerequisites

- Python 3.8+
- PostgreSQL database
- Required Python packages (see requirements.txt)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SwethaPugaz/Customer-Churn-Prediction-Sales-Forecasting.git
   cd Customer-Churn-Prediction-Sales-Forecasting/backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up PostgreSQL Database**
   - Install PostgreSQL
   - Create a database named `hackathon`
   - Update database credentials in the Python files

5. **Create database tables**
   ```sql
   -- Create customers table
   CREATE TABLE customers (
       customer_id VARCHAR(50) PRIMARY KEY,
       age INTEGER,
       gender VARCHAR(20),
       country VARCHAR(50),
       signup_date DATE
   );

   -- Create products table
   CREATE TABLE products (
       product_id VARCHAR(50) PRIMARY KEY,
       product_name VARCHAR(200),
       category VARCHAR(100)
   );

   -- Create orders table
   CREATE TABLE orders (
       order_id VARCHAR(50) PRIMARY KEY,
       customer_id VARCHAR(50) REFERENCES customers(customer_id),
       product_id VARCHAR(50) REFERENCES products(product_id),
       last_purchase_date DATE,
       cancellations_count INTEGER,
       subscription_status VARCHAR(50),
       unit_price DECIMAL(10,2),
       quantity INTEGER,
       purchase_frequency DECIMAL(10,2),
       ratings DECIMAL(3,2)
   );
   ```

## 🔧 Configuration

Update the database connection details in the following files:
- `app.py`
- `train_model.py`
- `train_forcaster.py`
- `test.py`

```python
DB_NAME = "hackathon"
DB_USER = "postgres"
DB_PASS = "your_password_here"
DB_HOST = "localhost"
DB_PORT = "5432"
```

## 🚀 Usage

### 1. Import Data
First, populate your database with sample data:
```bash
python test.py
```

### 2. Train Models
Train the churn prediction model:
```bash
python train_model.py
```

Train the sales forecasting model:
```bash
python train_forcaster.py
```

### 3. Start the API Server
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## 📊 API Endpoints

### Customer Churn Prediction
- `GET /api/predict_churn?count=10` - Get top N customers likely to churn
- `GET /api/churn_trends` - Get churn trends over time
- `GET /api/churn_segmentation` - Get churn risk segmentation

### Sales Forecasting
- `GET /api/sales_forecast?days=30` - Get sales forecast for N days
- `GET /api/full_sales_view?days=90` - Get historical and forecast data
- `GET /api/sales_kpis` - Get sales key performance indicators

### Analytics & Insights
- `GET /api/main_kpis` - Main dashboard KPIs (Revenue, Orders, AOV, Churn Rate)
- `GET /api/top_products` - Top 10 products by sales
- `GET /api/user_distribution` - User distribution by country
- `GET /api/sales_by_age` - Sales distribution by age groups
- `GET /api/monthly_sales` - Monthly sales data
- `GET /api/yearly_sales` - Yearly sales data
- `GET /api/product_demand_forecast` - Product demand forecast

### Data Management
- `POST /api/upload_data` - Upload Excel file to populate database
- `GET /api/orders` - Get all orders
- `GET /api/db_stats` - Database statistics

## 📁 File Structure

```
backend/
├── app.py                          # Main Flask application
├── train_model.py                  # Train churn prediction model
├── train_forcaster.py             # Train sales forecasting model
├── analyze_churn.py               # Churn analysis utilities
├── data_importer.py               # Data import utilities
├── test.py                        # Data import script
├── churn_model.pkl                # Trained churn model (generated)
├── sales_forecaster.pkl           # Trained sales model (generated)
├── requirements.txt               # Python dependencies
├── README.md                      # This file
├── .gitignore                     # Git ignore rules
└── E-Commerce Customer Insights and Churn Dataset3938d09.xls  # Sample data
```

## 🤖 Machine Learning Models

### Churn Prediction Model
- **Algorithm**: Random Forest Classifier
- **Features**: Customer age, purchase behavior, tenure, ratings, cancellations
- **Preprocessing**: Standard scaling, SMOTE for class imbalance
- **Output**: Churn probability and binary prediction

### Sales Forecasting Model
- **Algorithm**: SARIMAX (Seasonal AutoRegressive Integrated Moving Average with eXogenous variables)
- **Features**: Time series of daily sales data
- **Parameters**: ARIMA(1,1,1) with seasonal(1,1,1,7) for weekly seasonality
- **Output**: Future sales predictions with confidence intervals

## 📈 Model Performance

### Churn Model Metrics
- Handles class imbalance using SMOTE
- Feature engineering includes recency, frequency, and monetary metrics
- ROC-AUC score evaluation for model performance

### Sales Forecasting Accuracy
- Weekly seasonality modeling
- Confidence intervals for uncertainty quantification
- Daily granularity predictions

## 🔒 Security Considerations

- Database credentials should be stored in environment variables
- Input validation for API endpoints
- CORS enabled for cross-origin requests

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure database and tables exist

2. **Model Files Not Found**
   - Run training scripts first: `python train_model.py` and `python train_forcaster.py`
   - Check file permissions

3. **Import Errors**
   - Ensure all dependencies are installed: `pip install -r requirements.txt`
   - Activate virtual environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Swetha Pugaz** - *Initial work* - [SwethaPugaz](https://github.com/SwethaPugaz)

## 🙏 Acknowledgments

- Thanks to the open-source community for the amazing ML libraries
- Special thanks to contributors and testers
