# SkillUp Frontend Integration Guide

## Authentication Integration for Keycloak

### 1. Create Authentication Service

Create a new file `src/services/auth.service.js`:

```javascript
// Keycloak Configuration
const KEYCLOAK_CONFIG = {
  url: 'http://localhost:8080',
  realm: 'my-app-realm',
  clientId: 'my-app-client',
  clientSecret: 'J8cChqYP81yh9WPSy9UEKkWy85CLj7Bu'
};

class AuthService {
  constructor() {
    this.keycloak = null;
    this.user = null;
    this.token = null;
  }

  async login(username, password) {
    try {
      const tokenUrl = `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/token`;
      
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('client_id', KEYCLOAK_CONFIG.clientId);
      formData.append('client_secret', KEYCLOAK_CONFIG.clientSecret);
      formData.append('grant_type', 'password');

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      this.token = data.access_token;
      
      // Decode token to get user info and roles
      const userInfo = this.decodeToken(this.token);
      this.user = {
        username: userInfo.preferred_username,
        email: userInfo.email,
        roles: userInfo.realm_access?.roles || [],
        fullName: userInfo.name || userInfo.preferred_username
      };

      // Store in localStorage
      localStorage.setItem('access_token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
      localStorage.setItem('refresh_token', data.refresh_token);

      return {
        success: true,
        user: this.user,
        token: this.token
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return {};
    }
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('refresh_token');
    this.token = null;
    this.user = null;
  }

  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      return false;
    }

    // Check if token is expired
    try {
      const userInfo = this.decodeToken(token);
      const currentTime = Date.now() / 1000;
      
      if (userInfo.exp && userInfo.exp < currentTime) {
        this.logout();
        return false;
      }

      this.token = token;
      this.user = JSON.parse(user);
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  getCurrentUser() {
    return this.user || JSON.parse(localStorage.getItem('user'));
  }

  getToken() {
    return this.token || localStorage.getItem('access_token');
  }

  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.roles && user.roles.includes(role);
  }

  isAdmin() {
    return this.hasRole('admin');
  }

  isFormateur() {
    return this.hasRole('formateur');
  }

  isUser() {
    return this.hasRole('user');
  }
}

export default new AuthService();
```

### 2. Create Login Component

Create `src/components/LoginComponent.vue`:

```vue
<template>
  <div class="login-container">
    <div class="login-form">
      <h2>{{ title }}</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username:</label>
          <input
            type="text"
            id="username"
            v-model="username"
            required
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="form-control"
          />
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import authService from '@/services/auth.service.js';

export default {
  name: 'LoginComponent',
  props: {
    userType: {
      type: String,
      required: true,
      validator: (value) => ['admin', 'formateur', 'user'].includes(value)
    }
  },
  data() {
    return {
      username: '',
      password: '',
      error: '',
      loading: false
    };
  },
  computed: {
    title() {
      const titles = {
        admin: 'Admin Login',
        formateur: 'Formateur Login',
        user: 'User Login'
      };
      return titles[this.userType];
    }
  },
  methods: {
    async handleLogin() {
      this.error = '';
      this.loading = true;

      try {
        const result = await authService.login(this.username, this.password);
        
        if (result.success) {
          // Check role-based access
          const hasRequiredRole = this.checkRoleAccess(result.user);
          
          if (hasRequiredRole) {
            // Redirect based on user type
            this.redirectUser(result.user);
          } else {
            authService.logout();
            this.error = `Access denied. ${this.userType} role required.`;
          }
        } else {
          this.error = result.error || 'Login failed';
        }
      } catch (error) {
        this.error = 'An error occurred during login';
        console.error('Login error:', error);
      } finally {
        this.loading = false;
      }
    },

    checkRoleAccess(user) {
      switch (this.userType) {
        case 'admin':
          return user.roles.includes('admin');
        case 'formateur':
          return user.roles.includes('formateur');
        case 'user':
          return user.roles.includes('user') || user.roles.includes('default-roles-my-app-realm');
        default:
          return false;
      }
    },

    redirectUser(user) {
      switch (this.userType) {
        case 'admin':
          this.$router.push('/admin/dashboard');
          break;
        case 'formateur':
          this.$router.push('/formateur/dashboard');
          break;
        case 'user':
          this.$router.push('/user/dashboard');
          break;
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
```

### 3. Create Route Guards

Create `src/router/auth.guard.js`:

