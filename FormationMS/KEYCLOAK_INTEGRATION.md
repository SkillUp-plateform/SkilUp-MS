# Keycloak Integration for FormationMS

## Overview

The FormationMS microservice has been updated to integrate with Keycloak for formateur (trainer) management. Instead of using a simple `Long idFormateur`, the system now uses Keycloak user IDs to identify formateurs.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   FormationMS                           │
│  ┌───────────────────────────────────────────────────┐ │
│  │  FormationController                              │ │
│  │  - Accepts keycloakFormateurId (String)           │ │
│  └───────────────────────────────────────────────────┘ │
│                        ↓                                │
│  ┌───────────────────────────────────────────────────┐ │
│  │  FormationService                                 │ │
│  │  - Validates formateur via UserServiceClient     │ │
│  └───────────────────────────────────────────────────┘ │
│                        ↓                                │
│  ┌───────────────────────────────────────────────────┐ │
│  │  UserServiceClient (WebClient)                    │ │
│  │  - Calls Python User Management API              │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                         ↓ HTTP
┌─────────────────────────────────────────────────────────┐
│       Python User Management Service (Flask)            │
│  - Port: 8089                                           │
│  - Endpoint: /api/admin/keycloak/users?role=formateur  │
│  - Returns: List of users with 'formateur' role        │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    Keycloak                             │
│  - Manages users and roles                             │
│  - Realm: my-app-realm                                 │
│  - Roles: admin, user, formateur                       │
└─────────────────────────────────────────────────────────┘
```

## Changes Made

### 1. Entity Changes

**Formation.java**
- Changed `private Long idFormateur` → `private String keycloakFormateurId`
- Updated getters/setters accordingly

### 2. New Components

**FormateurDTO.java**
```java
public class FormateurDTO {
    private String id;              // Keycloak ID
    private String username;
    private String email;
    private String firstName;
    private String lastName;
}
```

**UserServiceClient.java**
- Communicates with Python User Management Service
- Methods:
  - `getAllFormateurs()` - Get all users with 'formateur' role
  - `isFormateur(keycloakId)` - Verify if user is a formateur
  - `getFormateurById(keycloakId)` - Get formateur details

**WebClientConfig.java**
- Configures WebClient to call external services
- Default URL: `http://localhost:8089`
- Configurable via `user.service.url` property

### 3. Service Layer Updates

**FormationService & FormationServiceImpl**
- Methods now accept `String keycloakFormateurId` instead of `Long idFormateur`
- Added validation: Verifies user has 'formateur' role before creating/updating formations
- New method: `getFormationsByFormateur(keycloakFormateurId)`

### 4. Controller Updates

**FormationController**
- Updated endpoints to use `keycloakFormateurId`
- Added error handling for invalid formateurs
- New endpoint: `GET /formation/formateur/{keycloakFormateurId}`

### 5. Dependencies Added

**pom.xml**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

## API Endpoints

### Create Formation
```http
POST /formation/add/formateur/{keycloakFormateurId}
Content-Type: application/json

{
  "title": "Spring Boot Advanced",
  "content": "Deep dive into Spring Boot",
  "meetingLink": "https://meet.example.com/room123",
  "videoLink": "https://video.example.com/course1",
  "duration": "3 hours",
  "date": "2025-12-01",
  "prix": 299.99
}
```

**Response:**
- `201 CREATED` - Formation created successfully
- `400 BAD REQUEST` - User is not a formateur

### Update Formation
```http
PUT /formation/update/{id}/formateur/{keycloakFormateurId}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  ...
}
```

**Response:**
- `200 OK` - Formation updated successfully
- `404 NOT FOUND` - Formation not found
- `400 BAD REQUEST` - User is not a formateur

### Get Formations by Formateur
```http
GET /formation/formateur/{keycloakFormateurId}
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Spring Boot Advanced",
    "keycloakFormateurId": "abc123-def456-ghi789",
    ...
  }
]
```

### Get All Formations
```http
GET /formation/all
```

### Get Formation by ID
```http
GET /formation/get/{id}
```

### Delete Formation
```http
DELETE /formation/delete/{id}
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

### For Docker Deployment

If both services are in Docker:

```yaml
services:
  formation-ms:
    environment:
      - USER_SERVICE_URL=http://python-app:8089
