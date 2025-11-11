# Postman Login Requests

## Keycloak Login Endpoint
**URL:** `http://localhost:8080/realms/my-app-realm/protocol/openid-connect/token`

**Method:** POST

**Headers:**
```
Content-Type: application/x-www-form-urlencoded
```

## 1. Admin User Login

**Request Body (x-www-form-urlencoded):**
```
username: admin
password: admin
client_id: my-app-client
client_secret: J8cChqYP81yh9WPSy9UEKkWy85CLj7Bu
grant_type: password
```

**Expected Response:**
```json
{
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxN3Rl...",
    "expires_in": 300,
    "refresh_expires_in": 1800,
    "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxN3Rl...",
    "token_type": "Bearer",
    "not-before-policy": 0,
    "session_state": "...",
    "scope": "profile email"
}
```

## 2. Formateur User Login

**Request Body (x-www-form-urlencoded):**
```
username: farouk
password: farouk
client_id: my-app-client
client_secret: J8cChqYP81yh9WPSy9UEKkWy85CLj7Bu
grant_type: password
```

**Expected Response:**
```json
{
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxN3Rl...",
    "expires_in": 300,
    "refresh_expires_in": 1800,
    "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxN3Rl...",
    "token_type": "Bearer",
    "not-before-policy": 0,
    "session_state": "...",
    "scope": "profile email"
}
```

## 3. Regular User Login

**Request Body (x-www-form-urlencoded):**
```
username: testuser
password: testuser
client_id: my-app-client
client_secret: J8cChqYP81yh9WPSy9UEKkWy85CLj7Bu
grant_type: password
```

**Expected Response:**
```json
{
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxN3Rl...",
    "expires_in": 300,
    "refresh_expires_in": 1800,
    "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxN3Rl...",
    "token_type": "Bearer",
    "not-before-policy": 0,
    "session_state": "...",
    "scope": "profile email"
}
```

## Token Introspection (Verify Roles)

**URL:** `http://localhost:8080/realms/my-app-realm/protocol/openid-connect/token/introspect`

**Method:** POST

**Headers:**
```
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```
token: [ACCESS_TOKEN_FROM_LOGIN]
client_id: my-app-client
client_secret: J8cChqYP81yh9WPSy9UEKkWy85CLj7Bu
```

**Expected Response (will show roles):**
```json
{
    "exp": 1699623456,
    "iat": 1699623156,
    "auth_time": 1699623156,
    "jti": "...",
    "iss": "http://localhost:8080/realms/my-app-realm",
    "aud": "account",
    "sub": "...",
    "typ": "Bearer",
    "azp": "my-app-client",
    "session_state": "...",
    "preferred_username": "admin",
    "email_verified": false,
    "acr": "1",
    "realm_access": {
        "roles": [
            "admin",
            "default-roles-my-app-realm",
            "offline_access",
            "uma_authorization"
        ]
    },
    "resource_access": {
        "account": {
            "roles": [
                "manage-account",
                "manage-account-links",
                "view-profile"
            ]
        }
    },
    "scope": "profile email",
    "sid": "...",
    "client_id": "my-app-client",
    "username": "admin",
    "active": true
}
```

## Quick Test Commands

### Using curl:
```bash
# Admin login
curl -X POST "http://localhost:8080/realms/my-app-realm/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin&client_id=my-app-client&client_secret=J8cChqYP81yh9WPSy9UEKkWy85CLj7Bu&grant_type=password"

# Formateur login
curl -X POST "http://localhost:8080/realms/my-app-realm/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=farouk&password=farouk&client_id=my-app-client&client_secret=J8cChqYP81yh9WPSy9UEKkWy85CLj7Bu&grant_type=password"

# User login
curl -X POST "http://localhost:8080/realms/my-app-realm/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=testuser&client_id=my-app-client&client_secret=J8cChqYP81yh9WPSy9UEKkWy85CLj7Bu&grant_type=password"
```

## Postman Collection Import

The updated Postman collection is available at: `postman-collection.json`

**Key Configuration:**
- **Client ID:** `my-app-client`
- **Client Secret:** `J8cChqYP81yh9WPSy9UEKkWy85CLj7Bu`
- **Realm:** `my-app-realm`
- **Keycloak URL:** `http://localhost:8080`

## Testing Steps in Postman:

1. **Import the collection** from `postman-collection.json`
2. **Test Admin Login** - Should return access token with `admin` role
3. **Test Formateur Login** - Should return access token with `formateur` role  
4. **Test User Login** - Should return access token with `user` role
5. **Use Token Introspection** to verify roles in the access token

All login requests should return HTTP 200 with valid access tokens.