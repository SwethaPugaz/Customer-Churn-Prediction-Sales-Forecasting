#!/usr/bin/env python3
"""
Setup script for Customer Churn Prediction & Sales Forecasting Backend
This script helps set up the environment and initialize the database.
"""

import os
import sys
import subprocess
import psycopg2
from psycopg2 import sql

# Database configuration
DB_CONFIG = {
    'DB_NAME': 'hackathon',
    'DB_USER': 'postgres',
    'DB_PASS': 'Post@7070',  # Change this to your password
    'DB_HOST': 'localhost',
    'DB_PORT': '5432'
}

def run_command(command, description):
    """Run a shell command and handle errors."""
    print(f"\n📦 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error in {description}: {e}")
        print(f"Output: {e.output}")
        return False

def create_database_tables():
    """Create the required database tables."""
    print("\n🗄️  Setting up database tables...")
    
    try:
        conn = psycopg2.connect(
            database=DB_CONFIG['DB_NAME'],
            user=DB_CONFIG['DB_USER'],
            password=DB_CONFIG['DB_PASS'],
            host=DB_CONFIG['DB_HOST'],
            port=DB_CONFIG['DB_PORT']
        )
        cursor = conn.cursor()
        
        # Create tables
        tables = [
            """
            CREATE TABLE IF NOT EXISTS customers (
                customer_id VARCHAR(50) PRIMARY KEY,
                age INTEGER,
                gender VARCHAR(20),
                country VARCHAR(50),
                signup_date DATE
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS products (
                product_id VARCHAR(50) PRIMARY KEY,
                product_name VARCHAR(200),
                category VARCHAR(100)
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS orders (
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
            """
        ]
        
        for table_sql in tables:
            cursor.execute(table_sql)
        
        conn.commit()
        cursor.close()
        conn.close()
        print("✅ Database tables created successfully")
        return True
        
    except Exception as e:
        print(f"❌ Database setup error: {e}")
        return False

def main():
    """Main setup function."""
    print("🚀 Customer Churn Prediction & Sales Forecasting Backend Setup")
    print("=" * 60)
    
    # Step 1: Check Python version
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ is required")
        sys.exit(1)
    print(f"✅ Python {sys.version.split()[0]} detected")
    
    # Step 2: Install dependencies
    if not run_command("pip install -r requirements.txt", "Installing Python dependencies"):
        print("❌ Failed to install dependencies. Please check your pip installation.")
        sys.exit(1)
    
    # Step 3: Setup database
    if not create_database_tables():
        print("❌ Database setup failed. Please check your PostgreSQL configuration.")
        sys.exit(1)
    
    # Step 4: Import sample data (optional)
    print("\n📊 Would you like to import sample data? (y/n): ", end="")
    if input().lower() == 'y':
        if run_command("python test.py", "Importing sample data"):
            print("✅ Sample data imported successfully")
        else:
            print("⚠️  Sample data import failed, but you can continue")
    
    # Step 5: Train models (optional)
    print("\n🤖 Would you like to train the ML models? (y/n): ", end="")
    if input().lower() == 'y':
        if run_command("python train_model.py", "Training churn prediction model"):
            print("✅ Churn model trained successfully")
        else:
            print("⚠️  Churn model training failed")
            
        if run_command("python train_forcaster.py", "Training sales forecasting model"):
            print("✅ Sales forecasting model trained successfully")
        else:
            print("⚠️  Sales forecasting model training failed")
    
    print("\n" + "=" * 60)
    print("🎉 Setup completed!")
    print("\n📋 Next steps:")
    print("1. Update database credentials in Python files if needed")
    print("2. Run 'python app.py' to start the API server")
    print("3. Access the API at http://localhost:5000")
    print("\n📖 Check README.md for detailed documentation")

if __name__ == "__main__":
    main()