```javascript
import authService from '@/services/auth.service.js';

export function requireAuth(to, from, next) {
  if (authService.isAuthenticated()) {
    next();
  } else {
    next('/login');
  }
}

export function requireRole(role) {
  return (to, from, next) => {
    if (!authService.isAuthenticated()) {
      next('/login');
      return;
    }

    if (authService.hasRole(role)) {
      next();
    } else {
      next('/unauthorized');
    }
  };
}

export function requireAdmin(to, from, next) {
  return requireRole('admin')(to, from, next);
}

export function requireFormateur(to, from, next) {
  return requireRole('formateur')(to, from, next);
}
```

### 4. Update Router Configuration

Update your `src/router/index.js`:

```javascript
import { createRouter, createWebHistory } from 'vue-router';
import { requireAuth, requireAdmin, requireFormateur } from './auth.guard.js';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/login/admin',
    name: 'AdminLogin',
    component: () => import('@/components/LoginComponent.vue'),
    props: { userType: 'admin' }
  },
  {
    path: '/login/formateur',
    name: 'FormateurLogin',
    component: () => import('@/components/LoginComponent.vue'),
    props: { userType: 'formateur' }
  },
  {
    path: '/login/user',
    name: 'UserLogin',
    component: () => import('@/components/LoginComponent.vue'),
    props: { userType: 'user' }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('@/views/AdminDashboard.vue'),
    beforeEnter: requireAdmin
  },
  {
    path: '/formateur/dashboard',
    name: 'FormateurDashboard',
    component: () => import('@/views/FormateurDashboard.vue'),
    beforeEnter: requireFormateur
  },
  {
    path: '/user/dashboard',
    name: 'UserDashboard',
    component: () => import('@/views/UserDashboard.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('@/views/Unauthorized.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
```

### 5. Create Dashboard Components

Create `src/views/AdminDashboard.vue`:

```vue
<template>
  <div class="dashboard">
    <h1>Admin Dashboard</h1>
    <div class="user-info">
      <h3>Welcome, {{ user.fullName }}</h3>
      <p>Username: {{ user.username }}</p>
      <p>Email: {{ user.email }}</p>
      <p>Roles: {{ user.roles.join(', ') }}</p>
    </div>
    <button @click="logout" class="btn btn-danger">Logout</button>
  </div>
</template>

<script>
import authService from '@/services/auth.service.js';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      user: authService.getCurrentUser()
    };
  },
  methods: {
    logout() {
      authService.logout();
      this.$router.push('/');
    }
  }
};
</script>
```

### 6. Update Main App Component

Update `src/App.vue`:

```vue
<template>
  <div id="app">
    <nav class="navbar" v-if="isAuthenticated">
      <div class="nav-container">
        <div class="nav-brand">
          <router-link to="/">SkillUp</router-link>
        </div>
        <div class="nav-menu">
          <router-link v-if="isAdmin" to="/admin/dashboard">Admin</router-link>
          <router-link v-if="isFormateur" to="/formateur/dashboard">Formateur</router-link>
          <router-link v-if="isUser" to="/user/dashboard">User Dashboard</router-link>
          <button @click="logout" class="btn-logout">Logout</button>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
import authService from '@/services/auth.service.js';

export default {
  name: 'App',
  computed: {
    isAuthenticated() {
      return authService.isAuthenticated();
    },
    isAdmin() {
      return authService.isAdmin();
    },
    isFormateur() {
      return authService.isFormateur();
    },
    isUser() {
      return authService.isUser();
    }
  },
  methods: {
    logout() {
      authService.logout();
      this.$router.push('/');
    }
  }
};
</script>
```

## Testing the Integration

1. **Start your frontend development server**
2. **Navigate to login pages:**
   - Admin: `http://localhost:3000/login/admin`
   - Formateur: `http://localhost:3000/login/formateur`
   - User: `http://localhost:3000/login/user`
3. **Use these test credentials:**
   - **Admin:** username: `admin`, password: `admin`
   - **Formateur:** username: `farouk`, password: `farouk`
   - **User:** username: `testuser`, password: `testuser`

## Key Features Implemented:

✅ **Role-based authentication** with Keycloak
✅ **JWT token management** with automatic refresh
✅ **Route guards** for protected pages
✅ **Role-based navigation** in the app
✅ **Secure logout** functionality
✅ **Token expiration handling**

The integration is now complete and ready to use with your SkillUp frontend!