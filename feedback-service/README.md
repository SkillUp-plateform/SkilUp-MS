# Feedback Service - Keycloak Integration

## Overview

Feedback Service integrated with Keycloak for user management. Users with 'user' role can create and manage feedback.

---

## 🚀 Quick Start

### Prerequisites
- ✅ Python User Management Service running (port 8089)
- ✅ Keycloak running (port 8080)
- ✅ MySQL database configured
- ✅ At least one user with 'user' role in Keycloak

### Start the Service

```bash
cd "c:\Users\m2l3k\Desktop\Final microservices\feedback-service"
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
    "id": "abc123-def456-ghi789",
    "username": "john.user",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "User"
  }
]
```

**📝 Copy the `id` value to use in next requests**

---

### Step 2: Create Feedback

**POST** `http://localhost:8080/feedback/addFeedback/user/{keycloakUserId}`

**Example:** `http://localhost:8080/feedback/addFeedback/user/abc123-def456-ghi789`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "content": "Excellent service! Very satisfied with the quality."
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "keycloakUserId": "abc123-def456-ghi789",
  "content": "Excellent service! Very satisfied with the quality.",
  "date": "2025-11-11T18:05:00"
}
```

---

### Step 3: Get All Feedbacks

**GET** `http://localhost:8080/feedback/getAllFeedbacks`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "keycloakUserId": "abc123-def456-ghi789",
    "content": "Excellent service! Very satisfied with the quality.",
    "date": "2025-11-11T18:05:00"
  }
]
```

---

### Step 4: Get Feedback by ID

**GET** `http://localhost:8080/feedback/getFeedbackById/1`

**Response (200 OK):**
```json
{
  "id": 1,
  "keycloakUserId": "abc123-def456-ghi789",
  "content": "Excellent service! Very satisfied with the quality.",
  "date": "2025-11-11T18:05:00"
}
```

---

### Step 5: Get Feedbacks by User

**GET** `http://localhost:8080/feedback/getFeedbacksByUserId/{keycloakUserId}`

**Example:** `http://localhost:8080/feedback/getFeedbacksByUserId/abc123-def456-ghi789`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "keycloakUserId": "abc123-def456-ghi789",
    "content": "Excellent service! Very satisfied with the quality.",
    "date": "2025-11-11T18:05:00"
  },
  {
    "id": 3,
    "keycloakUserId": "abc123-def456-ghi789",
    "content": "Another feedback from the same user.",
    "date": "2025-11-11T19:00:00"
  }
]
```

---

### Step 6: Delete Feedback

**DELETE** `http://localhost:8080/feedback/deleteFeedback/1`

**Response (200 OK):** No content

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
  "username": "testuser1",
  "email": "testuser1@example.com",
  "firstName": "Test",
  "lastName": "User",
  "temporaryPassword": "password123",
  "role": "user"
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

### Test Invalid User (Should Fail)

**POST** `http://localhost:8080/feedback/addFeedback/user/invalid-id-123`

**Body:**
```json
{
  "content": "This should fail"
}
```

**Response (400 Bad Request):** `null`

---

### Health Check

**GET** `http://localhost:8089/health`

**Response (200 OK):**
```json
{
  "status": "healthy",
  "keycloak": "connected",
  "database": "connected",
  "realm": "my-app-realm"
}
```

---

## 📦 Postman Collection JSON

Copy and import this into Postman:

```json
{
  "info": {
    "name": "Feedback Service - Keycloak",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Get Users (role=user)",
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
      "name": "2. Create Feedback",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"content\": \"Excellent service!\"\n}"
        },
        "url": {
          "raw": "http://localhost:8080/feedback/addFeedback/user/{{keycloakUserId}}",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["feedback", "addFeedback", "user", "{{keycloakUserId}}"]
        }
      }
    },
    {
      "name": "3. Get All Feedbacks",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8080/feedback/getAllFeedbacks",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["feedback", "getAllFeedbacks"]
        }
      }
    },
    {
      "name": "4. Get Feedback by ID",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8080/feedback/getFeedbackById/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["feedback", "getFeedbackById", "1"]
        }
      }
    },
    {
      "name": "5. Get Feedbacks by User",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8080/feedback/getFeedbacksByUserId/{{keycloakUserId}}",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["feedback", "getFeedbacksByUserId", "{{keycloakUserId}}"]
        }
      }
    },
    {
      "name": "6. Delete Feedback",
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "http://localhost:8080/feedback/deleteFeedback/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["feedback", "deleteFeedback", "1"]
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

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/feedback_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

---

## 📊 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/feedback/addFeedback/user/{keycloakUserId}` | Create feedback |
| GET | `/feedback/getAllFeedbacks` | Get all feedbacks |
| GET | `/feedback/getFeedbackById/{id}` | Get feedback by ID |
| GET | `/feedback/getFeedbacksByUserId/{keycloakUserId}` | Get user's feedbacks |
| DELETE | `/feedback/deleteFeedback/{id}` | Delete feedback |

