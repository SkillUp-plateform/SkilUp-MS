// Welcome page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    const userData = checkAuth();
    if (!userData) return;
    
    // Display user information
    document.getElementById('userName').textContent = userData.fullName;
    document.getElementById('userUsername').textContent = userData.username;
    document.getElementById('userEmail').textContent = userData.email;
    document.getElementById('userFullName').textContent = userData.fullName;
});