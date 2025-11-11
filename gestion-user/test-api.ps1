# PowerShell script to test the Keycloak middleware API

Write-Host "Testing Keycloak Middleware API..." -ForegroundColor Green

# Base URL for the Python middleware
$BASE_URL = "http://localhost:8089"

# Test health endpoint
Write-Host "`n1. Testing health endpoint..." -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "$BASE_URL/health" -Method GET
Write-Host "Health Status: $($health.status)"
Write-Host "Keycloak: $($health.keycloak)"
Write-Host "Database: $($health.database)"

if ($health.status -ne "healthy") {
    Write-Host "Services are not healthy. Please check the logs." -ForegroundColor Red
    exit 1
}

# Test user creation
Write-Host "`n2. Testing user creation..." -ForegroundColor Yellow

# Test data
$testUsers = @(
    @{
        username = "admin_user"
        email = "admin@example.com"
        password = "admin123"
        full_name = "Admin User"
        roles = @("admin", "user")
    },
    @{
        username = "regular_user"
        email = "user@example.com"
        password = "user123"
        full_name = "Regular User"
        roles = @("user")
    },
    @{
        username = "formateur_user"
        email = "formateur@example.com"
        password = "formateur123"
        full_name = "Formateur User"
        roles = @("formateur", "user")
    }
)

foreach ($user in $testUsers) {
    Write-Host "Creating user: $($user.username)" -ForegroundColor Cyan
    try {
        $response = Invoke-RestMethod -Uri "$BASE_URL/users" -Method POST -Body ($user | ConvertTo-Json) -ContentType "application/json"
        Write-Host "Success: $($response.message)" -ForegroundColor Green
        Write-Host "Keycloak ID: $($response.keycloak_id)"
    }
    catch {
        $errorResponse = $_.Exception.Response
        if ($errorResponse) {
            $reader = New-Object System.IO.StreamReader($errorResponse.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $responseBody = $reader.ReadToEnd()
            Write-Host "Error: $responseBody" -ForegroundColor Red
        } else {
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`n3. Testing direct Keycloak access..." -ForegroundColor Yellow
Write-Host "You can also test directly with Keycloak using these commands:" -ForegroundColor Gray
Write-Host "curl -X POST 'http://localhost:8080/realms/master/protocol/openid-connect/token' \