# Quick Setup Guide - Keycloak Integration

## Prerequisites

✅ Python User Management Service running (port 8089)  
✅ Keycloak running with 'my-app-realm' realm  
✅ At least one user with 'formateur' role in Keycloak

## Step 1: Update Dependencies

The `pom.xml` has been updated with WebFlux dependency. Run:

```bash
cd "c:\Users\m2l3k\Desktop\Final microservices\FormationMS"
mvn clean install
```

## Step 2: Configure Application

Create or update `src/main/resources/application.properties`:

```properties
# User Service Configuration
user.service.url=http://localhost:8089

# Or if using Docker
# user.service.url=http://python_user_manager:8089

# Or if using Eureka service discovery
# user.service.url=http://user-management-service:8089
```

## Step 3: Start the Application

```bash
mvn spring-boot:run
```

## Step 4: Test the Integration

### 1. Get Formateurs from Python Service

```bash
curl http://localhost:8089/api/admin/keycloak/users?role=formateur
```

Expected response:
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

### 2. Create a Formation

Use the Keycloak ID from step 1:

```bash
curl -X POST http://localhost:8080/formation/add/formateur/abc123-def456-ghi789 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Spring Boot Advanced",
    "content": "Deep dive into Spring Boot",
    "meetingLink": "https://meet.example.com/room123",
    "duration": "3 hours",
    "date": "2025-12-01",
    "prix": 299.99
  }'
```

Expected response (201 CREATED):
```json
{
  "id": 1,
  "title": "Spring Boot Advanced",
  "content": "Deep dive into Spring Boot",
  "keycloakFormateurId": "abc123-def456-ghi789",
  ...
}
```

### 3. Get Formations by Formateur

```bash
curl http://localhost:8080/formation/formateur/abc123-def456-ghi789
```

## API Changes Summary

### Old Endpoints (Deprecated)
```
POST /formation/add/formateur/{idFormateur}        // idFormateur was Long
PUT  /formation/update/{id}/formateur/{idFormateur}
```

### New Endpoints
```
POST /formation/add/formateur/{keycloakFormateurId}        // keycloakFormateurId is String
PUT  /formation/update/{id}/formateur/{keycloakFormateurId}
GET  /formation/formateur/{keycloakFormateurId}            // NEW
```

## Troubleshooting

### Error: "User is not a formateur"

**Check 1:** Verify user has formateur role
```bash
curl http://localhost:8089/api/admin/keycloak/users?role=formateur
```

**Check 2:** Create a formateur if none exist
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

### Error: Formation entity has no field 'idFormateur'

**Solution:** This is expected. The field has been renamed to `keycloakFormateurId`. Update your database schema if needed.

## Database Migration (If Needed)

If you have existing data with `id_formateur` column:

```sql
-- H2 Database (for development)
ALTER TABLE formation ADD COLUMN keycloak_formateur_id VARCHAR(255);
-- Manually map old IDs to Keycloak IDs
-- Then drop old column:
-- ALTER TABLE formation DROP COLUMN id_formateur;
```

## What Changed

| Component | Change |
|-----------|--------|
| **Formation.java** | `Long idFormateur` → `String keycloakFormateurId` |
| **FormationController** | Path variables now use `keycloakFormateurId` |
| **FormationService** | Added validation via `UserServiceClient` |
| **New: UserServiceClient** | Communicates with Python service |
| **New: FormateurDTO** | DTO for formateur data |
| **New: WebClientConfig** | Configures HTTP client |
| **pom.xml** | Added `spring-boot-starter-webflux` |

## Complete Example Workflow

```bash
# 1. Start Python service (if not running)
cd c:\Users\m2l3k\Desktop\gestion-user
docker-compose up -d

# 2. Start FormationMS
cd "c:\Users\m2l3k\Desktop\Final microservices\FormationMS"
mvn spring-boot:run

# 3. Get formateur ID
curl http://localhost:8089/api/admin/keycloak/users?role=formateur

# 4. Create formation (use ID from step 3)
curl -X POST http://localhost:8080/formation/add/formateur/YOUR_KEYCLOAK_ID \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Formation","content":"Test","duration":"2h","date":"2025-12-01","prix":100}'

# 5. Get all formations
curl http://localhost:8080/formation/all

# 6. Get formations by formateur
curl http://localhost:8080/formation/formateur/YOUR_KEYCLOAK_ID
```

## Next Steps

1. ✅ Update frontend to use Keycloak IDs instead of Long IDs
2. ✅ Add authentication/authorization to endpoints
3. ✅ Implement caching for formateur validation
4. ✅ Add comprehensive error handling
5. ✅ Write unit and integration tests

For detailed documentation, see `KEYCLOAK_INTEGRATION.md`
