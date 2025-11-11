# Get admin token
$adminToken = (Invoke-RestMethod -Uri "http://localhost:8080/realms/master/protocol/openid-connect/token" -Method POST -Headers @{ "Content-Type" = "application/x-www-form-urlencoded" } -Body "username=admin&password=admin&grant_type=password&client_id=admin-cli").access_token

Write-Host "=== ASSIGNING MISSING ROLES ===" -ForegroundColor Green

# Get role IDs
$rolesResponse = Invoke-RestMethod -Uri "http://localhost:8080/admin/realms/my-app-realm/roles" -Method GET -Headers @{ "Authorization" = "Bearer $adminToken" }

$adminRole = $rolesResponse | Where-Object { $_.name -eq "admin" }
$formateurRole = $rolesResponse | Where-Object { $_.name -eq "formateur" }

Write-Host "Found roles:" -ForegroundColor Yellow
Write-Host "  - admin role ID: $($adminRole.id)"
Write-Host "  - formateur role ID: $($formateurRole.id)"

# Get users
$usersResponse = Invoke-RestMethod -Uri "http://localhost:8080/admin/realms/my-app-realm/users" -Method GET -Headers @{ "Authorization" = "Bearer $adminToken" }

# Assign admin role to admin user
$adminUser = $usersResponse | Where-Object { $_.username -eq "admin" }
if ($adminUser -and $adminRole) {
    Write-Host "`nAssigning 'admin' role to admin user..." -ForegroundColor Cyan
    
    # Create the role object for the request body
    $roleBody = @(@{
        id = $adminRole.id
        name = $adminRole.name
        description = $adminRole.description
        composite = $adminRole.composite
        clientRole = $adminRole.clientRole
        containerId = $adminRole.containerId
    }) | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "http://localhost:8080/admin/realms/my-app-realm/users/$($adminUser.id)/role-mappings/realm" -Method POST -Headers @{ 
            "Authorization" = "Bearer $adminToken"
            "Content-Type" = "application/json"
        } -Body $roleBody
        Write-Host "✓ Admin role assigned successfully" -ForegroundColor Green
    } catch {
        Write-Host "Error assigning admin role: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Assign formateur role to farouk user
$faroukUser = $usersResponse | Where-Object { $_.username -eq "farouk" }
if ($faroukUser -and $formateurRole) {
    Write-Host "`nAssigning 'formateur' role to farouk user..." -ForegroundColor Cyan
    
    # Create the role object for the request body
    $roleBody = @(@{
        id = $formateurRole.id
        name = $formateurRole.name
        description = $formateurRole.description
        composite = $formateurRole.composite
        clientRole = $formateurRole.clientRole
        containerId = $formateurRole.containerId
    }) | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "http://localhost:8080/admin/realms/my-app-realm/users/$($faroukUser.id)/role-mappings/realm" -Method POST -Headers @{ 
            "Authorization" = "Bearer $adminToken"
            "Content-Type" = "application/json"
        } -Body $roleBody
        Write-Host "✓ Formateur role assigned successfully" -ForegroundColor Green
    } catch {
        Write-Host "Error assigning formateur role: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== ROLE ASSIGNMENT COMPLETE ===" -ForegroundColor Green