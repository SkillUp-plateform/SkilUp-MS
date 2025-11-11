# Postman Test Requests for Feedback Service

## Prerequisites

Before testing, ensure:
1. ✅ Python User Management Service is running (port 8089)
2. ✅ Keycloak is running (port 8080)
3. ✅ Feedback Service is running (default port 8080 or your configured port)
4. ✅ At least one user with 'user' role exists in Keycloak

---

## Step 1: Get User Keycloak ID

### Request 1: Get All Users with 'user' Role

**Method:** `GET`  
**URL:** `http://localhost:8089/api/admin/keycloak/users?role=user`  
**Headers:**
```
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
[
  {
    "id": "abc123-def456-ghi789",
    "username": "john.user",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "User"
  },
  {
    "id": "xyz789-uvw456-rst123",
    "username": "jane.user",
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "User"
  }
]
```

**Note:** Copy one of the `id` values (e.g., `abc123-def456-ghi789`) to use in the following requests.

---

## Step 2: Create a User (If None Exist)

### Request 2: Create User with 'user' Role

**Method:** `POST`  
**URL:** `http://localhost:8089/api/admin/keycloak/users`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
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

**Expected Response (201 Created):**
```json
{
  "message": "User created successfully",
  "id": "new-keycloak-id-here"
}
```

---

## Step 3: Test Feedback Service Endpoints

### Request 3: Create Feedback with Valid User

**Method:** `POST`  
**URL:** `http://localhost:8080/feedback/addFeedback/user/{keycloakUserId}`  
**Example:** `http://localhost:8080/feedback/addFeedback/user/abc123-def456-ghi789`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "content": "Excellent service! Very satisfied with the quality and support."
}
```

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "keycloakUserId": "abc123-def456-ghi789",
  "content": "Excellent service! Very satisfied with the quality and support.",
  "date": "2025-11-11T17:30:00"
}
```

---

### Request 4: Create Feedback with Invalid User (Should Fail)

**Method:** `POST`  
**URL:** `http://localhost:8080/feedback/addFeedback/user/invalid-keycloak-id`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "content": "This should fail"
}
```

**Expected Response (400 Bad Request):**
```json
null
```

---

### Request 5: Get All Feedbacks

**Method:** `GET`  
**URL:** `http://localhost:8080/feedback/getAllFeedbacks`

**Headers:**
```
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "keycloakUserId": "abc123-def456-ghi789",
    "content": "Excellent service! Very satisfied with the quality and support.",
    "date": "2025-11-11T17:30:00"
  },
  {
    "id": 2,
    "keycloakUserId": "xyz789-uvw456-rst123",
    "content": "Good experience overall.",
    "date": "2025-11-11T18:00:00"
  }
]
```

---

### Request 6: Get Feedback by ID

**Method:** `GET`  
**URL:** `http://localhost:8080/feedback/getFeedbackById/{id}`  
**Example:** `http://localhost:8080/feedback/getFeedbackById/1`

**Headers:**
```
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "keycloakUserId": "abc123-def456-ghi789",
  "content": "Excellent service! Very satisfied with the quality and support.",
  "date": "2025-11-11T17:30:00"
}
```

---

### Request 7: Get Feedbacks by User

**Method:** `GET`  
**URL:** `http://localhost:8080/feedback/getFeedbacksByUserId/{keycloakUserId}`  
**Example:** `http://localhost:8080/feedback/getFeedbacksByUserId/abc123-def456-ghi789`

**Headers:**
```
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "keycloakUserId": "abc123-def456-ghi789",
    "content": "Excellent service! Very satisfied with the quality and support.",
    "date": "2025-11-11T17:30:00"
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

### Request 8: Delete Feedback

**Method:** `DELETE`  
**URL:** `http://localhost:8080/feedback/deleteFeedback/{id}`  
**Example:** `http://localhost:8080/feedback/deleteFeedback/1`

**Headers:**
```
Content-Type: application/json
```

**Expected Response (200 OK):**
No content or success message

---

### Request 9: Health Check (Python Service)

**Method:** `GET`  
**URL:** `http://localhost:8089/health`

**Expected Response (200 OK):**
```json
{
  "status": "healthy",
  "keycloak": "connected",
  "database": "connected",
  "realm": "my-app-realm"
}
```

---

## Complete Test Workflow

### Scenario 1: Happy Path - Create and Manage Feedback

