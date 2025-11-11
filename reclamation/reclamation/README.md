# Reclamation Service - Keycloak Integration

## Overview

Reclamation (Complaint) Management Service integrated with Keycloak for user management. Only users with 'user' role can create reclamations.

---

## 🚀 Quick Start

### Prerequisites
- ✅ Python User Management Service running (port 8089)
- ✅ Keycloak running (port 8080)
- ✅ Eureka Server running (port 8761)
- ✅ At least one user with 'user' role in Keycloak

### Start the Service

```bash
cd "c:\Users\m2l3k\Desktop\Final microservices\reclamation\reclamation"
.\mvnw.cmd spring-boot:run
```

Or compile first:
```bash
.\mvnw.cmd clean compile
.\mvnw.cmd spring-boot:run
```

---

## 📋 Postman Test Requests

### Step 1: Get User Keycloak ID

**GET** `http://localhost:8089/api/admin/keycloak/users?role=user`

**Response:**
```json
[
  {
    "id": "xyz789-abc123-def456",
    "username": "john.user",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "User"
  }
]
```

**📝 Copy the `id` value to use in next requests**

---

### Step 2: Create Reclamation

**POST** `http://localhost:8080/api/reclamations/user/{keycloakUserId}`

**Example:** `http://localhost:8080/api/reclamations/user/xyz789-abc123-def456`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Service Issue",
  "description": "I experienced a problem with the service today. The system was down for 2 hours.",
  "status": "OPEN"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "keycloakUserId": "xyz789-abc123-def456",
  "title": "Service Issue",
  "description": "I experienced a problem with the service today. The system was down for 2 hours.",
  "status": "OPEN"
}
```

---

### Step 3: Get All Reclamations

**GET** `http://localhost:8080/api/reclamations`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "keycloakUserId": "xyz789-abc123-def456",
    "title": "Service Issue",
    "description": "I experienced a problem with the service today.",
    "status": "OPEN"
  }
]
```

---

### Step 4: Get Reclamation by ID

**GET** `http://localhost:8080/api/reclamations/1`

**Response (200 OK):**
```json
{
  "id": 1,
  "keycloakUserId": "xyz789-abc123-def456",
  "title": "Service Issue",
  "description": "I experienced a problem with the service today.",
  "status": "OPEN"
}
```

---

### Step 5: Get Reclamations by User

**GET** `http://localhost:8080/api/reclamations/user/{keycloakUserId}`

**Example:** `http://localhost:8080/api/reclamations/user/xyz789-abc123-def456`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "keycloakUserId": "xyz789-abc123-def456",
    "title": "Service Issue",
    "description": "I experienced a problem with the service today.",
    "status": "OPEN"
  }
]
```

---

### Step 6: Update Reclamation

**PUT** `http://localhost:8080/api/reclamations/1`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Service Issue - Resolved",
  "description": "The issue has been resolved. Thank you for your quick response.",
  "status": "CLOSED"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "keycloakUserId": "xyz789-abc123-def456",
  "title": "Service Issue - Resolved",
  "description": "The issue has been resolved. Thank you for your quick response.",
  "status": "CLOSED"
}
```

---

### Step 7: Delete Reclamation

**DELETE** `http://localhost:8080/api/reclamations/1`

**Response (204 No Content)**

---

## 🧪 Additional Test Requests

### Create User (If None Exist)

**POST** `http://localhost:8089/api/admin/keycloak/users`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "username": "user1",
  "email": "user1@example.com",
  "firstName": "John",
  "lastName": "User",
  "temporaryPassword": "password123",
  "role": "user"
}
```

---

### Test Invalid User (Should Fail)

**POST** `http://localhost:8080/api/reclamations/user/invalid-id-123`

**Body:**
```json
{
  "title": "Test Reclamation",
  "description": "This should fail",
  "status": "OPEN"
}
```

**Response (400 Bad Request):** `null`

---

## 📦 Postman Collection JSON

Copy and import this into Postman:

```json
{
  "info": {
    "name": "Reclamation Service - Keycloak Integration",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Get All Users",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8089/api/admin/keycloak/users?role=user",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8089",
          "path": ["api", "admin", "keycloak", "users"],
          "query": [{"key": "role", "value": "user"}]
        }
      }
    },
    {
      "name": "2. Create Reclamation",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Service Issue\",\n  \"description\": \"Problem with the service\",\n  \"status\": \"OPEN\"\n}"
        },
        "url": {
          "raw": "http://localhost:8080/api/reclamations/user/{{keycloakUserId}}",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "reclamations", "user", "{{keycloakUserId}}"]
        }
      }
    },
    {
      "name": "3. Get All Reclamations",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8080/api/reclamations",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "reclamations"]
        }
      }
    },
    {
      "name": "4. Get Reclamation by ID",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8080/api/reclamations/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "reclamations", "1"]
        }
      }
    },
    {
      "name": "5. Get Reclamations by User",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8080/api/reclamations/user/{{keycloakUserId}}",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "reclamations", "user", "{{keycloakUserId}}"]
        }
      }
    },
    {
      "name": "6. Update Reclamation",
      "request": {
        "method": "PUT",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Updated Title\",\n  \"description\": \"Updated description\",\n  \"status\": \"CLOSED\"\n}"
        },
        "url": {
          "raw": "http://localhost:8080/api/reclamations/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "reclamations", "1"]
        }
      }
    },
    {
      "name": "7. Delete Reclamation",
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "http://localhost:8080/api/reclamations/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "reclamations", "1"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "keycloakUserId",
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
spring.application.name=reclamation-service

# Database Configuration (H2)
spring.datasource.url=jdbc:h2:mem:reclamationdb
spring.jpa.hibernate.ddl-auto=update
```

