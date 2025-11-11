# FormationMS - Keycloak Integration

## Overview

Formation Management Service integrated with Keycloak for formateur (trainer) management. Only users with 'formateur' role can create and manage formations.

---

## 🚀 Quick Start

### Prerequisites
- ✅ Python User Management Service running (port 8089)
- ✅ Keycloak running (port 8080)
- ✅ Eureka Server running (port 8761)
- ✅ At least one user with 'formateur' role in Keycloak

### Start the Service

```bash
cd "c:\Users\m2l3k\Desktop\Final microservices\FormationMS"
.\mvnw.cmd spring-boot:run
```

Or compile first:
```bash
.\mvnw.cmd clean compile
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

### Step 2: Create Formation

**POST** `http://localhost:8080/formation/add/formateur/{keycloakFormateurId}`

**Example:** `http://localhost:8080/formation/add/formateur/abc123-def456-ghi789`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Spring Boot Advanced Course",
  "content": "Deep dive into Spring Boot framework with microservices",
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "videoLink": "https://youtube.com/watch?v=example123",
  "duration": "40 hours",
  "date": "2025-12-15",
  "prix": 499.99
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "title": "Spring Boot Advanced Course",
  "content": "Deep dive into Spring Boot framework with microservices",
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "videoLink": "https://youtube.com/watch?v=example123",
  "duration": "40 hours",
  "date": "2025-12-15",
  "prix": 499.99,
  "keycloakFormateurId": "abc123-def456-ghi789",
  "resources": null,
  "formationImage": null
}
```

---

### Step 3: Get All Formations

**GET** `http://localhost:8080/formation/all`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Spring Boot Advanced Course",
    "content": "Deep dive into Spring Boot framework with microservices",
    "keycloakFormateurId": "abc123-def456-ghi789",
    "date": "2025-12-15",
    "prix": 499.99
  }
]
```

---

### Step 4: Get Formation by ID

**GET** `http://localhost:8080/formation/get/1`

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Spring Boot Advanced Course",
  "content": "Deep dive into Spring Boot framework with microservices",
  "keycloakFormateurId": "abc123-def456-ghi789",
  "date": "2025-12-15",
  "prix": 499.99
}
```

---

### Step 5: Get Formations by Formateur

**GET** `http://localhost:8080/formation/formateur/{keycloakFormateurId}`

**Example:** `http://localhost:8080/formation/formateur/abc123-def456-ghi789`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Spring Boot Advanced Course",
    "keycloakFormateurId": "abc123-def456-ghi789",
    "date": "2025-12-15",
    "prix": 499.99
  }
]
```

---

### Step 6: Update Formation

**PUT** `http://localhost:8080/formation/update/{id}/formateur/{keycloakFormateurId}`

**Example:** `http://localhost:8080/formation/update/1/formateur/abc123-def456-ghi789`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Spring Boot Advanced Course - Updated",
  "content": "Updated content with new modules",
  "meetingLink": "https://meet.google.com/new-link",
  "videoLink": "https://youtube.com/watch?v=updated123",
  "duration": "50 hours",
  "date": "2025-12-20",
  "prix": 599.99
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Spring Boot Advanced Course - Updated",
  "content": "Updated content with new modules",
  "keycloakFormateurId": "abc123-def456-ghi789",
  "date": "2025-12-20",
  "prix": 599.99
}
```

---

### Step 7: Delete Formation

**DELETE** `http://localhost:8080/formation/delete/1`

**Response (200 OK):** No content

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

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "id": "new-keycloak-id-here"
}
```

---

### Test Invalid Formateur (Should Fail)

**POST** `http://localhost:8080/formation/add/formateur/invalid-id-123`

**Body:**
```json
{
  "title": "Test Formation",
  "content": "This should fail",
  "duration": "2 hours",
  "date": "2025-12-01",
  "prix": 100.00
}
```

**Response (400 Bad Request):** `null`

---

## 📦 Postman Collection JSON

Copy and import this into Postman:

```json
{
  "info": {
    "name": "FormationMS - Keycloak Integration",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Get All Formateurs",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8089/api/admin/keycloak/users?role=formateur",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8089",
          "path": ["api", "admin", "keycloak", "users"],
          "query": [{"key": "role", "value": "formateur"}]
        }
      }
    },
    {
      "name": "2. Create Formation",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Spring Boot Advanced Course\",\n  \"content\": \"Deep dive into Spring Boot\",\n  \"meetingLink\": \"https://meet.google.com/abc\",\n  \"videoLink\": \"https://youtube.com/watch?v=example\",\n  \"duration\": \"40 hours\",\n  \"date\": \"2025-12-15\",\n  \"prix\": 499.99\n}"
        },
        "url": {
          "raw": "http://localhost:8080/formation/add/formateur/{{keycloakFormateurId}}",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["formation", "add", "formateur", "{{keycloakFormateurId}}"]
        }
      }
    },
    {
      "name": "3. Get All Formations",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8080/formation/all",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["formation", "all"]
        }
      }
    },
    {
      "name": "4. Get Formation by ID",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8080/formation/get/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["formation", "get", "1"]
        }
      }
    },
    {
      "name": "5. Get Formations by Formateur",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8080/formation/formateur/{{keycloakFormateurId}}",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["formation", "formateur", "{{keycloakFormateurId}}"]
        }
      }
    },
    {
      "name": "6. Update Formation",
      "request": {
        "method": "PUT",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Updated Title\",\n  \"content\": \"Updated content\",\n  \"duration\": \"50 hours\",\n  \"date\": \"2025-12-20\",\n  \"prix\": 599.99\n}"
        },
        "url": {
          "raw": "http://localhost:8080/formation/update/1/formateur/{{keycloakFormateurId}}",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["formation", "update", "1", "formateur", "{{keycloakFormateurId}}"]
        }
      }
    },
    {
      "name": "7. Delete Formation",
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "http://localhost:8080/formation/delete/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["formation", "delete", "1"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "keycloakFormateurId",
      "value": "REPLACE_WITH_ACTUAL_KEYCLOAK_ID",
      "type": "string"
    }
  ]
}
```