```

## How It Works

### 1. Creating a Formation

1. Client sends POST request with `keycloakFormateurId` in URL
2. `FormationController` receives the request
3. `FormationService` calls `UserServiceClient.isFormateur(keycloakFormateurId)`
4. `UserServiceClient` makes HTTP call to Python service: `/api/admin/keycloak/users?role=formateur`
5. Python service queries Keycloak for users with 'formateur' role
6. If user is a formateur, formation is created with `keycloakFormateurId`
7. If not, `IllegalArgumentException` is thrown and 400 BAD REQUEST is returned

### 2. Validation Flow

```
FormationMS → UserServiceClient → Python Service → Keycloak
                                         ↓
                                   Verify Role
                                         ↓
                                   Return Result
```

## Example Usage

### 1. Get Keycloak Formateur ID

First, get the list of formateurs from the Python service:

```bash
curl http://localhost:8089/api/admin/keycloak/users?role=formateur
```

Response:
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

### 2. Create Formation with Formateur ID

```bash
curl -X POST http://localhost:8080/formation/add/formateur/abc123-def456-ghi789 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Spring Boot Masterclass",
    "content": "Complete Spring Boot course",
    "duration": "40 hours",
    "date": "2025-12-01",
    "prix": 499.99
  }'
```

### 3. Get Formations by Formateur

```bash
curl http://localhost:8080/formation/formateur/abc123-def456-ghi789
```

## Error Handling

### User is not a formateur
```json
{
  "timestamp": "2025-11-11T17:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "User is not a formateur"
}
```

### Formation not found
```json
{
  "timestamp": "2025-11-11T17:00:00",
  "status": 404,
  "error": "Not Found"
}
```

### User service unavailable
If the Python User Management Service is down, the validation will fail and formations cannot be created/updated.

## Testing

### Unit Tests

Test the `UserServiceClient`:
```java
@Test
void testIsFormateur() {
    String keycloakId = "abc123-def456-ghi789";
    boolean result = userServiceClient.isFormateur(keycloakId);
    assertTrue(result);
}
```

### Integration Tests

1. Ensure Python User Management Service is running
2. Ensure Keycloak is running with test users
3. Test formation creation with valid/invalid formateur IDs

## Migration Guide

### Database Migration

If you have existing formations with `idFormateur` (Long), you need to migrate:

```sql
-- Add new column
ALTER TABLE formation ADD COLUMN keycloak_formateur_id VARCHAR(255);

-- Migrate data (you'll need to map old IDs to Keycloak IDs)
-- This depends on your existing data structure

-- Drop old column (after verifying migration)
ALTER TABLE formation DROP COLUMN id_formateur;
```

### API Client Updates

Update your frontend/API clients to use Keycloak IDs:

**Before:**
```javascript
POST /formation/add/formateur/123
```

**After:**
```javascript
POST /formation/add/formateur/abc123-def456-ghi789
```

## Troubleshooting

### Issue: "User is not a formateur" error

**Causes:**
1. User doesn't have 'formateur' role in Keycloak
2. Python User Management Service is down
3. Keycloak is not accessible

**Solution:**
1. Verify user has 'formateur' role in Keycloak admin console
2. Check Python service logs: `docker-compose logs python-app`
3. Test Python endpoint directly: `curl http://localhost:8089/api/admin/keycloak/users?role=formateur`

### Issue: Connection refused to Python service

**Solution:**
1. Verify Python service is running: `docker-compose ps`
2. Check `user.service.url` configuration
3. If using Docker, ensure services are on same network

### Issue: Empty formateur list

**Solution:**
1. Create users with 'formateur' role in Keycloak
2. Or use Python API to create formateurs:
```bash
curl -X POST http://localhost:8089/api/admin/keycloak/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "trainer1",
    "email": "trainer1@example.com",
    "firstName": "John",
    "lastName": "Trainer",
    "temporaryPassword": "password123",
    "role": "formateur"
  }'
```

## Security Considerations

1. **Authentication**: Add JWT/OAuth2 authentication to FormationMS endpoints
2. **Authorization**: Verify that only formateurs can create/update their own formations
3. **API Security**: Secure communication between FormationMS and Python service
4. **Input Validation**: Validate all input data to prevent injection attacks

## Future Enhancements

1. **Caching**: Cache formateur validation results to reduce API calls
2. **Async Processing**: Use reactive programming for non-blocking API calls
3. **Service Discovery**: Use Eureka to discover Python service dynamically
4. **Circuit Breaker**: Add Resilience4j circuit breaker for fault tolerance
5. **Event-Driven**: Publish events when formations are created/updated
