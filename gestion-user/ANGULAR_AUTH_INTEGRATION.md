# Angular Authentication Integration for SkillUp Frontend

## Complete Authentication System for `http://localhost:4200/signin`

### 🔧 Backend Configuration (Already Working)
- **Keycloak URL:** `http://localhost:8080`
- **Realm:** `my-app-realm`
- **Client ID:** `my-app-client`
- **Client Secret:** `J8cChqYP81yh9WPSy9UEKkWy85CLj7Bu`

### ✅ Test Credentials Available
- **Admin:** admin/admin → Redirects to `/admin/dashboard`
- **Formateur:** farouk/farouk → Redirects to `/formateur/dashboard`
- **User:** testuser/testuser → Redirects to `/user/dashboard`

## 📁 Files to Create in Your Angular Project

### 1. Authentication Service (`src/app/services/auth.service.ts`)

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
  clientSecret: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

interface UserInfo {
  username: string;
  email: string;
  fullName: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly keycloakConfig: KeycloakConfig = {
    url: 'http://localhost:8080',
    realm: 'my-app-realm',
    clientId: 'my-app-client',
    clientSecret: 'J8cChqYP81yh9WPSy9UEKkWy85CLj7Bu'
  };

  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkExistingAuth();
  }

  login(username: string, password: string): Observable<UserInfo> {
    const tokenUrl = `${this.keycloakConfig.url}/realms/${this.keycloakConfig.realm}/protocol/openid-connect/token`;
    
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('client_id', this.keycloakConfig.clientId);
    formData.append('client_secret', this.keycloakConfig.clientSecret);
    formData.append('grant_type', 'password');

    return this.http.post<AuthResponse>(tokenUrl, formData.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(
      map(response => this.processAuthResponse(response)),
      tap(userInfo => {
        this.currentUserSubject.next(userInfo);
        this.isAuthenticatedSubject.next(true);
        this.storeAuthData(userInfo);
      })
    );
  }

  private processAuthResponse(response: AuthResponse): UserInfo {
    // Store tokens
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    
    // Decode token to get user info
    const userInfo = this.decodeToken(response.access_token);
    
    return {
      username: userInfo.preferred_username,
      email: userInfo.email,
      fullName: userInfo.name || userInfo.preferred_username,
      roles: userInfo.realm_access?.roles || []
    };
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return {};
    }
  }

  private storeAuthData(userInfo: UserInfo): void {
    localStorage.setItem('currentUser', JSON.stringify(userInfo));
  }

  private checkExistingAuth(): void {
    const currentUser = localStorage.getItem('currentUser');
    const accessToken = localStorage.getItem('access_token');
    
    if (currentUser && accessToken) {
      const userInfo = JSON.parse(currentUser);
      
      // Check if token is expired
      const tokenData = this.decodeToken(accessToken);
      const currentTime = Date.now() / 1000;
      
      if (tokenData.exp && tokenData.exp > currentTime) {
        this.currentUserSubject.next(userInfo);
        this.isAuthenticatedSubject.next(true);
      } else {
        this.logout();
      }
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/signin']);
  }

  getCurrentUser(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.roles.includes(role) : false;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isFormateur(): boolean {
    return this.hasRole('formateur');
  }

  isUser(): boolean {
    return this.hasRole('user') || this.hasRole('default-roles-my-app-realm');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
```

### 2. Sign-In Component (`src/app/sign-in/sign-in.component.ts`)

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (userInfo) => {
        this.loading = false;
        this.redirectBasedOnRole(userInfo);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.error_description || 'Invalid username or password';
      }
    });
  }

  private redirectBasedOnRole(userInfo: any): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    } else if (this.authService.isFormateur()) {
      this.router.navigate(['/formateur/dashboard']);
    } else if (this.authService.isUser()) {
      this.router.navigate(['/user/dashboard']);
    } else {
      this.error = 'No valid role assigned to this user';
      this.authService.logout();
    }
  }
}
```

### 3. Sign-In Template (`src/app/sign-in/sign-in.component.html`)

```html
<div class="signin-container">
  <div class="signin-card">
    <div class="signin-header">
      <h2>SkillUp Login</h2>
      <p>Sign in to your account</p>
    </div>

    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="signin-form">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          formControlName="username"
          class="form-control"
          placeholder="Enter your username"
          [ngClass]="{ 'is-invalid': loginForm.get('username')?.errors && loginForm.get('username')?.touched }"
        />
        <div *ngIf="loginForm.get('username')?.errors && loginForm.get('username')?.touched" class="invalid-feedback">
          Username is required
        </div>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          formControlName="password"
          class="form-control"
          placeholder="Enter your password"
          [ngClass]="{ 'is-invalid': loginForm.get('password')?.errors && loginForm.get('password')?.touched }"
        />
        <div *ngIf="loginForm.get('password')?.errors && loginForm.get('password')?.touched" class="invalid-feedback">
          Password is required
        </div>
      </div>

      <div *ngIf="error" class="alert alert-danger">
        {{ error }}
      </div>

      <button type="submit" class="btn btn-primary btn-block" [disabled]="loading">
        <span *ngIf="loading" class="spinner-border spinner-border-sm mr-2"></span>
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>

    <div class="signin-footer">
      <p>Test Accounts:</p>
      <small>
        <strong>Admin:</strong> admin/admin<br>
        <strong>Formateur:</strong> farouk/farouk<br>
        <strong>User:</strong> testuser/testuser
      </small>
    </div>
  </div>
</div>
```

### 4. Sign-In Styles (`src/app/sign-in/sign-in.component.css`)

```css
.signin-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.signin-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.signin-header {
  text-align: center;
  margin-bottom: 30px;
}

.signin-header h2 {
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.signin-header p {
  color: #666;
  margin: 0;
}

.signin-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 100%;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.alert {
  padding: 12px 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 14px;
}

.alert-danger {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.signin-footer {
  text-align: center;
  border-top: 1px solid #eee;
  padding-top: 20px;
  margin-top: 20px;
}

.signin-footer p {
  margin-bottom: 10px;
  color: #666;
  font-size: 14px;
}

.signin-footer small {
  color: #999;
  line-height: 1.5;
}

.spinner-border {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
  border: 0.2em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
}

@keyframes spinner-border {
  to { transform: rotate(360deg); }
}

.mr-2 {
  margin-right: 0.5rem;
}
```

### 5. Auth Guard (`src/app/guards/auth.guard.ts`)

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true;
        } else {
          this.router.navigate(['/signin']);
          return false;
        }
      })
    );
  }
}
```

### 6. Role Guard (`src/app/guards/role.guard.ts`)

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const requiredRole = route.data['role'];
    
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          this.router.navigate(['/signin']);
          return false;
        }

        if (user.roles.includes(requiredRole)) {
          return true;
        } else {
          this.router.navigate(['/unauthorized']);
          return false;
        }
      })
    );
  }
}
```

### 7. Update App Module (`src/app/app.module.ts`)

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
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
    AppComponent,
    SignInComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [AuthService, AuthGuard, RoleGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## 🚀 Implementation Steps

1. **Copy all the code files** to your Angular project
2. **Update your app module** with the routes
3. **Create the dashboard modules** for each role
4. **Test the login** at `http://localhost:4200/signin`

## 🧪 Test the Integration

Use these test credentials:
- **Admin:** username: `admin`, password: `admin`
- **Formateur:** username: `farouk`, password: `farouk`
- **User:** username: `testuser`, password: `testuser`

## ✅ Features Implemented

✅ **Secure Authentication** with Keycloak
✅ **Role-Based Redirection** to appropriate dashboards
✅ **JWT Token Management** with automatic expiration handling
✅ **Protected Routes** with Auth and Role guards
✅ **User Session Persistence** across page refreshes
✅ **Error Handling** with user-friendly messages
✅ **Responsive Design** with modern UI

The authentication system is now ready to integrate with your Angular frontend at `localhost:4200/signin`!