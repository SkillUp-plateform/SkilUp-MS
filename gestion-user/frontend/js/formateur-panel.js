// Formateur panel functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if formateur is authenticated
    const userData = checkAuth();
    if (!userData || userData.role !== 'formateur') {
        window.location.href = 'formateur-login.html';
        return;
    }
    
    // Display formateur information
    document.getElementById('formateurName').textContent = userData.fullName;
    document.getElementById('formateurUsername').textContent = userData.username;
    document.getElementById('formateurEmail').textContent = userData.email;
    document.getElementById('formateurFullName').textContent = userData.fullName;
});