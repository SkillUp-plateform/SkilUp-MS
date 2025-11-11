# Eureka Client Configuration for Python Flask App

## Overview
This Python Flask application is now configured to register with the Eureka Server as a microservice client.

## Configuration Details

### Service Registration
- **Service Name**: `user-management-service`
- **Port**: `8089`
- **Health Check Endpoint**: `/health`

### Environment Variables

You can customize the Eureka registration using these environment variables:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `EUREKA_SERVER_URL` | `http://localhost:8761/eureka/` | URL of the Eureka server |
| `INSTANCE_HOST` | `localhost` | Hostname/IP where this service is accessible |
| `FLASK_PORT` | `8089` | Port on which Flask app runs |

### Example Usage

#### Local Development
```bash
# Default configuration (connects to localhost:8761)
python app.py
```

#### Docker/Production Environment
```bash
# Set custom Eureka server URL
export EUREKA_SERVER_URL="http://eureka-server:8761/eureka/"
export INSTANCE_HOST="user-service"
python app.py
```

#### Docker Compose Configuration (Already Configured)
The `docker-compose.yml` has been updated with Eureka configuration:
```yaml
python-app:
  environment:
    - EUREKA_SERVER_URL=http://host.docker.internal:8761/eureka/
    - INSTANCE_HOST=python_user_manager
    - FLASK_PORT=8089
```

**Important Notes for Docker:**
- `host.docker.internal` allows the container to reach the Eureka server running on your host machine
- `INSTANCE_HOST=python_user_manager` registers the service with the container name
- The Eureka server must be running on your host machine (Windows) at port 8761

## Installation

Install the required dependencies:
```bash
pip install -r requirements.txt
```

## Verification

1. **Start Eureka Server** (on port 8761)
2. **Start Python Flask App**:
   ```bash
   python app.py
   ```
3. **Check Eureka Dashboard**: Navigate to `http://localhost:8761`
   - You should see `USER-MANAGEMENT-SERVICE` registered
4. **Verify Health Check**: `http://localhost:8089/health`

## Features

- **Automatic Registration**: App registers with Eureka on startup
- **Health Monitoring**: Eureka polls `/health` endpoint every 30 seconds
- **Graceful Degradation**: If Eureka is unavailable, app continues to run
- **Service Discovery**: Other microservices can discover this service via Eureka

## Troubleshooting

### Service Not Appearing in Eureka
1. Check Eureka server is running on port 8761
2. Verify `EUREKA_SERVER_URL` is correct
3. Check application logs for registration errors
4. Ensure `/health` endpoint returns 200 status

### Connection Errors
- Verify network connectivity between services
- Check firewall rules
- Ensure `INSTANCE_HOST` is accessible from Eureka server
