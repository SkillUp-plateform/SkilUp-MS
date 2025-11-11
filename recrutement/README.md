# Recrutement Service - Keycloak Integration

## Overview

Recruitment Service integrated with Keycloak for formateur (trainer) candidature management. Only users with 'formateur' role can submit candidatures (job applications).

---

## 🚀 Quick Start

### Prerequisites
- ✅ Python User Management Service running (port 8089)
- ✅ Keycloak running (port 8080)
- ✅ MySQL database configured
- ✅ At least one user with 'formateur' role in Keycloak

### Start the Service

```bash
cd "c:\Users\m2l3k\Desktop\Final microservices\recrutement"
.\mvnw.cmd spring-boot:run
```

---

## 📋 Postman Test Requests

### Step 1: Get Formateur Keycloak ID

**GET** `http://localhost:8089/api/admin/keycloak/users?role=formateur`

**Response:**
```json
[
  {
    "id": "abc123-def456-ghi789",
    "username": "john.trainer",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Trainer"
  }
]
```

**📝 Copy the `id` value to use in next requests**

---

### Step 2: Submit Candidature (JSON)

**POST** `http://localhost:8080/candidatures`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "keycloakFormateurId": "abc123-def456-ghi789",
  "motivation": "I have 5 years of experience in teaching Spring Boot and microservices architecture."
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "keycloakFormateurId": "abc123-def456-ghi789",
  "status": "PENDING",
  "motivation": "I have 5 years of experience in teaching Spring Boot and microservices architecture.",
  "createdAt": "2025-11-11T18:15:00",
  "updatedAt": "2025-11-11T18:15:00",
  "cvPath": null
}
```

---

### Step 3: Submit Candidature with CV (Multipart)

**POST** `http://localhost:8080/candidatures`

**Headers:**
```
Content-Type: multipart/form-data
```

**Form Data:**
- `keycloakFormateurId`: `abc123-def456-ghi789` (text)
- `motivation`: `Experienced trainer with 5 years in the field` (text)
- `cv`: (file) Select your PDF file

**Response (200 OK):**
```json
{
  "id": 2,
  "keycloakFormateurId": "abc123-def456-ghi789",
  "status": "PENDING",
  "motivation": "Experienced trainer with 5 years in the field",
  "createdAt": "2025-11-11T18:20:00",
  "updatedAt": "2025-11-11T18:20:00",
  "cvPath": "/uploads/cv/cv-abc123-def-1699720800000-resume.pdf"
}
```

---

### Step 4: Get All Candidatures

**GET** `http://localhost:8080/candidatures`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "keycloakFormateurId": "abc123-def456-ghi789",
    "status": "PENDING",
    "motivation": "I have 5 years of experience...",
    "createdAt": "2025-11-11T18:15:00",
    "updatedAt": "2025-11-11T18:15:00",
    "cvPath": null
  }
]
```

---

### Step 5: Get Candidature by ID

**GET** `http://localhost:8080/candidatures/1`

**Response (200 OK):**
```json
{
  "id": 1,
  "keycloakFormateurId": "abc123-def456-ghi789",
  "status": "PENDING",
  "motivation": "I have 5 years of experience...",
  "createdAt": "2025-11-11T18:15:00",
  "updatedAt": "2025-11-11T18:15:00",
  "cvPath": null
}
```

---

### Step 6: Get Candidatures by Status

**GET** `http://localhost:8080/candidatures?status=PENDING`

**Available statuses:** `PENDING`, `APPROVED`, `REJECTED`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "keycloakFormateurId": "abc123-def456-ghi789",
    "status": "PENDING",
    "motivation": "I have 5 years of experience...",
    "createdAt": "2025-11-11T18:15:00",
    "updatedAt": "2025-11-11T18:15:00",
    "cvPath": null
  }
]
```

---

### Step 7: Approve Candidature

**POST** `http://localhost:8080/candidatures/1/approve`

**Response (200 OK):**
```json
{
  "id": 1,
  "keycloakFormateurId": "abc123-def456-ghi789",
  "status": "APPROVED",
  "motivation": "I have 5 years of experience...",
  "createdAt": "2025-11-11T18:15:00",
  "updatedAt": "2025-11-11T18:25:00",
  "cvPath": null
}
```

---

### Step 8: Reject Candidature

**POST** `http://localhost:8080/candidatures/1/reject`

**Response (200 OK):**
```json
{
  "id": 1,
  "keycloakFormateurId": "abc123-def456-ghi789",
  "status": "REJECTED",
  "motivation": "I have 5 years of experience...",
  "createdAt": "2025-11-11T18:15:00",
  "updatedAt": "2025-11-11T18:30:00",
  "cvPath": null
}
```

---

### Step 9: Download CV

**GET** `http://localhost:8080/candidatures/2/cv`

**Response:** PDF file download

---

## 🧪 Additional Test Requests

### Create Formateur (If None Exist)

**POST** `http://localhost:8089/api/admin/keycloak/users`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "username": "trainer1",
  "email": "trainer1@example.com",
  "firstName": "John",
  "lastName": "Trainer",
  "temporaryPassword": "password123",
  "role": "formateur"
}
```

---

### Test Invalid Formateur (Should Fail)

**POST** `http://localhost:8080/candidatures`

