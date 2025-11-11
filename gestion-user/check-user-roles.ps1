# Get access token
$response = Invoke-RestMethod -Uri "http://localhost:8080/realms/my-app-realm/protocol/openid-connect/token" -Method POST -Headers @{ "Content-Type" = "application/x-www-form-urlencoded" } -Body "username=admin&password=admin&grant_type=password&client_id=my-app-client"
$accessToken = $response.access_token

# Get admin token for full access
$adminToken = (Invoke-RestMethod -Uri "http://localhost:8080/realms/master/protocol/openid-connect/token" -Method POST -Headers @{ "Content-Type" = "application/x-www-form-urlencoded" } -Body "username=admin&password=admin&grant_type=password&client_id=admin-cli").access_token

# Get all users in the realm
$usersResponse = Invoke-RestMethod -Uri "http://localhost:8080/admin/realms/my-app-realm/users" -Method GET -Headers @{ "Authorization" = "Bearer $adminToken" }

Write-Host "=== USER ROLES ANALYSIS ===" -ForegroundColor Green
Write-Host ""

foreach ($user in $usersResponse) {
    Write-Host "User: $($user.username)" -ForegroundColor Yellow
    Write-Host "User ID: $($user.id)"
    
    # Get user's realm-level roles
    Write-Host "`nRealm-level roles:" -ForegroundColor Cyan
    $realmRolesResponse = Invoke-RestMethod -Uri "http://localhost:8080/admin/realms/my-app-realm/users/$($user.id)/role-mappings/realm" -Method GET -Headers @{ "Authorization" = "Bearer $adminToken" }
    
    if ($realmRolesResponse.Count -eq 0) {
        Write-Host "  - No realm-level roles"
    } else {
        foreach ($role in $realmRolesResponse) {
            Write-Host "  - Role: $($role.name)" -ForegroundColor White
        }
    }
    
    # Get available clients
    $clientsResponse = Invoke-RestMethod -Uri "http://localhost:8080/admin/realms/my-app-realm/clients" -Method GET -Headers @{ "Authorization" = "Bearer $adminToken" }
    
    # Check client-level roles for each client
    foreach ($client in $clientsResponse) {
        $clientRolesResponse = Invoke-RestMethod -Uri "http://localhost:8080/admin/realms/my-app-realm/users/$($user.id)/role-mappings/clients/$($client.id)" -Method GET -Headers @{ "Authorization" = "Bearer $adminToken" }
        
        if ($clientRolesResponse.Count -gt 0) {
            Write-Host "`nClient '$($client.clientId)' roles:" -ForegroundColor Cyan
            foreach ($role in $clientRolesResponse) {
                Write-Host "  - Role: $($role.name)" -ForegroundColor White
            }
        }
    }
    
    Write-Host "`n---" -ForegroundColor Gray
    Write-Host ""
}