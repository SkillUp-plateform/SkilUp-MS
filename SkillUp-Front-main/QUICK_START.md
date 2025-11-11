# Quick Start Guide - API Gateway Integration

## 🚀 Start All Services (In Order)

### 1. Eureka Server
```bash
cd c:\Users\m2l3k\Desktop\EurekaServer
mvn spring-boot:run
```
**URL:** http://localhost:8761

---

### 2. User Management (Docker)
```bash
cd c:\Users\m2l3k\Desktop\gestion-user
docker-compose up -d
```
**URL:** http://localhost:8089

---

### 3. Microservices

**Feedback Service:**
```bash
cd "c:\Users\m2l3k\Desktop\Final microservices\feedback-service"
mvn spring-boot:run
```

**Formation Service:**
```bash
cd "c:\Users\m2l3k\Desktop\Final microservices\FormationMS"
mvn spring-boot:run
```

**Recrutement Service:**
```bash
cd "c:\Users\m2l3k\Desktop\Final microservices\recrutement"
mvn spring-boot:run
```

**Reclamation Service:**
```bash
cd "c:\Users\m2l3k\Desktop\Final microservices\reclamation\reclamation"
mvn spring-boot:run
```

---

### 4. API Gateway
```bash
cd "c:\Users\m2l3k\Desktop\Final microservices\Gateway"
mvn spring-boot:run
```
**URL:** http://localhost:9095

---

### 5. Frontend
```bash
cd c:\Users\m2l3k\Desktop\SkillUp-Front-main
npm install
npm start
```
**URL:** http://localhost:4200

---

## 📋 API Gateway Routes

| Service | Frontend URL | Gateway Route | Backend |
|---------|-------------|---------------|---------|
| Feedback | `environment.feedbackService` | `/feedbackMS/**` | localhost:9094 |
| Formation | `environment.formationService` | `/FormationMS/**` | localhost:9094 |
| Recrutement | `environment.recrutementService` | `/recrutementMS/**` | localhost:9095 |
| Reclamation | `environment.reclamationService` | `/reclamationMS/**` | localhost:8080 |
| User Mgmt | `environment.userManagementService` | `/user-management/**` | localhost:8089 |

---

## 🧪 Quick Test

### Test Gateway
```bash
curl http://localhost:9095/feedbackMS/feedback/getAllFeedbacks
curl http://localhost:9095/FormationMS/formation/all
curl http://localhost:9095/user-management/api/admin/keycloak/users?role=user
```

### Check Eureka
Open browser: http://localhost:8761

Verify all services are registered:
- FEEDBACKMS
- FORMATIONMS
- RECRUTEMENTMS
- RECLAMATIONMS
- GATEWAY

---

## ✅ Checklist

- [ ] Eureka Server running (port 8761)
- [ ] Docker containers running (user management)
- [ ] All microservices started
- [ ] API Gateway running (port 9095)
- [ ] All services registered in Eureka
- [ ] Frontend running (port 4200)
- [ ] Test API calls through Gateway

---

## 🔧 Environment Variables

Frontend uses these from `environment.ts`:

```typescript
apiGateway: 'http://localhost:9095'
feedbackService: 'http://localhost:9095/feedbackMS'
formationService: 'http://localhost:9095/FormationMS'
recrutementService: 'http://localhost:9095/recrutementMS'
reclamationService: 'http://localhost:9095/reclamationMS'
userManagementService: 'http://localhost:9095/user-management'
```

---

## 🐛 Troubleshooting

**Service not found?**
→ Check Eureka Dashboard: http://localhost:8761

**Connection refused?**
→ Verify service is running: `curl http://localhost:[PORT]/actuator/health`

**404 Not Found?**
→ Check Gateway routes in `GatewayConfig.java`

**CORS errors?**
→ Gateway should handle CORS automatically

---

## 📞 Ports Summary

| Service | Port |
|---------|------|
| Frontend | 4200 |
| Eureka | 8761 |
| Gateway | 9095 |
| Feedback | 9094 |
| Formation | 9094 |
| Recrutement | 9095 |
| Reclamation | 8080 |
| User Management | 8089 |
| Keycloak | 8080 |

---

**All set! Your frontend now communicates through the API Gateway** 🎉
