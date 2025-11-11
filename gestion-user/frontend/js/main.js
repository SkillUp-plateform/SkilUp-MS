// Configuration
const API_BASE_URL = 'http://localhost:8089';
const KEYCLOAK_URL = 'http://localhost:8080';
const KEYCLOAK_REALM = 'my-app-realm';
const KEYCLOAK_CLIENT_ID = 'my-app-client';
const KEYCLOAK_CLIENT_SECRET = 'J8cChqYP81yh9WPSy9UEKkWy85CLj7Bu';

// Utility functions
function showMessage(elementId, message, isError = false) {
    const messageElement = document.getElementById(elementId);
    messageElement.textContent = message;
    messageElement.className = isError ? 'message error' : 'message success';
    messageElement.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

function saveUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
}

function getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

function clearUserData() {
    localStorage.removeItem('userData');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}

function logout() {
    clearUserData();
    window.location.href = 'index.html';
}

// API functions
async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userData.username,
                email: userData.email,
                password: userData.password,
                fullName: userData.fullName,
                roles: ['user']
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.error || 'Erreur lors de l\'inscription' };
        }
    } catch (error) {
        console.error('Error registering user:', error);
        return { success: false, error: 'Erreur de connexion au serveur' };
    }
}

// Keycloak authentication functions
async function authenticateWithKeycloak(username, password) {
    try {
        const tokenUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;
        
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('client_id', KEYCLOAK_CLIENT_ID);
        formData.append('client_secret', KEYCLOAK_CLIENT_SECRET);
        formData.append('grant_type', 'password');
        
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store tokens
            localStorage.setItem('accessToken', data.access_token);
            localStorage.setItem('refreshToken', data.refresh_token);
            
            // Decode token to get user info
            const userInfo = parseJwt(data.access_token);
            
            return {
                success: true,
                token: data.access_token,
                user: {
                    username: userInfo.preferred_username || username,
                    email: userInfo.email,
                    fullName: userInfo.name || userInfo.preferred_username,
                    roles: userInfo.realm_access?.roles || []
                }
            };
        } else {
            return { success: false, error: data.error_description || 'Authentication failed' };
        }
    } catch (error) {
        console.error('Error authenticating with Keycloak:', error);
        return { success: false, error: 'Erreur de connexion au serveur' };
    }
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing JWT:', error);
        return {};
    }
}

async function loginUser(username, password) {
    return await authenticateWithKeycloak(username, password);
}

async function loginAdmin(username, password) {
    const result = await authenticateWithKeycloak(username, password);
    
    if (result.success) {
        // Check if user has admin role
        if (result.user.roles.includes('admin')) {
            return result;
        } else {
            return { success: false, error: 'Access denied. Admin role required.' };
        }
    }
    
    return result;
}

async function loginFormateur(username, password) {
    const result = await authenticateWithKeycloak(username, password);
    
    if (result.success) {
        // Check if user has formateur role
        if (result.user.roles.includes('formateur')) {
            return result;
        } else {
            return { success: false, error: 'Access denied. Formateur role required.' };
        }
    }
    
    return result;
}

// Check authentication status
function checkAuth() {
    const userData = getUserData();
    const accessToken = localStorage.getItem('accessToken');
    
    if (!userData || !accessToken) {
        window.location.href = 'index.html';
        return null;
    }
    
    // Check if token is expired
    const tokenData = parseJwt(accessToken);
    const currentTime = Date.now() / 1000;
    
    if (tokenData.exp && tokenData.exp < currentTime) {
        // Token expired, try to refresh
        clearUserData();
        window.location.href = 'index.html';
        return null;
    }
    
    return userData;
}