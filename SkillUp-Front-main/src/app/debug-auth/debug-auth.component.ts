import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-debug-auth',
  template: `
    <div class="debug-container">
      <h2>🔍 Authentication Debug</h2>
      
      <div class="debug-info">
        <h3>Current User Info:</h3>
        <pre>{{ userInfo | json }}</pre>
      </div>
      
      <div class="debug-info">
        <h3>Token Info:</h3>
        <p><strong>Token:</strong> {{ token | slice:0:50 }}...</p>
        <p><strong>Is Authenticated:</strong> {{ isAuthenticated }}</p>
        <p><strong>Roles:</strong> {{ roles }}</p>
      </div>
      
      <div class="debug-info">
        <h3>Role Checks:</h3>
        <p><strong>Is Admin:</strong> {{ isAdmin }}</p>
        <p><strong>Is Formateur:</strong> {{ isFormateur }}</p>
        <p><strong>Is User:</strong> {{ isUser }}</p>
      </div>
      
      <div class="debug-actions">
        <button (click)="testLogin('admin', 'admin')" class="btn btn-primary">Test Admin Login</button>
        <button (click)="testLogin('farouk', 'farouk')" class="btn btn-secondary">Test Formateur Login</button>
        <button (click)="testLogin('testuser', 'testuser')" class="btn btn-info">Test User Login</button>
        <button (click)="logout()" class="btn btn-danger">Logout</button>
      </div>
      
      <div *ngIf="error" class="error-message">
        <h4>Error:</h4>
        <pre>{{ error }}</pre>
      </div>
      
      <div *ngIf="success" class="success-message">
        <h4>Success:</h4>
        <p>{{ success }}</p>
      </div>
    </div>
  `,
  styles: [`
    .debug-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
    }
    
    .debug-info {
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 15px;
      margin: 15px 0;
    }
    
    .debug-info h3 {
      margin-top: 0;
      color: #333;
    }
    
    .debug-info pre {
      background: #fff;
      border: 1px solid #ccc;
      padding: 10px;
      border-radius: 3px;
      overflow-x: auto;
    }
    
    .debug-actions {
      display: flex;
      gap: 10px;
      margin: 20px 0;
      flex-wrap: wrap;
    }
    
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }
    
    .btn-primary { background: #007bff; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-info { background: #17a2b8; color: white; }
    .btn-danger { background: #dc3545; color: white; }
    
    .btn:hover {
      opacity: 0.8;
    }
    
    .error-message {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
      padding: 15px;
      border-radius: 5px;
      margin: 15px 0;
    }
    
    .success-message {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
      padding: 15px;
      border-radius: 5px;
      margin: 15px 0;
    }
  `]
})
export class DebugAuthComponent implements OnInit {
  userInfo: any = null;
  token: string | null = null;
  isAuthenticated: boolean = false;
  roles: string[] = [];
  isAdmin: boolean = false;
  isFormateur: boolean = false;
  isUser: boolean = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCurrentAuthState();
  }

  loadCurrentAuthState() {
    this.userInfo = this.authService.getCurrentUser();
    this.token = this.authService.getToken();
    this.isAuthenticated = this.authService.isAuthenticated();
    
    if (this.userInfo) {
      this.roles = this.userInfo.roles || [];
      this.isAdmin = this.authService.isAdmin();
      this.isFormateur = this.authService.isFormateur();
      this.isUser = this.authService.isUser();
    }
  }

  async testLogin(username: string, password: string) {
    this.error = null;
    this.success = null;
    
    try {
      console.log(`Testing login for: ${username}`);
      const result = await this.authService.login(username, password).toPromise();
      
      console.log('Login result:', result);
      this.success = `Login successful for ${username}`;
      
      // Wait a moment for the auth state to update
      setTimeout(() => {
        this.loadCurrentAuthState();
        
        // Test the redirect logic
        console.log('Testing redirect logic...');
        console.log('User roles:', this.roles);
        console.log('Is Admin:', this.isAdmin);
        console.log('Is Formateur:', this.isFormateur);
        console.log('Is User:', this.isUser);
        
        // Show what would happen
        if (this.isAdmin) {
          this.success += ' - Would redirect to: /dashboard/dashboard';
        } else if (this.isFormateur) {
          this.success += ' - Would redirect to: /home-formateur/home-formateur';
        } else if (this.isUser) {
          this.success += ' - Would redirect to: /home-user/home-user';
        } else {
          this.success += ' - No valid role found';
        }
        
      }, 1000);
      
    } catch (error) {
      console.error('Login error:', error);
      this.error = `Login failed: ${error.message || error}`;
    }
  }

  logout() {
    this.authService.logout();
    this.loadCurrentAuthState();
    this.success = 'Logged out successfully';
  }
}