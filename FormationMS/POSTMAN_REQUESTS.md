# Postman Test Requests for FormationMS

## Prerequisites

Before testing, ensure:
1. ✅ Python User Management Service is running (port 8089)
2. ✅ Keycloak is running (port 8080)
3. ✅ FormationMS is running (default port 8080 or your configured port)
4. ✅ At least one user with 'formateur' role exists in Keycloak

---

## Step 1: Get Formateur Keycloak ID

### Request 1: Get All Formateurs from Python Service

**Method:** `GET`  
**URL:** `http://localhost:8089/api/admin/keycloak/users?role=formateur`  
**Headers:**
```
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
[
  {
    "id": "abc123-def456-ghi789",
    "username": "john.trainer",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Trainer"
  },
  {
    "id": "xyz789-uvw456-rst123",
    "username": "jane.formateur",
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "Formateur"
  }
]
```

**Note:** Copy one of the `id` values (e.g., `abc123-def456-ghi789`) to use in the following requests.

---

## Step 2: Create a Formateur (If None Exist)

### Request 2: Create User with Formateur Role

**Method:** `POST`  
**URL:** `http://localhost:8089/api/admin/keycloak/users`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
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

**Expected Response (201 Created):**
```json
{
  "message": "User created successfully",
  "id": "new-keycloak-id-here"
}
```

---

## Step 3: Test FormationMS Endpoints

### Request 3: Create Formation with Valid Formateur

**Method:** `POST`  
**URL:** `http://localhost:8080/formation/add/formateur/{keycloakFormateurId}`  
**Example:** `http://localhost:8080/formation/add/formateur/abc123-def456-ghi789`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "title": "Spring Boot Advanced Course",
  "content": "Deep dive into Spring Boot framework with microservices architecture",
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "videoLink": "https://youtube.com/watch?v=example123",
  "duration": "40 hours",
  "date": "2025-12-15",
  "prix": 499.99
}
```

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "title": "Spring Boot Advanced Course",
  "content": "Deep dive into Spring Boot framework with microservices architecture",
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

### Request 4: Create Formation with Invalid Formateur (Should Fail)

**Method:** `POST`  
**URL:** `http://localhost:8080/formation/add/formateur/invalid-keycloak-id`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "title": "Test Formation",
  "content": "This should fail",
  "duration": "2 hours",
  "date": "2025-12-01",
  "prix": 100.00
}
```

**Expected Response (400 Bad Request):**
```json
null
```
Or error message depending on your error handling configuration.

---

### Request 5: Get All Formations

**Method:** `GET`  
**URL:** `http://localhost:8080/formation/all`

**Headers:**
```
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Spring Boot Advanced Course",
    "content": "Deep dive into Spring Boot framework with microservices architecture",
    "meetingLink": "https://meet.google.com/abc-defg-hij",
    "videoLink": "https://youtube.com/watch?v=example123",
    "duration": "40 hours",
    "date": "2025-12-15",
    "prix": 499.99,
    "keycloakFormateurId": "abc123-def456-ghi789",
    "resources": [],
    "formationImage": null
  }
]
```

---

### Request 6: Get Formation by ID

**Method:** `GET`  
**URL:** `http://localhost:8080/formation/get/{id}`  
**Example:** `http://localhost:8080/formation/get/1`

**Headers:**
```
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "title": "Spring Boot Advanced Course",
  "content": "Deep dive into Spring Boot framework with microservices architecture",
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "videoLink": "https://youtube.com/watch?v=example123",
  "duration": "40 hours",
  "date": "2025-12-15",
  "prix": 499.99,
  "keycloakFormateurId": "abc123-def456-ghi789",
  "resources": [],
  "formationImage": null
}
```

---

### Request 7: Get Formations by Formateur (NEW ENDPOINT)

**Method:** `GET`  
**URL:** `http://localhost:8080/formation/formateur/{keycloakFormateurId}`  
**Example:** `http://localhost:8080/formation/formateur/abc123-def456-ghi789`

**Headers:**
```
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Spring Boot Advanced Course",
    "content": "Deep dive into Spring Boot framework with microservices architecture",
    "meetingLink": "https://meet.google.com/abc-defg-hij",
    "videoLink": "https://youtube.com/watch?v=example123",
    "duration": "40 hours",
    "date": "2025-12-15",
    "prix": 499.99,
    "keycloakFormateurId": "abc123-def456-ghi789",
    "resources": [],
    "formationImage": null
  }
]
```

---

### Request 8: Update Formation

**Method:** `PUT`  
**URL:** `http://localhost:8080/formation/update/{id}/formateur/{keycloakFormateurId}`  
**Example:** `http://localhost:8080/formation/update/1/formateur/abc123-def456-ghi789`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
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

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "title": "Spring Boot Advanced Course - Updated",
  "content": "Updated content with new modules",
  "meetingLink": "https://meet.google.com/new-link",
  "videoLink": "https://youtube.com/watch?v=updated123",
  "duration": "50 hours",
  "date": "2025-12-20",
  "prix": 599.99,
  "keycloakFormateurId": "abc123-def456-ghi789",
  "resources": [],
  "formationImage": null
}
```

---

### Request 9: Delete Formation

**Method:** `DELETE`  
**URL:** `http://localhost:8080/formation/delete/{id}`  
**Example:** `http://localhost:8080/formation/delete/1`

