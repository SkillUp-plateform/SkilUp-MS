# 🚀 Angular Authentication Setup Guide

## Quick Setup for `C:\Users\m2l3k\Desktop\SkillUp-Front-main\src\app\sign-in`

### 📁 Copy Files to Your Angular Project

#### 1. Authentication Service
**Copy to:** `C:\Users\m2l3k\Desktop\SkillUp-Front-main\src\app\services\auth.service.ts`
```bash
# Create services directory if it doesn't exist
mkdir C:\Users\m2l3k\Desktop\SkillUp-Front-main\src\app\services

# Copy the auth service
copy auth.service.ts C:\Users\m2l3k\Desktop\SkillUp-Front-main\src\app\services\
```

#### 2. Sign-In Component Files
**Copy to your sign-in component directory:**
```bash
# Copy component files
copy sign-in.component.ts C:\Users\m2l3k\Desktop\SkillUp-Front-main\src\app\sign-in\
copy sign-in.component.html C:\Users\m2l3k\Desktop\SkillUp-Front-main\src\app\sign-in\
copy sign-in.component.css C:\Users\m2l3k\Desktop\SkillUp-Front-main\src\app\sign-in\
```

#### 3. Route Guards
**Copy to:** `C:\Users\m2l3k\Desktop\SkillUp-Front-main\src\app\guards\`
```bash
# Create guards directory
mkdir C:\Users\m2l3k\Desktop\SkillUp-Front-main\src\app\guards

# Copy guards
copy auth.guard.ts C:\Users\m2l3k\Desktop\SkillUp-Front-main\src\app\guards\
copy role.guard.ts C:\Users\m2l3k\Desktop\SkillUp-Front-main\src\app\guards\
```

### 🔧 Update Your Angular Configuration

#### 1. Update `app.module.ts`
```typescript
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Import your components and services
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: 'signin', component: SignInComponent },
  { 
    path: 'admin/dashboard', 
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [RoleGuard],
    data: { role: 'admin' }
  },
  { 
    path: 'formateur/dashboard', 
    loadChildren: () => import('./formateur/formateur.module').then(m => m.FormateurModule),
    canActivate: [RoleGuard],
    data: { role: 'formateur' }
  },
  { 
    path: 'user/dashboard', 
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: '**', redirectTo: '/signin' }
];

@NgModule({
  declarations: [
    // ... your existing components
    SignInComponent
  ],
  imports: [
    // ... your existing imports
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    // ... your existing providers
    AuthService,
    AuthGuard,
    RoleGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

#### 2. Create Dashboard Components (Optional for Testing)

**Admin Dashboard:** `C:\Users\m2l3k\Desktop\SkillUp-Front-main\src\app\admin\dashboard.component.ts`
```typescript
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="dashboard">
      <h1>Admin Dashboard</h1>
      <div *ngIf="user">
        <p>Welcome, {{ user.fullName }}!</p>
        <p>Username: {{ user.username }}</p>
        <p>Email: {{ user.email }}</p>
        <p>Roles: {{ user.roles.join(', ') }}</p>
      </div>
      <button (click)="logout()" class="btn btn-danger">Logout</button>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
  }
}
```

### 🧪 Test Your Integration

#### 1. Start Your Angular Development Server
```bash
cd C:\Users\m2l3k\Desktop\SkillUp-Front-main
ng serve
```

#### 2. Navigate to Login Page
Open your browser and go to: `http://localhost:4200/signin`

#### 3. Test Authentication with These Credentials:

| Username | Password | Role | Expected Redirect |
|----------|----------|------|-------------------|
| `admin` | `admin` | admin | `/admin/dashboard` |
| `farouk` | `farouk` | formateur | `/formateur/dashboard` |
| `testuser` | `testuser` | user | `/user/dashboard` |

### 🔍 Debug Common Issues

#### Issue 1: CORS Errors
**Solution:** Ensure your backend is configured to accept requests from `http://localhost:4200`

#### Issue 2: "Cannot POST" Error
**Solution:** Verify Keycloak is running on `http://localhost:8080`
```bash
# Test Keycloak is running
curl http://localhost:8080/realms/my-app-realm
```

#### Issue 3: Invalid Client Configuration
**Solution:** Double-check these settings in `auth.service.ts`:
```typescript
const keycloakConfig = {
  url: 'http://localhost:8080',
  realm: 'my-app-realm',
  clientId: 'my-app-client',
  clientSecret: 'J8cChqYP81yh9WPSy9UEKkWy85CLj7Bu'
};
```

### ✅ Verify Your Setup

Run this test to verify everything is working:
```bash
cd C:\Users\m2l3k\Desktop\gestion-user
node test-frontend-auth.js
```

Expected output:
```
✅ admin - Authentication successful with role: admin
✅ farouk - Authentication successful with role: formateur  
✅ testuser - Authentication successful with role: user
```

### 🎯 Features You'll Have After Integration

✅ **Secure Login** at `http://localhost:4200/signin`
✅ **Role-Based Redirection** to appropriate dashboards
✅ **JWT Token Management** with automatic expiration handling
✅ **Protected Routes** that require authentication
✅ **User Session Persistence** across page refreshes
✅ **Error Handling** with user-friendly messages
✅ **Modern Responsive Design**

### 📱 Next Steps

1. **Customize the UI** to match your SkillUp branding
2. **Add loading states** and animations
3. **Implement password reset** functionality
4. **Add user profile** management
5. **Create role-specific** dashboard components

---

**🚀 Your authentication system is ready to integrate!**
**📍 Login URL:** `http://localhost:4200/signin`
**🔑 Test with:** admin/admin, farouk/farouk, or testuser/testuser