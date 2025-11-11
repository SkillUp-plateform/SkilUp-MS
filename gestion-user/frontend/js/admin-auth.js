// Admin authentication and panel functionality
async function loginAdmin(username, password) {
    try {
        // Mock admin authentication - in real scenario, use Keycloak
        if (username === 'admin' && password === 'admin123') {
            return { 
                success: true, 
                user: { 
                    username: 'admin', 
                    role: 'admin',
                    fullName: 'Administrateur'
                } 
            };
        }
        
        return { success: false, error: 'Identifiants admin incorrects' };
    } catch (error) {
        console.error('Error logging in admin:', error);
        return { success: false, error: 'Erreur de connexion au serveur' };
    }
}

async function createFormateur(formateurData) {
    try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            return { success: false, error: 'Non authentifié' };
        }

        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                username: formateurData.username,
                email: formateurData.email,
                password: formateurData.password,
                fullName: formateurData.fullName,
                roles: ['formateur']
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            return {
                success: true,
                message: 'Formateur créé avec succès',
                formateur: data
            };
        } else {
            return { success: false, error: data.error || 'Erreur lors de la création du formateur' };
        }
    } catch (error) {
        console.error('Error creating formateur:', error);
        return { success: false, error: 'Erreur de connexion au serveur' };
    }
}

async function getFormateurs() {
    try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            return { success: false, error: 'Non authentifié' };
        }

        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (response.ok) {
            const users = await response.json();
            // Filter users with formateur role
            const formateurs = users.filter(user => user.roles && user.roles.includes('formateur'));
            return { success: true, formateurs };
        } else {
            console.error('Error fetching formateurs:', response.status);
            return { success: false, error: 'Erreur lors de la récupération des formateurs' };
        }
    } catch (error) {
        console.error('Error fetching formateurs:', error);
        return { success: false, error: 'Erreur de connexion au serveur' };
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Admin login form
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                showMessage('adminLoginMessage', 'Veuillez remplir tous les champs', true);
                return;
            }
            
            const result = await loginAdmin(username, password);
            
            if (result.success) {
                showMessage('adminLoginMessage', 'Connexion réussie! Redirection...', false);
                
                saveUserData({
                    username: result.user.username,
                    email: result.user.email,
                    fullName: result.user.fullName,
                    role: 'admin'
                });
                
                setTimeout(() => {
                    window.location.href = 'admin-panel.html';
                }, 2000);
            } else {
                showMessage('adminLoginMessage', result.error, true);
            }
        });
    }
    
    // Formateur creation form
    const formateurForm = document.getElementById('formateurForm');
    if (formateurForm) {
        // Check if admin is authenticated
        const userData = getUserData();
        if (!userData || userData.role !== 'admin') {
            window.location.href = 'admin-login.html';
            return;
        }
        
        // Load existing formateurs
        loadFormateurs();
        
        formateurForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('formateurUsername').value;
            const email = document.getElementById('formateurEmail').value;
            const password = document.getElementById('formateurPassword').value;
            const fullName = document.getElementById('formateurFullName').value;
            
            if (!username || !email || !password || !fullName) {
                showMessage('formateurMessage', 'Tous les champs sont obligatoires', true);
                return;
            }
            
            if (password.length < 6) {
                showMessage('formateurMessage', 'Le mot de passe doit contenir au moins 6 caractères', true);
                return;
            }
            
            const result = await createFormateur({
                username,
                email,
                password,
                fullName
            });
            
            if (result.success) {
                showMessage('formateurMessage', result.message, false);
                formateurForm.reset();
                loadFormateurs(); // Reload the list
            } else {
                showMessage('formateurMessage', result.error, true);
            }
        });
    }
});

async function loadFormateurs() {
    const formateursList = document.getElementById('formateursList');
    if (!formateursList) return;
    
    const result = await getFormateurs();
    
    if (result.success && result.formateurs && result.formateurs.length > 0) {
        formateursList.innerHTML = result.formateurs.map(formateur => `
            <div class="formateur-item">
                <h4>${formateur.fullName}</h4>
                <p><strong>Nom d'utilisateur:</strong> ${formateur.username}</p>
                <p><strong>Email:</strong> ${formateur.email}</p>
            </div>
        `).join('');
    } else {
        formateursList.innerHTML = '<p>Aucun formateur trouvé.</p>';
    }
}