---

## 📊 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reclamations/user/{keycloakUserId}` | Create reclamation |
| GET | `/api/reclamations` | Get all reclamations |
| GET | `/api/reclamations/{id}` | Get reclamation by ID |
| GET | `/api/reclamations/user/{keycloakUserId}` | Get user's reclamations |
| PUT | `/api/reclamations/{id}` | Update reclamation |
| DELETE | `/api/reclamations/{id}` | Delete reclamation |

---

## 🧪 cURL Test Commands

```bash
# 1. Get users
curl http://localhost:8089/api/admin/keycloak/users?role=user

# 2. Create reclamation (replace KEYCLOAK_ID)
curl -X POST http://localhost:8080/api/reclamations/user/KEYCLOAK_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Service Issue",
    "description":"Problem with the service",
    "status":"OPEN"
  }'

# 3. Get all reclamations
curl http://localhost:8080/api/reclamations

# 4. Get reclamations by user
curl http://localhost:8080/api/reclamations/user/KEYCLOAK_ID

# 5. Update reclamation
curl -X PUT http://localhost:8080/api/reclamations/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","description":"Updated desc","status":"CLOSED"}'

# 6. Delete reclamation
curl -X DELETE http://localhost:8080/api/reclamations/1
```

---

## 🔍 Troubleshooting

### Error: "User is not a valid user"

**Solution:** Verify user has 'user' role
```bash
curl http://localhost:8089/api/admin/keycloak/users?role=user
```

### Error: Connection refused (port 8089)

**Solution:** Start Python User Management Service
```bash
cd c:\Users\m2l3k\Desktop\gestion-user
docker-compose up -d python-app
```

### Error: Compilation errors

**Solution:** Run Maven with proper configuration
```bash
.\mvnw.cmd clean compile
```

---

## 📁 Project Structure

```
reclamation/
├── src/main/java/tn/esprit/examen/nomPrenomClasseExamen/
│   ├── client/
│   │   └── UserServiceClient.java       # Calls Python service
│   ├── config/
│   │   └── WebClientConfig.java         # WebClient configuration
│   ├── controllers/
│   │   └── ReclamationController.java   # REST endpoints
│   ├── dto/
│   │   └── UserDTO.java                 # User data transfer object
│   ├── entities/
│   │   └── reclamation.java             # Reclamation entity
│   ├── repositories/
│   │   └── IReclamationRepository.java  # Database operations
│   └── services/
│       ├── IReclamationService.java     # Service interface
│       └── IReclamationServiceImpl.java # Service implementation
├── pom.xml                              # Maven dependencies
└── README.md                            # This file
```

---

## 🎯 Key Features

✅ **Keycloak Integration** - Uses Keycloak user IDs  
✅ **User Validation** - Only users with 'user' role can create reclamations  
✅ **Python Service Integration** - Validates users via Python service  
✅ **RESTful API** - Clean REST endpoints with proper HTTP status codes  
✅ **Error Handling** - Returns 400 BAD REQUEST for invalid users  
✅ **Eureka Integration** - Registers with Eureka service discovery  
✅ **H2 Database** - In-memory database for development  

---

## 📝 Changes from Original

| Old | New |
|-----|-----|
| No user tracking | `String keycloakUserId` field added |
| `POST /api/reclamations` | `POST /api/reclamations/user/{keycloakUserId}` |
| No validation | Validates user has 'user' role |
| No user-specific endpoint | `GET /api/reclamations/user/{keycloakUserId}` |

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
   
   # Reclamation service
   cd "c:\Users\m2l3k\Desktop\Final microservices\reclamation\reclamation"
   .\mvnw.cmd spring-boot:run
   ```

2. **Get user ID:**
   ```bash
   curl http://localhost:8089/api/admin/keycloak/users?role=user
   ```

3. **Create reclamation:**
   ```bash
   curl -X POST http://localhost:8080/api/reclamations/user/YOUR_KEYCLOAK_ID \
     -H "Content-Type: application/json" \
     -d '{"title":"Service Issue","description":"Problem","status":"OPEN"}'
   ```

4. **Verify:**
   ```bash
   curl http://localhost:8080/api/reclamations
   ```

---

## ✨ Version

**Version:** 1.0.0  
**Last Updated:** November 11, 2025  
**Spring Boot:** 3.3.4  
**Java:** 17