---

## 🔧 Configuration

### application.properties

```properties
# User Service URL
user.service.url=http://localhost:8089

# Eureka Configuration
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
spring.application.name=formation-service

# Database Configuration (H2)
spring.datasource.url=jdbc:h2:mem:formationdb
spring.jpa.hibernate.ddl-auto=update
```

---

## 📊 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/formation/add/formateur/{keycloakFormateurId}` | Create formation |
| PUT | `/formation/update/{id}/formateur/{keycloakFormateurId}` | Update formation |
| GET | `/formation/all` | Get all formations |
| GET | `/formation/get/{id}` | Get formation by ID |
| GET | `/formation/formateur/{keycloakFormateurId}` | Get formateur's formations |
| DELETE | `/formation/delete/{id}` | Delete formation |

---

## 🧪 cURL Test Commands

```bash
# 1. Get formateurs
curl http://localhost:8089/api/admin/keycloak/users?role=formateur

# 2. Create formation (replace KEYCLOAK_ID)
curl -X POST http://localhost:8080/formation/add/formateur/KEYCLOAK_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Spring Boot Course",
    "content":"Advanced Spring Boot",
    "duration":"40 hours",
    "date":"2025-12-15",
    "prix":499.99
  }'

# 3. Get all formations
curl http://localhost:8080/formation/all

# 4. Get formations by formateur
curl http://localhost:8080/formation/formateur/KEYCLOAK_ID

# 5. Update formation
curl -X PUT http://localhost:8080/formation/update/1/formateur/KEYCLOAK_ID \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","prix":599.99}'

# 6. Delete formation
curl -X DELETE http://localhost:8080/formation/delete/1
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

### Error: Compilation errors with Lombok

**Solution:** Run Maven with proper Lombok configuration
```bash
.\mvnw.cmd clean compile
```

---

## 📁 Project Structure

```
FormationMS/
├── src/main/java/tic/alma/formationms/
│   ├── client/
│   │   └── UserServiceClient.java       # Calls Python service
│   ├── config/
│   │   └── WebClientConfig.java         # WebClient configuration
│   ├── controllers/
│   │   └── FormationController.java     # REST endpoints
│   ├── dto/
│   │   └── FormateurDTO.java            # Formateur data transfer object
│   ├── entities/
│   │   └── Formation.java               # Formation entity
│   ├── repositories/
│   │   └── FormationRepository.java     # Database operations
│   └── services/
│       ├── FormationService.java        # Service interface
│       └── FormationServiceImpl.java    # Service implementation
├── pom.xml                              # Maven dependencies
├── README.md                            # This file
├── KEYCLOAK_INTEGRATION.md              # Detailed integration docs
├── POSTMAN_REQUESTS.md                  # Complete Postman guide
├── QUICK_SETUP.md                       # Quick setup guide
└── compile.bat                          # Compilation script
```

---

## 🎯 Key Features

✅ **Keycloak Integration** - Uses Keycloak formateur IDs  
✅ **Formateur Validation** - Only users with 'formateur' role can create formations  
✅ **Python Service Integration** - Validates formateurs via Python service  
✅ **RESTful API** - Clean REST endpoints with proper HTTP status codes  
✅ **Error Handling** - Returns 400 BAD REQUEST for invalid formateurs  
✅ **Eureka Integration** - Registers with Eureka service discovery  

---

## 📝 Changes from Original

| Old | New |
|-----|-----|
| `Long idFormateur` | `String keycloakFormateurId` |
| `POST /formation/add/formateur/{idFormateur}` | `POST /formation/add/formateur/{keycloakFormateurId}` |
| No validation | Validates user has 'formateur' role |
| No formateur-specific endpoint | `GET /formation/formateur/{keycloakFormateurId}` |

---

## 🚀 Complete Test Workflow

1. **Start services:**
   ```bash
   # Eureka Server
   cd c:\Users\m2l3k\Desktop\EurekaServer
   mvn spring-boot:run
   
   # Python service
   cd c:\Users\m2l3k\Desktop\gestion-user
   docker-compose up -d
   
   # FormationMS
   cd "c:\Users\m2l3k\Desktop\Final microservices\FormationMS"
   .\mvnw.cmd spring-boot:run
   ```

2. **Get formateur ID:**
   ```bash
   curl http://localhost:8089/api/admin/keycloak/users?role=formateur
   ```

3. **Create formation:**
   ```bash
   curl -X POST http://localhost:8080/formation/add/formateur/YOUR_KEYCLOAK_ID \
     -H "Content-Type: application/json" \
     -d '{"title":"Test Formation","content":"Test","duration":"2h","date":"2025-12-01","prix":100}'
   ```

4. **Verify:**
   ```bash
   curl http://localhost:8080/formation/all
   ```

---

## 📚 Additional Documentation

- **KEYCLOAK_INTEGRATION.md** - Detailed integration guide
- **POSTMAN_REQUESTS.md** - Complete Postman collection
- **QUICK_SETUP.md** - Quick start guide
- **COMPILATION_FIX.md** - Lombok compilation troubleshooting

---

## ✨ Version

**Version:** 1.0.0  
**Last Updated:** November 11, 2025  
**Spring Boot:** 3.5.6  
**Java:** 17
