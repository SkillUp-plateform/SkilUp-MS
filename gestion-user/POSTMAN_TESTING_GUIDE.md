# Postman Testing Guide for User Management System

## Quick Start

### 1. Import Collection
1. Open Postman
2. Click "Import" button
3. Select the `postman-collection.json` file
4. Click "Import" to add the collection

### 2. Verify Services are Running
Before testing, ensure all services are running:
```bash
# Check Python API health
curl http://localhost:8089/health

# Check Keycloak is accessible
curl http://localhost:8080/realms/my-app-realm/.well-known/openid-configuration
```

## Authentication Flow Tests

### Test 1: Health Check
**Request**: `Health Check`
- **Purpose**: Verify all services are running
- **Expected Response**: 
```json
{
  "database": "connected",
  "keycloak": "connected", 
  "realm": "my-app-realm",
  "status": "healthy"
}
```

### Test 2: User Registration
**Request**: `User Registration`
- **Purpose**: Create a new user account
- **Method**: POST
- **Body** (JSON):
```json
{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "password123",
  "fullName": "Test User",
  "roles": ["user"]
}
```
- **Expected Response**: 
```json
{
  "message": "User created successfully with roles",
  "keycloak_id": "uuid-here"
}
```

### Test 3: User Login
**Request**: `User Login (Keycloak)`
- **Purpose**: Authenticate user and get access token
- **Method**: POST
- **Body** (x-www-form-urlencoded):
- username: `testuser`
- password: `password123`
- client_id: `admin-cli`
- grant_type: `password`

- **Expected Response**:
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6IC...",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6IC...",
  "token_type": "Bearer",
  "not-before-policy": 0,
  "session_state": "uuid-here",
  "scope": "profile email"
}
```

### Test 4: Formateur Registration
**Request**: `Formateur Registration`
- **Purpose**: Create a new formateur account
- **Method**: POST
- **Body** (JSON):
```json
{
  "username": "formateur1",
  "email": "formateur1@example.com",
  "password": "formateur123",
  "fullName": "Formateur Un",
  "roles": ["formateur"]
}
```

### Test 5: Formateur Login
**Request**: `Formateur Login (Keycloak)`
- **Purpose**: Authenticate formateur and get access token
- **Method**: POST
- **Body** (x-www-form-urlencoded):
- username: `formateur1`
- password: `formateur123`
- client_id: `admin-cli`
- grant_type: `password`

### Test 6: Admin Registration
**Request**: `Admin Registration`
- **Purpose**: Create a new admin account
- **Method**: POST
- **Body** (JSON):
```json
{
  "username": "admin1",
  "email": "admin1@example.com",
  "password": "admin123",
  "fullName": "Admin One",
  "roles": ["admin"]
}
```

### Test 7: Admin Login
**Request**: `Admin Login (Keycloak)`
- **Purpose**: Authenticate admin and get access token
- **Method**: POST
- **Body** (x-www-form-urlencoded):
- username: `admin1`
- password: `admin123`
- client_id: `admin-cli`
- grant_type: `password`

## Advanced Testing

### Get User Info
**Request**: `Get User Info`
- **Purpose**: Retrieve user information from Python API
- **Method**: GET
- **URL**: `http://localhost:8089/users/{keycloak_id}`
- **Replace**: `{keycloak_id}` with actual Keycloak ID from registration response

### Get All Users
**Request**: `Get All Users`
- **Purpose**: List all users (if endpoint exists)
- **Method**: GET
- **URL**: `http://localhost:8089/users`

## Testing Workflow

### 1. Basic Flow
1. Run Health Check
2. Register a new user
3. Login with the new user credentials
4. Verify access token is received

### 2. Role Testing
1. Register users with different roles (user, formateur, admin)
2. Login with each role
3. Verify tokens are generated correctly for each role

### 3. Error Testing
Try these scenarios to test error handling:
- Login with wrong credentials
- Register with duplicate username/email
- Register with missing required fields

## Postman Tips

### Environment Variables
Create an environment with these variables:
- `base_url`: `http://localhost:8089`
- `keycloak_url`: `http://localhost:8080`
- `access_token`: (store token after login)
- `user_keycloak_id`: (store user ID after registration)

### Token Management
After successful login, copy the access token and:
1. Store it in environment variable `access_token`
2. Use it in Authorization header for protected endpoints
3. Set token type as "Bearer Token" in Postman

### Response Validation
Use Postman's test scripts to validate responses:
```javascript
// Test for successful registration
pm.test("Registration successful", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.message).to.include("successfully");
});

// Test for successful login
pm.test("Login successful", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.access_token).to.exist;
});
```

## Troubleshooting

### Connection Issues
- Ensure Docker containers are running: `docker-compose ps`
- Check Python API logs: `docker logs python-app`
- Check Keycloak logs: `docker logs keycloak`

### Authentication Failures
- Verify Keycloak realm configuration
- Check user roles are properly assigned
- Ensure client_id is correct (`admin-cli`)

### Registration Issues
- Check for duplicate usernames/emails
- Verify all required fields are provided
- Check Python API logs for detailed error messages