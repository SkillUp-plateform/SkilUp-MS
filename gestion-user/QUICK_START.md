# Quick Start Guide - Eureka + Docker Setup

## 🚀 Start Everything

### Step 1: Start Eureka Server (Windows Host)
```bash
cd c:\Users\m2l3k\Desktop\EurekaServer
mvn spring-boot:run
```
✅ Wait for: "Started ForminiMsApplication"

### Step 2: Rebuild & Start Docker Containers
```bash
cd c:\Users\m2l3k\Desktop\gestion-user
docker-compose build python-app
docker-compose up -d
```

### Step 3: Verify Everything Works
```bash
# Check Eureka Dashboard
start http://localhost:8761

# Check Python app health
curl http://localhost:8089/health

# Check logs
docker-compose logs python-app | findstr "Eureka"
```

## ✅ Success Indicators

1. **Eureka Dashboard** (http://localhost:8761):
   - Shows "USER-MANAGEMENT-SERVICE" with status UP

2. **Python App Logs**:
   ```
   Successfully registered 'user-management-service' with Eureka server
   ```

3. **Health Check** (http://localhost:8089/health):
   ```json
   {"status": "healthy", "keycloak": "connected", "database": "connected"}
   ```

## 🛑 Stop Everything

```bash
# Stop Docker containers
cd c:\Users\m2l3k\Desktop\gestion-user
docker-compose down

# Stop Eureka (Ctrl+C in its terminal)
```

## 📊 Useful Commands

```bash
# View all logs
docker-compose logs -f

# View Python app logs only
docker-compose logs -f python-app

# Restart Python app
docker-compose restart python-app

# Check container status
docker-compose ps

# Rebuild after code changes
docker-compose build python-app && docker-compose up -d python-app
```

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Service not in Eureka | Check if Eureka is running on port 8761 |
| Connection refused | Verify `host.docker.internal` works: `docker exec python_user_manager ping host.docker.internal` |
| Health check fails | Check: `curl http://localhost:8089/health` |
| Container won't start | Check logs: `docker-compose logs python-app` |

## 📝 Key Configuration

- **Eureka Server**: http://localhost:8761
- **Python App**: http://localhost:8089
- **Service Name**: user-management-service
- **Container Name**: python_user_manager
- **Keycloak**: http://localhost:8080
- **PostgreSQL**: localhost:5432

## 🎯 What's Configured

✅ Python app registers with Eureka on startup  
✅ Sends heartbeat every 30 seconds  
✅ Health check endpoint: `/health`  
✅ Accessible from other microservices via Eureka  
✅ Runs in Docker with Keycloak & PostgreSQL  

For detailed documentation, see `EUREKA_DOCKER_SETUP.md`
