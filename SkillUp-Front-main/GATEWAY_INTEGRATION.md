# Frontend - API Gateway Integration Guide

## 🎯 Overview

This guide explains how the Angular frontend communicates with backend microservices through the **API Gateway** instead of calling services directly.

---

## 🏗️ Architecture

### Before (Direct Calls)
```
Frontend → Feedback Service (port 9094)
Frontend → Formation Service (port 9094)
Frontend → Recrutement Service (port 9095)
Frontend → Reclamation Service (port 8080)
Frontend → User Management (port 8089)
```

### After (Through Gateway)
```
Frontend → API Gateway (port 9095) → Feedback Service
                                   → Formation Service
                                   → Recrutement Service
                                   → Reclamation Service
                                   → User Management
```

---

## 📋 Gateway Routes Configuration

The API Gateway is configured with the following routes:

| Service | Gateway Route | Backend Service | Port |
|---------|--------------|-----------------|------|
| **Feedback** | `/feedbackMS/**` | feedbackMS | 9094 |
| **Formation** | `/FormationMS/**` | FormationMS | 9094 |
| **Recrutement** | `/recrutementMS/**` | recrutementMS | 9095 |
| **Reclamation** | `/reclamationMS/**` | reclamationMS | 8080 |
| **User Management** | `/user-management/**` | Python Service | 8089 |
| **Quiz** | `/Quiz/**` | Quiz | - |
| **Projet** | `/projetMS/**` | projetMS | - |
| **Access Code** | `/accesscodeMS/**` | accesscodeMS | - |

---

## 🔧 Environment Configuration

### Development (`environment.ts`)

```typescript
export const environment = {
  production: false,
  
  // API Gateway URL
  apiGateway: 'http://localhost:9095',
  
  // Microservice routes through Gateway
  feedbackService: 'http://localhost:9095/feedbackMS',
  formationService: 'http://localhost:9095/FormationMS',
  recrutementService: 'http://localhost:9095/recrutementMS',
  reclamationService: 'http://localhost:9095/reclamationMS',
  userManagementService: 'http://localhost:9095/user-management',
  quizService: 'http://localhost:9095/Quiz',
  projetService: 'http://localhost:9095/projetMS',
  accessCodeService: 'http://localhost:9095/accesscodeMS'
};
```

---

## 📝 Updated Services

### 1. Feedback Service

**Before:**
```typescript
private apiUrl = 'http://localhost:9094/feedback';
```

**After:**
```typescript
import { environment } from '../environments/environment';

private apiUrl = `${environment.feedbackService}/feedback`;
// Resolves to: http://localhost:9095/feedbackMS/feedback
```

**API Calls:**
```typescript
// Add feedback
POST http://localhost:9095/feedbackMS/feedback/addFeedback

// Get all feedbacks
GET http://localhost:9095/feedbackMS/feedback/getAllFeedbacks

// Get feedback by user
GET http://localhost:9095/feedbackMS/feedback/getFeedbacksByUserId/{userId}
```

---

### 2. Formation Service

**Before:**
```typescript
private apiUrl = 'http://localhost:9094/formation';
```

**After:**
```typescript
import { environment } from '../environments/environment';

private apiUrl = `${environment.formationService}/formation`;
// Resolves to: http://localhost:9095/FormationMS/formation
```

**API Calls:**
```typescript
// Add formation
POST http://localhost:9095/FormationMS/formation/add/formateur/{keycloakFormateurId}

// Get all formations
GET http://localhost:9095/FormationMS/formation/all

// Update formation
PUT http://localhost:9095/FormationMS/formation/update/{id}/formateur/{keycloakFormateurId}
```

---

### 3. Recrutement Service

**Before:**
```typescript
private baseUrl = 'http://localhost:9095/candidatures';
```

**After:**
```typescript
import { environment } from '../../environments/environment';

private baseUrl = `${environment.recrutementService}/candidatures`;
// Resolves to: http://localhost:9095/recrutementMS/candidatures
```

**API Calls:**
```typescript
// Submit candidature with CV
POST http://localhost:9095/recrutementMS/candidatures (multipart/form-data)

// Get all candidatures
GET http://localhost:9095/recrutementMS/candidatures

// Approve candidature
POST http://localhost:9095/recrutementMS/candidatures/{id}/approve
```

---

### 4. User Management Service (Keycloak)

**Before:**
```typescript
private bases = [
  'http://localhost:8089/api/admin/keycloak',
  'http://localhost:9094/api/admin/keycloak'
];
```

**After:**
```typescript
import { environment } from '../../environments/environment';

private bases = [
  `${environment.userManagementService}/api/admin/keycloak`,  // Gateway
  'http://localhost:8089/api/admin/keycloak'  // Fallback
];
// Primary: http://localhost:9095/user-management/api/admin/keycloak
```

**API Calls:**
```typescript
// Get users by role
GET http://localhost:9095/user-management/api/admin/keycloak/users?role=user

// Create user
POST http://localhost:9095/user-management/api/admin/keycloak/users
```

---

## 🚀 How to Use

### Step 1: Start All Services

