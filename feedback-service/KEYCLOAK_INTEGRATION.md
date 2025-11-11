# Keycloak Integration for Feedback Service

## Overview

The Feedback Service has been updated to integrate with Keycloak for user management. Instead of using a simple `Long userId`, the system now uses Keycloak user IDs to identify users with the 'user' role.

## Changes Made

### 1. Entity Changes

**Feedback.java**
- Changed `private Long userId` → `private String keycloakUserId`
- Now stores Keycloak user IDs instead of simple Long IDs

### 2. New Components

**UserDTO.java**
```java
public class UserDTO {
    private String id;              // Keycloak ID
    private String username;
    private String email;
    private String firstName;
    private String lastName;
}
```

**UserServiceClient.java**
- Communicates with Python User Management Service
- Validates if a user has 'user' role
- Methods: `getAllUsers()`, `isUser()`, `getUserById()`

**WebClientConfig.java**
- Configures WebClient to call external services
- Default URL: `http://localhost:8089`
- Configurable via `user.service.url` property

### 3. Service Layer Updates

**FeedbackService & FeedbackServiceImpl**
- `addFeedback()` now accepts `String keycloakUserId` parameter
- Added validation: Only users with 'user' role can create feedback
- `getFeedbacksByUserId()` now uses `String keycloakUserId`

### 4. Repository Updates

**FeedbackRepository**
- Changed `findByUserId(Long userId)` → `findByKeycloakUserId(String keycloakUserId)`

### 5. Controller Updates

**FeedbackController**
- Updated endpoints to use `keycloakUserId`
- Added error handling (400 BAD REQUEST if user is not valid)
- New endpoint structure with user ID in path

### 6. Dependencies Added

**pom.xml**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

## API Endpoints

### Create Feedback
```http
POST /feedback/addFeedback/user/{keycloakUserId}
Content-Type: application/json

{
  "content": "Great service! Very helpful."
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "keycloakUserId": "abc123-def456-ghi789",
  "content": "Great service! Very helpful.",
  "date": "2025-11-11T17:30:00"
}
```

**Response (400 Bad Request):**
User is not a valid user with 'user' role.

### Get All Feedbacks
```http
GET /feedback/getAllFeedbacks
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "keycloakUserId": "abc123-def456-ghi789",
    "content": "Great service!",
    "date": "2025-11-11T17:30:00"
  }
]
```

### Get Feedback by ID
```http
GET /feedback/getFeedbackById/{id}
```

### Get Feedbacks by User
```http
GET /feedback/getFeedbacksByUserId/{keycloakUserId}
```

**Example:** `GET /feedback/getFeedbacksByUserId/abc123-def456-ghi789`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "keycloakUserId": "abc123-def456-ghi789",
    "content": "Great service!",
    "date": "2025-11-11T17:30:00"
  },
  {
    "id": 2,
    "keycloakUserId": "abc123-def456-ghi789",
    "content": "Another feedback",
    "date": "2025-11-11T18:00:00"
  }
]
```

### Delete Feedback
```http
DELETE /feedback/deleteFeedback/{id}
```

## Configuration

### application.properties

Add the following configuration:

```properties
# User Service URL (Python User Management Service)
user.service.url=http://localhost:8089

# Or if using Docker/Eureka service discovery
# user.service.url=http://user-management-service:8089
```

## How It Works

### Creating Feedback Flow

1. Client sends POST request with `keycloakUserId` in URL
2. `FeedbackController` receives the request
3. `FeedbackService` calls `UserServiceClient.isUser(keycloakUserId)`
4. `UserServiceClient` makes HTTP call to Python service: `/api/admin/keycloak/users?role=user`
5. Python service queries Keycloak for users with 'user' role
6. If user is valid, feedback is created with `keycloakUserId`
7. If not, `IllegalArgumentException` is thrown and 400 BAD REQUEST is returned

## Testing

### 1. Get Keycloak User ID

```bash
curl http://localhost:8089/api/admin/keycloak/users?role=user
```

Response:
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

### 2. Create Feedback

```bash
curl -X POST http://localhost:8080/feedback/addFeedback/user/abc123-def456-ghi789 \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Excellent service! Very satisfied."
  }'
```

### 3. Get Feedbacks by User

```bash
curl http://localhost:8080/feedback/getFeedbacksByUserId/abc123-def456-ghi789
```

## Database Migration

If you have existing data with `user_id` column:

```sql
-- Add new column
ALTER TABLE feedback ADD COLUMN keycloak_user_id VARCHAR(255);

-- Migrate data (you'll need to map old IDs to Keycloak IDs)
-- This depends on your existing data structure

-- Drop old column (after verifying migration)
ALTER TABLE feedback DROP COLUMN user_id;
```

## Troubleshooting

### Issue: "User is not a valid user" error

**Causes:**
1. User doesn't have 'user' role in Keycloak
2. Python User Management Service is down
3. Keycloak is not accessible

**Solution:**
1. Verify user has 'user' role in Keycloak admin console
2. Check Python service: `curl http://localhost:8089/health`
3. Test Python endpoint: `curl http://localhost:8089/api/admin/keycloak/users?role=user`

### Issue: Connection refused to Python service

**Solution:**
1. Verify Python service is running: `docker-compose ps`
2. Check `user.service.url` configuration
3. If using Docker, ensure services are on same network

## Summary

✅ Feedback entity now uses `String keycloakUserId`  
✅ Integration with Python User Management Service  
✅ Validation: Only users with 'user' role can create feedback  
✅ Updated all endpoints to use Keycloak IDs  
✅ Added WebClient for external API calls  
✅ Proper error handling and logging  

The Feedback Service now properly integrates with your Keycloak-based user management system!
