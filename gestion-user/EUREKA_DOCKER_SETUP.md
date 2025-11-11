# Eureka Integration with Docker Setup

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         Windows Host Machine            │
│                                          │
│  ┌────────────────────────────────┐    │
│  │   Eureka Server                │    │
│  │   Port: 8761                   │    │
│  │   (Spring Boot)                │    │
│  └────────────────────────────────┘    │
│              ▲                          │
│              │ Registration             │
│              │ & Heartbeat              │
│  ┌───────────┴──────────────────────┐  │
│  │   Docker Network: my-network     │  │
│  │                                   │  │
│  │  ┌─────────────────────────┐    │  │
│  │  │  python_user_manager    │    │  │
│  │  │  (Flask App)            │    │  │
│  │  │  Port: 8089             │    │  │
│  │  │  Service: user-mgmt     │    │  │
│  │  └─────────────────────────┘    │  │
│  │                                   │  │
│  │  ┌─────────────────────────┐    │  │
│  │  │  keycloak_server        │    │  │
│  │  │  Port: 8080             │    │  │
│  │  └─────────────────────────┘    │  │
│  │                                   │  │
│  │  ┌─────────────────────────┐    │  │
│  │  │  postgres_db            │    │  │
│  │  │  Port: 5432             │    │  │
│  │  └─────────────────────────┘    │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Configuration Summary

### What Was Changed

1. **requirements.txt** - Added `py-eureka-client==0.11.11`
2. **app.py** - Added Eureka client initialization
3. **docker-compose.yml** - Added Eureka environment variables:
   - `EUREKA_SERVER_URL=http://host.docker.internal:8761/eureka/`
   - `INSTANCE_HOST=python_user_manager`

### How It Works

1. **Eureka Server** runs on your Windows host at `localhost:8761`
2. **Python container** connects to Eureka using `host.docker.internal:8761`
3. **Service registration** happens automatically when the container starts
4. **Health checks** are sent every 30 seconds to `/health` endpoint
5. **Service discovery** allows other services to find the Python app via Eureka

## Step-by-Step Setup

### 1. Start Eureka Server (Host Machine)

```bash
cd c:\Users\m2l3k\Desktop\EurekaServer
mvn spring-boot:run
```

Wait until you see:
```
Started ForminiMsApplication in X.XXX seconds
```

Verify Eureka is running: Open http://localhost:8761 in your browser

### 2. Rebuild Python Container (with new dependencies)

```bash
cd c:\Users\m2l3k\Desktop\gestion-user
docker-compose build python-app
```

This rebuilds the container with the new `py-eureka-client` dependency.

### 3. Start Docker Services

```bash
docker-compose up -d
```

Or to see logs:
```bash
docker-compose up
```

### 4. Verify Registration

#### Check Container Logs
```bash
docker-compose logs python-app
```

Look for:
```
INFO:__main__:Registering with Eureka server at http://host.docker.internal:8761/eureka/
INFO:__main__:Successfully registered 'user-management-service' with Eureka server
```

#### Check Eureka Dashboard
1. Open http://localhost:8761
2. Look for **USER-MANAGEMENT-SERVICE** in the "Instances currently registered with Eureka" section
3. You should see:
   - **Application**: USER-MANAGEMENT-SERVICE
   - **Status**: UP
   - **Instance ID**: python_user_manager:user-management-service:8089

#### Test Health Endpoint
```bash
curl http://localhost:8089/health
```

Expected response:
```json
{
  "status": "healthy",
  "keycloak": "connected",
  "database": "connected",
  "realm": "my-app-realm"
}
```

## Troubleshooting

### Issue: Service Not Appearing in Eureka

**Check 1: Eureka Server Running**
```bash
curl http://localhost:8761
```
Should return Eureka dashboard HTML.

**Check 2: Container Can Reach Host**
```bash
docker exec python_user_manager ping host.docker.internal
```

**Check 3: Python App Logs**
```bash
docker-compose logs python-app | grep -i eureka
```

### Issue: Registration Failed

**Possible causes:**
1. Eureka server not running on host
2. Windows firewall blocking port 8761
3. Docker Desktop networking issue

**Solution:**
```bash
# Check if Eureka is accessible from container
docker exec python_user_manager curl http://host.docker.internal:8761/eureka/apps

# If this fails, check Windows Firewall settings
```

### Issue: Service Shows as DOWN

**Check health endpoint:**
```bash
curl http://localhost:8089/health
```

If health check fails, the service will show as DOWN in Eureka.

### Issue: Container Can't Reach Eureka on Host

**For Windows with Docker Desktop:**
- `host.docker.internal` should work by default
- If not, try using your actual IP address:
  ```yaml
  - EUREKA_SERVER_URL=http://192.168.x.x:8761/eureka/
  ```

**Find your IP:**
```bash
ipconfig | findstr IPv4
```

## Environment Variables Reference

| Variable | Value | Purpose |
|----------|-------|---------|
| `EUREKA_SERVER_URL` | `http://host.docker.internal:8761/eureka/` | Eureka server endpoint |
| `INSTANCE_HOST` | `python_user_manager` | Service hostname for registration |
| `FLASK_PORT` | `8089` | Port where Flask app runs |

## Service Discovery Usage

Once registered, other services can discover the Python app through Eureka:

```java
// Example: Spring Boot service discovering Python app
@Autowired
private DiscoveryClient discoveryClient;

List<ServiceInstance> instances = 
    discoveryClient.getInstances("user-management-service");
    
ServiceInstance instance = instances.get(0);
String url = instance.getUri().toString(); // http://python_user_manager:8089
```

## Stopping Services

```bash
# Stop all containers
docker-compose down

# Stop Eureka server
# Press Ctrl+C in the terminal where it's running
```

## Quick Commands

```bash
# View all logs
docker-compose logs -f

# View Python app logs only
docker-compose logs -f python-app

# Restart Python app
docker-compose restart python-app

# Check service status
docker-compose ps

# Access Eureka dashboard
start http://localhost:8761
```

## Production Considerations

For production deployment:

1. **Run Eureka in Docker** instead of on host:
   ```yaml
   eureka-server:
     image: your-eureka-image
     ports:
       - "8761:8761"
     networks:
       - my-network
   ```

2. **Update Python app environment**:
   ```yaml
   - EUREKA_SERVER_URL=http://eureka-server:8761/eureka/
   ```

3. **Use proper hostnames** for service discovery
4. **Configure Eureka high availability** (multiple Eureka servers)
5. **Set up proper health checks** and monitoring
