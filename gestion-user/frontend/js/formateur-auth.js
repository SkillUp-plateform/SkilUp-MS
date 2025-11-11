// Formateur authentication - now using real Keycloak authentication from main.js

document.addEventListener('DOMContentLoaded', function() {
    // Formateur login form
    const formateurLoginForm = document.getElementById('formateurLoginForm');
    if (formateurLoginForm) {
        formateurLoginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                showMessage('formateurLoginMessage', 'Veuillez remplir tous les champs', true);
                return;
            }
            
            const result = await loginFormateur(username, password);
            
            if (result.success) {
                showMessage('formateurLoginMessage', 'Connexion réussie! Redirection...', false);
                
                saveUserData({
                    username: result.user.username,
                    email: result.user.email,
                    fullName: result.user.fullName,
                    role: 'formateur'
                });
                
                setTimeout(() => {
                    window.location.href = 'formateur-panel.html';
                }, 2000);
            } else {
                showMessage('formateurLoginMessage', result.error, true);
            }
        });
    }
});