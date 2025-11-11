// User authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    // User registration form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const fullName = document.getElementById('fullName').value;
            
            // Basic validation
            if (!username || !email || !password || !fullName) {
                showMessage('registerMessage', 'Tous les champs sont obligatoires', true);
                return;
            }
            
            if (password.length < 6) {
                showMessage('registerMessage', 'Le mot de passe doit contenir au moins 6 caractères', true);
                return;
            }
            
            // Register user
            const result = await registerUser({
                username,
                email,
                password,
                fullName
            });
            
            if (result.success) {
                showMessage('registerMessage', 'Inscription réussie! Vous pouvez maintenant vous connecter.', false);
                
                // Clear form
                registerForm.reset();
                
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'user-login.html';
                }, 2000);
            } else {
                showMessage('registerMessage', result.error, true);
            }
        });
    }
    
    // User login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Basic validation
            if (!username || !password) {
                showMessage('loginMessage', 'Veuillez remplir tous les champs', true);
                return;
            }
            
            // Login user
            const result = await loginUser(username, password);
            
            if (result.success) {
                showMessage('loginMessage', 'Connexion réussie! Redirection...', false);
                
                // Save user data and redirect to welcome page
                saveUserData({
                    username: result.user.username,
                    email: result.user.email,
                    fullName: result.user.fullName,
                    role: 'user'
                });
                
                setTimeout(() => {
                    window.location.href = 'welcome.html';
                }, 2000);
            } else {
                showMessage('loginMessage', result.error, true);
            }
        });
    }
});