**Headers:**
```
Content-Type: application/json
```

**Expected Response (200 OK):**
No content or success message

---

### Request 10: Health Check (Python Service)

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

### Scenario 1: Happy Path - Create and Manage Formation

1. **Get formateurs** → Request 1
2. **Copy a Keycloak ID** from the response
3. **Create formation** → Request 3 (use the Keycloak ID)
4. **Get all formations** → Request 5 (verify creation)
5. **Get formation by ID** → Request 6
6. **Get formations by formateur** → Request 7
7. **Update formation** → Request 8
8. **Get formation by ID** → Request 6 (verify update)
9. **Delete formation** → Request 9

### Scenario 2: Error Handling - Invalid Formateur

1. **Create formation with invalid ID** → Request 4
2. **Verify 400 Bad Request** response

### Scenario 3: Create New Formateur and Formation

1. **Create new formateur** → Request 2
2. **Copy the new Keycloak ID** from response
3. **Create formation** → Request 3 (use new ID)
4. **Verify creation** → Request 5

---

## Postman Collection JSON

You can import this JSON into Postman:

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
      "name": "2. Create Formateur",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"trainer1\",\n  \"email\": \"trainer1@example.com\",\n  \"firstName\": \"John\",\n  \"lastName\": \"Trainer\",\n  \"temporaryPassword\": \"password123\",\n  \"role\": \"formateur\"\n}"
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
      "name": "3. Create Formation",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Spring Boot Advanced Course\",\n  \"content\": \"Deep dive into Spring Boot framework\",\n  \"meetingLink\": \"https://meet.google.com/abc-defg-hij\",\n  \"videoLink\": \"https://youtube.com/watch?v=example123\",\n  \"duration\": \"40 hours\",\n  \"date\": \"2025-12-15\",\n  \"prix\": 499.99\n}"
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
      "name": "4. Get All Formations",
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
      "name": "5. Get Formation by ID",
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
      "name": "6. Get Formations by Formateur",
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
      "name": "7. Update Formation",
      "request": {
        "method": "PUT",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Spring Boot Advanced Course - Updated\",\n  \"content\": \"Updated content\",\n  \"meetingLink\": \"https://meet.google.com/new-link\",\n  \"videoLink\": \"https://youtube.com/watch?v=updated123\",\n  \"duration\": \"50 hours\",\n  \"date\": \"2025-12-20\",\n  \"prix\": 599.99\n}"
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
      "name": "8. Delete Formation",
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
    },
    {
      "name": "9. Health Check",
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
      "key": "keycloakFormateurId",
      "value": "REPLACE_WITH_ACTUAL_KEYCLOAK_ID",
      "type": "string"
    }
  ]
}
```

---

## How to Use in Postman

### Method 1: Manual Entry
1. Open Postman
2. Create a new request for each endpoint above
3. Copy the method, URL, headers, and body
4. Replace `{{keycloakFormateurId}}` with actual Keycloak ID

### Method 2: Import Collection
1. Copy the JSON collection above
2. In Postman: File → Import → Raw Text
3. Paste the JSON
4. Set the `keycloakFormateurId` variable in collection variables

### Method 3: Use Environment Variables
1. Create a new environment in Postman
2. Add variable: `keycloakFormateurId` = (your actual ID)
3. Add variable: `formationId` = 1
4. Use `{{keycloakFormateurId}}` and `{{formationId}}` in requests

---

## Expected Results Summary

| Request | Expected Status | Notes |
|---------|----------------|-------|
| Get Formateurs | 200 OK | Returns list of formateurs |
| Create Formateur | 201 Created | Returns new user ID |
| Create Formation (valid) | 201 Created | Formation created successfully |
| Create Formation (invalid) | 400 Bad Request | User is not a formateur |
| Get All Formations | 200 OK | Returns all formations |
| Get Formation by ID | 200 OK | Returns single formation |
| Get by Formateur | 200 OK | Returns formateur's formations |
| Update Formation | 200 OK | Formation updated |
| Delete Formation | 200 OK | Formation deleted |
| Health Check | 200 OK | Service is healthy |

---

## Troubleshooting

### Issue: "Connection refused" on port 8089
**Solution:** Start Python User Management Service
```bash
cd c:\Users\m2l3k\Desktop\gestion-user
docker-compose up -d python-app
```

### Issue: "Connection refused" on port 8080
**Solution:** Start FormationMS
```bash
cd "c:\Users\m2l3k\Desktop\Final microservices\FormationMS"
.\mvnw.cmd spring-boot:run
```

### Issue: Empty formateurs list
**Solution:** Create a formateur using Request 2

### Issue: 400 Bad Request when creating formation
**Solution:** Verify the Keycloak ID exists and user has 'formateur' role (use Request 1)