```bash
# 1. Start Eureka Server
cd c:\Users\m2l3k\Desktop\EurekaServer
mvn spring-boot:run

# 2. Start Python User Management (Docker)
cd c:\Users\m2l3k\Desktop\gestion-user
docker-compose up -d

# 3. Start Feedback Service
cd "c:\Users\m2l3k\Desktop\Final microservices\feedback-service"
mvn spring-boot:run

# 4. Start Formation Service
cd "c:\Users\m2l3k\Desktop\Final microservices\FormationMS"
mvn spring-boot:run

# 5. Start Recrutement Service
cd "c:\Users\m2l3k\Desktop\Final microservices\recrutement"
mvn spring-boot:run

# 6. Start Reclamation Service
cd "c:\Users\m2l3k\Desktop\Final microservices\reclamation\reclamation"
mvn spring-boot:run

# 7. Start API Gateway
cd "c:\Users\m2l3k\Desktop\Final microservices\Gateway"
mvn spring-boot:run
```

### Step 2: Start Frontend

```bash
cd c:\Users\m2l3k\Desktop\SkillUp-Front-main
npm install
npm start
```

Frontend will run on: `http://localhost:4200`

---

## 🧪 Testing Gateway Routes

### Test Feedback Service
```bash
# Through Gateway
curl http://localhost:9095/feedbackMS/feedback/getAllFeedbacks

# Direct (for comparison)
curl http://localhost:9094/feedback/getAllFeedbacks
```

### Test Formation Service
```bash
# Through Gateway
curl http://localhost:9095/FormationMS/formation/all

# Direct (for comparison)
curl http://localhost:9094/formation/all
```

### Test User Management
```bash
# Through Gateway
curl http://localhost:9095/user-management/api/admin/keycloak/users?role=user

# Direct (for comparison)
curl http://localhost:8089/api/admin/keycloak/users?role=user
```

---

## 📊 Request Flow Example

### Example: Add Feedback

**1. Frontend Call:**
```typescript
this.feedbackService.addFeedback(feedback);
```

**2. Service URL:**
```
http://localhost:9095/feedbackMS/feedback/addFeedback
```

**3. Gateway Processing:**
- Receives request at `/feedbackMS/feedback/addFeedback`
- Strips `/feedbackMS` prefix
- Forwards to `lb://feedbackMS/feedback/addFeedback`

**4. Eureka Resolution:**
- Gateway asks Eureka: "Where is feedbackMS?"
- Eureka responds: "localhost:9094"

**5. Final Request:**
```
http://localhost:9094/feedback/addFeedback
```

---

## 🔍 Troubleshooting

### Issue: 404 Not Found

**Cause:** Service not registered with Eureka or Gateway route misconfigured

**Solution:**
```bash
# Check Eureka Dashboard
http://localhost:8761

# Verify service is registered
# Check Gateway logs for routing errors
```

### Issue: Connection Refused

**Cause:** Gateway or service not running

**Solution:**
```bash
# Check Gateway status
curl http://localhost:9095/actuator/health

# Check service status
curl http://localhost:9094/actuator/health
```

### Issue: CORS Errors

**Cause:** Frontend making cross-origin requests

**Solution:** Gateway should handle CORS. Add CORS configuration to Gateway if needed:

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:4200");
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsWebFilter(source);
    }
}
```

---

## 📁 Files Modified

### Frontend Files
- ✅ `src/environments/environment.ts` - Development config
- ✅ `src/environments/environment.prod.ts` - Production config
- ✅ `src/app/feedback.service.ts` - Updated to use Gateway
- ✅ `src/app/formation.service.ts` - Updated to use Gateway
- ✅ `src/app/recrutement/recrutement.service.ts` - Updated to use Gateway
- ✅ `src/app/services/keycloak-admin.service.ts` - Updated to use Gateway

### Backend Files
- ✅ `Gateway/src/main/java/microservice/gateway/configuration/GatewayConfig.java`

---

## 🎯 Benefits of Using API Gateway

1. **Single Entry Point** - Frontend only needs to know one URL
2. **Load Balancing** - Gateway distributes requests across service instances
3. **Service Discovery** - Automatic routing via Eureka
4. **Security** - Centralized authentication/authorization
5. **Monitoring** - Single point for logging and metrics
6. **Resilience** - Circuit breakers and fallback mechanisms

---

## 📝 Next Steps

### For Other Services

If you have more services to integrate, follow this pattern:

1. **Add route to Gateway:**
```java
.route("myServiceMS", r -> r.path("/myServiceMS/**")
        .filters(f -> f.rewritePath("/myServiceMS/(?<segment>.*)", "/${segment}"))
        .uri("lb://myServiceMS"))
```

2. **Add to environment.ts:**
```typescript
myService: 'http://localhost:9095/myServiceMS'
```

3. **Update service file:**
```typescript
import { environment } from '../environments/environment';
private apiUrl = `${environment.myService}/endpoint`;
```

---

## ✨ Summary

| Component | URL | Status |
|-----------|-----|--------|
| Frontend | http://localhost:4200 | ✅ |
| API Gateway | http://localhost:9095 | ✅ |
| Eureka Server | http://localhost:8761 | ✅ |
| Feedback Service | http://localhost:9094 | ✅ |
| Formation Service | http://localhost:9094 | ✅ |
| Recrutement Service | http://localhost:9095 | ✅ |
| Reclamation Service | http://localhost:8080 | ✅ |
| User Management | http://localhost:8089 | ✅ |

**All services now communicate through the API Gateway!** 🎉

---

## 📞 Support

For issues or questions:
1. Check Eureka Dashboard: http://localhost:8761
2. Check Gateway logs for routing errors
3. Verify all services are running and registered
4. Test direct service URLs before testing through Gateway