**Body:**
```json
{
  "keycloakFormateurId": "invalid-id-123",
  "motivation": "This should fail"
}
```

**Response (400 Bad Request)**

---

## 🔧 Configuration

### application.properties

```properties
# User Service URL
user.service.url=http://localhost:8089

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/recrutement_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

# CV Upload Directory
app.upload.cv-dir=uploads/cv

# Eureka Configuration
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
spring.application.name=recrutement-service
```

---

## 📊 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/candidatures` | Submit candidature (JSON) |
| POST | `/candidatures` (multipart) | Submit candidature with CV |
| GET | `/candidatures` | Get all candidatures |
| GET | `/candidatures?status={status}` | Get candidatures by status |
| GET | `/candidatures/{id}` | Get candidature by ID |
| GET | `/candidatures/{id}/cv` | Download CV |
| POST | `/candidatures/{id}/approve` | Approve candidature |
| POST | `/candidatures/{id}/reject` | Reject candidature |

---

## 🧪 cURL Test Commands

```bash
# 1. Get formateurs
curl http://localhost:8089/api/admin/keycloak/users?role=formateur

# 2. Submit candidature (JSON)
curl -X POST http://localhost:8080/candidatures \
  -H "Content-Type: application/json" \
  -d '{
    "keycloakFormateurId":"abc123-def456-ghi789",
    "motivation":"Experienced trainer"
  }'

# 3. Submit candidature with CV
curl -X POST http://localhost:8080/candidatures \
  -F "keycloakFormateurId=abc123-def456-ghi789" \
  -F "motivation=Experienced trainer" \
  -F "cv=@/path/to/your/cv.pdf"

# 4. Get all candidatures
curl http://localhost:8080/candidatures

# 5. Get candidatures by status
curl http://localhost:8080/candidatures?status=PENDING

# 6. Approve candidature
curl -X POST http://localhost:8080/candidatures/1/approve

# 7. Reject candidature
curl -X POST http://localhost:8080/candidatures/1/reject

# 8. Download CV
curl http://localhost:8080/candidatures/2/cv --output cv.pdf
```

---

## 🔍 Troubleshooting

### Error: "User is not a formateur"

**Solution:** Verify user has 'formateur' role
```bash
curl http://localhost:8089/api/admin/keycloak/users?role=formateur
```

### Error: Connection refused (port 8089)

**Solution:** Start Python User Management Service
```bash
cd c:\Users\m2l3k\Desktop\gestion-user
docker-compose up -d python-app
```

### Error: CV upload failed

**Solution:** Check upload directory exists and has write permissions
```bash
mkdir -p uploads/cv
```

---

## 📁 Project Structure

```
recrutement/
├── src/main/java/com/recrutement/recrutement/
│   ├── client/
│   │   ├── UserServiceClient.java       # Calls Python service
│   │   └── BackendUserClient.java       # Feign client
│   ├── config/
│   │   └── WebClientConfig.java         # WebClient configuration
│   ├── controllers/
│   │   └── CandidatureController.java   # REST endpoints
│   ├── domain/
│   │   ├── Candidature.java             # Candidature entity
│   │   └── CandidatureStatus.java       # Status enum
│   ├── dto/
│   │   ├── FormateurDTO.java            # Formateur data transfer object
│   │   ├── CandidatureCreateRequest.java
│   │   └── CandidatureResponse.java
│   ├── repository/
│   │   └── CandidatureRepository.java   # Database operations
│   └── service/
│       └── CandidatureService.java      # Business logic
├── uploads/cv/                          # CV storage directory
├── pom.xml                              # Maven dependencies
└── README.md                            # This file
```

---

## 🎯 Key Features

✅ **Keycloak Integration** - Uses Keycloak formateur IDs  
✅ **Formateur Validation** - Only users with 'formateur' role can submit candidatures  
✅ **Python Service Integration** - Validates formateurs via Python service  
✅ **CV Upload** - Supports PDF CV upload with candidatures  
✅ **Status Management** - PENDING, APPROVED, REJECTED statuses  
✅ **RESTful API** - Clean REST endpoints with proper HTTP status codes  

---

## 📝 Changes from Original

| Old | New |
|-----|-----|
| `Long userId` | `String keycloakFormateurId` |
| No validation | Validates user has 'formateur' role |
| `POST /candidatures` with userId | `POST /candidatures` with keycloakFormateurId |

---

## 🚀 Complete Test Workflow

1. **Start services:**
   ```bash
   # Python service
   cd c:\Users\m2l3k\Desktop\gestion-user
   docker-compose up -d
   
   # Recrutement service
   cd "c:\Users\m2l3k\Desktop\Final microservices\recrutement"
   .\mvnw.cmd spring-boot:run
   ```

2. **Get formateur ID:**
   ```bash
   curl http://localhost:8089/api/admin/keycloak/users?role=formateur
   ```

3. **Submit candidature:**
   ```bash
   curl -X POST http://localhost:8080/candidatures \
     -H "Content-Type: application/json" \
     -d '{"keycloakFormateurId":"YOUR_KEYCLOAK_ID","motivation":"Experienced trainer"}'
   ```

4. **Verify:**
   ```bash
   curl http://localhost:8080/candidatures
   ```

---

## ✨ Version

**Version:** 1.0.0  
**Last Updated:** November 11, 2025  
**Spring Boot:** 3.4.11  
**Java:** 17
