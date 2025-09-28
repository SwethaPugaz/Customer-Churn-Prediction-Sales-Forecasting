# Deployment Guide

## Local Development Setup

### Prerequisites
- Python 3.8+
- PostgreSQL 12+
- Git

### Quick Start
1. Clone the repository
2. Run the setup script: `python setup.py`
3. Start the API: `python app.py`

## Production Deployment

### Docker Deployment (Recommended)

Create a `Dockerfile`:
```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]
```

Create a `docker-compose.yml`:
```yaml
version: '3.8'

services:
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: hackathon
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  api:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - db
    environment:
      DB_HOST: db
      DB_NAME: hackathon
      DB_USER: postgres
      DB_PASS: your_password
    volumes:
      - .:/app

volumes:
  postgres_data:
```

### Cloud Deployment Options

#### 1. Heroku
```bash
# Install Heroku CLI and login
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

#### 2. AWS EC2
- Launch Ubuntu EC2 instance
- Install Python, PostgreSQL, and dependencies
- Clone repository and run setup
- Use nginx as reverse proxy
- Set up SSL with Let's Encrypt

#### 3. Google Cloud Platform
- Use Google Cloud Run for serverless deployment
- Use Cloud SQL for PostgreSQL database
- Configure environment variables

### Environment Variables for Production
```bash
export DB_HOST=your_db_host
export DB_NAME=your_db_name
export DB_USER=your_db_user
export DB_PASS=your_db_password
export FLASK_ENV=production
```

## Monitoring and Maintenance

### Health Checks
Add to `app.py`:
```python
@app.route('/health')
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})
```

### Logging
```python
import logging
logging.basicConfig(level=logging.INFO)
```

### Model Retraining Schedule
- Set up cron jobs to retrain models periodically
- Monitor model performance metrics
- Update models when performance degrades

## Security Considerations

1. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Restrict database access by IP

2. **API Security**
   - Implement rate limiting
   - Add authentication if needed
   - Use HTTPS in production

3. **Environment Variables**
   - Never commit credentials to version control
   - Use environment variables or secret management services