---

## 🧪 cURL Test Commands

```bash
# 1. Get users with 'user' role
curl http://localhost:8089/api/admin/keycloak/users?role=user

# 2. Create feedback (replace KEYCLOAK_ID)
curl -X POST http://localhost:8080/feedback/addFeedback/user/KEYCLOAK_ID \
  -H "Content-Type: application/json" \
  -d '{"content":"Great service!"}'

# 3. Get all feedbacks
curl http://localhost:8080/feedback/getAllFeedbacks

# 4. Get feedback by ID
curl http://localhost:8080/feedback/getFeedbackById/1

# 5. Get feedbacks by user (replace KEYCLOAK_ID)
curl http://localhost:8080/feedback/getFeedbacksByUserId/KEYCLOAK_ID

# 6. Delete feedback
curl -X DELETE http://localhost:8080/feedback/deleteFeedback/1
```

---

## 🔍 Troubleshooting

### Error: "User is not a valid user"

**Solution:** Verify user has 'user' role in Keycloak
```bash
curl http://localhost:8089/api/admin/keycloak/users?role=user
```

### Error: Connection refused (port 8089)

**Solution:** Start Python User Management Service
```bash
cd c:\Users\m2l3k\Desktop\gestion-user
docker-compose up -d python-app
```

### Error: Connection refused (port 8080)

**Solution:** Start Feedback Service
```bash
.\mvnw.cmd spring-boot:run
```

### Error: Database connection failed

**Solution:** Check MySQL is running and credentials in `application.properties`

---

## 📁 Project Structure

```
feedback-service/
├── src/main/java/tn/esprit/tic/feedbackservice/
│   ├── client/
│   │   └── UserServiceClient.java       # Calls Python service
│   ├── config/
│   │   └── WebClientConfig.java         # WebClient configuration
│   ├── controller/
│   │   └── FeedbackController.java      # REST endpoints
│   ├── dto/
│   │   └── UserDTO.java                 # User data transfer object
│   ├── entities/
│   │   └── Feedback.java                # Feedback entity
│   ├── repository/
│   │   └── FeedbackRepository.java      # Database operations
│   └── services/
│       ├── FeedbackService.java         # Service interface
│       └── FeedbackServiceImpl.java     # Service implementation
├── pom.xml                              # Maven dependencies
├── README.md                            # This file
├── KEYCLOAK_INTEGRATION.md              # Detailed integration docs
├── POSTMAN_REQUESTS.md                  # Complete Postman guide
└── compile.bat                          # Compilation script
```

---

## 🎯 Key Features

✅ **Keycloak Integration** - Uses Keycloak user IDs instead of simple Long IDs  
✅ **User Validation** - Only users with 'user' role can create feedback  
✅ **Python Service Integration** - Validates users via Python User Management Service  
✅ **RESTful API** - Clean REST endpoints with proper HTTP status codes  
✅ **Error Handling** - Returns 400 BAD REQUEST for invalid users  
✅ **Auto Timestamp** - Automatically sets creation date  

---

## 📝 Changes from Original

| Old | New |
|-----|-----|
| `Long userId` | `String keycloakUserId` |
| `POST /feedback/addFeedback` | `POST /feedback/addFeedback/user/{keycloakUserId}` |
| `GET /feedback/getFeedbacksByUserId/{userId}` | `GET /feedback/getFeedbacksByUserId/{keycloakUserId}` |
| No validation | Validates user has 'user' role |

---

## 🚀 Complete Test Workflow

1. **Start services:**
   ```bash
   # Python service
   cd c:\Users\m2l3k\Desktop\gestion-user
   docker-compose up -d
   
   # Feedback service
   cd "c:\Users\m2l3k\Desktop\Final microservices\feedback-service"
   .\mvnw.cmd spring-boot:run
   ```

2. **Get user ID:**
   ```bash
   curl http://localhost:8089/api/admin/keycloak/users?role=user
   ```

3. **Create feedback:**
   ```bash
   curl -X POST http://localhost:8080/feedback/addFeedback/user/YOUR_KEYCLOAK_ID \
     -H "Content-Type: application/json" \
     -d '{"content":"Test feedback"}'
   ```

4. **Verify:**
   ```bash
   curl http://localhost:8080/feedback/getAllFeedbacks
   ```

---

## 📚 Additional Documentation

- **KEYCLOAK_INTEGRATION.md** - Detailed integration guide
- **POSTMAN_REQUESTS.md** - Complete Postman collection with examples
- **compile.bat** - Quick compilation script

---

## 🤝 Support

For issues or questions, check:
1. Python service logs: `docker-compose logs python-app`
2. Feedback service logs in console
3. Keycloak admin console: `http://localhost:8080`

---

## ✨ Version

**Version:** 1.0.0  
**Last Updated:** November 11, 2025  
**Spring Boot:** 3.5.6  
**Java:** 17