1. **Get users** → Request 1
2. **Copy a Keycloak ID** from the response
3. **Create feedback** → Request 3 (use the Keycloak ID)
4. **Get all feedbacks** → Request 5 (verify creation)
5. **Get feedback by ID** → Request 6
6. **Get feedbacks by user** → Request 7
7. **Delete feedback** → Request 8

### Scenario 2: Error Handling - Invalid User

1. **Create feedback with invalid ID** → Request 4
2. **Verify 400 Bad Request** response

### Scenario 3: Create New User and Feedback

1. **Create new user** → Request 2
2. **Copy the new Keycloak ID** from response
3. **Create feedback** → Request 3 (use new ID)
4. **Verify creation** → Request 5

---

## Postman Collection JSON

You can import this JSON into Postman:

```json
{
  "info": {
    "name": "Feedback Service - Keycloak Integration",
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
      "name": "2. Create User",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"testuser1\",\n  \"email\": \"testuser1@example.com\",\n  \"firstName\": \"Test\",\n  \"lastName\": \"User\",\n  \"temporaryPassword\": \"password123\",\n  \"role\": \"user\"\n}"
        },
        "url": {
          "raw": "http://localhost:8089/api/admin/keycloak/users",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8089",
          "path": ["api", "admin", "keycloak", "users"]
        }
      }
    },
    {
      "name": "3. Create Feedback",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"content\": \"Excellent service! Very satisfied.\"\n}"
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
      "name": "4. Get All Feedbacks",
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
      "name": "5. Get Feedback by ID",
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
      "name": "6. Get Feedbacks by User",
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
      "name": "7. Delete Feedback",
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
    },
    {
      "name": "8. Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8089/health",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8089",
          "path": ["health"]
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

## Quick Test Commands (cURL)

```bash
# 1. Get users with 'user' role
curl http://localhost:8089/api/admin/keycloak/users?role=user

# 2. Create feedback (replace KEYCLOAK_ID)
curl -X POST http://localhost:8080/feedback/addFeedback/user/KEYCLOAK_ID \
  -H "Content-Type: application/json" \
  -d '{"content":"Great service!"}'

# 3. Get all feedbacks
curl http://localhost:8080/feedback/getAllFeedbacks

# 4. Get feedbacks by user (replace KEYCLOAK_ID)
curl http://localhost:8080/feedback/getFeedbacksByUserId/KEYCLOAK_ID

# 5. Delete feedback
curl -X DELETE http://localhost:8080/feedback/deleteFeedback/1
```

---

## API Changes Summary

| Old Endpoint | New Endpoint |
|-------------|--------------|
| `POST /feedback/addFeedback` | `POST /feedback/addFeedback/user/{keycloakUserId}` |
| `GET /feedback/getFeedbacksByUserId/{userId}` (Long) | `GET /feedback/getFeedbacksByUserId/{keycloakUserId}` (String) |

---

## Troubleshooting

### Error: "User is not a valid user"

**Check 1:** Verify user has 'user' role
```bash
curl http://localhost:8089/api/admin/keycloak/users?role=user
```

**Check 2:** Create a user if none exist
```bash
curl -X POST http://localhost:8089/api/admin/keycloak/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser1",
    "email": "testuser1@example.com",
    "firstName": "Test",
    "lastName": "User",
    "temporaryPassword": "password123",
    "role": "user"
  }'
```

### Error: Connection refused to localhost:8089

**Solution:** Start the Python User Management Service
```bash
cd c:\Users\m2l3k\Desktop\gestion-user
docker-compose up -d python-app
```

Verify it's running:
```bash
curl http://localhost:8089/health
```

### Error: Connection refused to localhost:8080

**Solution:** Start the Feedback Service
```bash
cd "c:\Users\m2l3k\Desktop\Final microservices\feedback-service"
.\mvnw.cmd spring-boot:run
```

---

## Expected Results Summary

| Request | Expected Status | Notes |
|---------|----------------|-------|
| Get Users | 200 OK | Returns list of users with 'user' role |
| Create User | 201 Created | Returns new user ID |
| Create Feedback (valid) | 201 Created | Feedback created successfully |
| Create Feedback (invalid) | 400 Bad Request | User is not valid |
| Get All Feedbacks | 200 OK | Returns all feedbacks |
| Get Feedback by ID | 200 OK | Returns single feedback |
| Get by User | 200 OK | Returns user's feedbacks |
| Delete Feedback | 200 OK | Feedback deleted |
| Health Check | 200 OK | Service is healthy |
