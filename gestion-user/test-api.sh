#!/bin/bash

# Bash script to test the Keycloak middleware API

echo "Testing Keycloak Middleware API..."

BASE_URL="http://localhost:8089"

echo ""
echo "1. Testing health endpoint..."
health_response=$(curl -s "$BASE_URL/health")
echo "Health Status: $health_response"

if [[ $health_response == *"healthy"* ]]; then
    echo "Services are healthy!"
else
    echo "Services are not healthy. Please check the logs."
    exit 1
fi

echo ""
echo "2. Testing user creation..."

# Create admin user
echo "Creating admin user..."
curl -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_user",
    "email": "admin@example.com",
    "password": "admin123",
    "full_name": "Admin User",
    "roles": ["admin", "user"]
  }'

echo ""
echo "Creating regular user..."
curl -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "regular_user",
    "email": "user@example.com",
    "password": "user123",
    "full_name": "Regular User",
    "roles": ["user"]
  }'

echo ""
echo "Creating formateur user..."
curl -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "formateur_user",
    "email": "formateur@example.com",
    "password": "formateur123",
    "full_name": "Formateur User",
    "roles": ["formateur", "user"]
  }'

echo ""
echo "3. Testing with wrong content type (should fail)..."
curl -X POST "$BASE_URL/users" \
  -H "Content-Type: text/plain" \
  -d "This should fail with 415 error"

echo ""
echo "API testing completed!"