import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
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

export interface UserInfo {
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
  
  // Getter for the current authentication state
  public get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

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
    const tokenData = this.decodeToken(response.access_token);
    
    // Extract roles from the token
    let roles: string[] = [];
    if (tokenData.realm_access && tokenData.realm_access.roles) {
      roles = tokenData.realm_access.roles;
    }
    
    // Also check for resource_access roles if needed
    if (tokenData.resource_access && tokenData.resource_access.account) {
      roles = [...roles, ...tokenData.resource_access.account.roles];
    }
    
    const userInfo: UserInfo = {
      username: tokenData.preferred_username || '',
      email: tokenData.email || '',
      fullName: tokenData.name || tokenData.preferred_username || '',
      roles: roles
    };
    
    return userInfo;
  }

  public decodeToken(token: string): any {
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
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!accessToken || !refreshToken) {
      this.logout(false);
      return;
    }

    try {
      const tokenData = this.decodeToken(accessToken);
      const currentTime = Date.now() / 1000;
      
      // If token is expired or about to expire in less than 5 minutes
      if (tokenData.exp && (tokenData.exp < currentTime || (tokenData.exp - currentTime) < 300)) {
        this.refreshToken().subscribe({
          next: (success) => {
            if (!success) {
              this.logout(true);
            }
          },
          error: () => this.logout(true)
        });
        return;
      }
      
      // If token is valid, set up the user
      if (tokenData.exp && tokenData.exp > currentTime) {
        const userInfo = this.createUserInfoFromToken(tokenData);
        this.updateAuthState(userInfo);
        
        // Schedule token refresh before it expires (5 minutes before)
        const timeUntilRefresh = (tokenData.exp - currentTime - 300) * 1000;
        if (timeUntilRefresh > 0) {
          setTimeout(() => this.refreshToken().subscribe(), timeUntilRefresh);
        }
      } else {
        this.logout(false);
      }
    } catch (error) {
      console.error('Error during token validation:', error);
      this.logout(false);
    }
  }

  private createUserInfoFromToken(tokenData: any): UserInfo {
    return {
      username: tokenData.preferred_username || '',
      email: tokenData.email || '',
      fullName: tokenData.name || tokenData.preferred_username || '',
      roles: tokenData.realm_access?.roles || []
    };
  }

  private updateAuthState(userInfo: UserInfo): void {
    this.currentUserSubject.next(userInfo);
    this.isAuthenticatedSubject.next(true);
    localStorage.setItem('currentUser', JSON.stringify(userInfo));
  }

  refreshToken(): Observable<boolean> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return of(false);
    }

    return new Observable<boolean>(observer => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        this.logout(false);
        observer.next(false);
        observer.complete();
        return;
      }

    const tokenUrl = `${this.keycloakConfig.url}/realms/${this.keycloakConfig.realm}/protocol/openid-connect/token`;
    const formData = new URLSearchParams();
    formData.append('client_id', this.keycloakConfig.clientId);
    formData.append('client_secret', this.keycloakConfig.clientSecret);
    formData.append('grant_type', 'refresh_token');
    formData.append('refresh_token', refreshToken);

      this.http.post<AuthResponse>(tokenUrl, formData.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).subscribe({
        next: (response) => {
          this.processAuthResponse(response);
          
          // Schedule next refresh
          const tokenData = this.decodeToken(response.access_token);
          const currentTime = Date.now() / 1000;
          const timeUntilExpiry = (tokenData.exp - currentTime - 300) * 1000; // 5 minutes before expiration
          if (timeUntilExpiry > 0) {
            setTimeout(() => this.refreshToken().subscribe(), timeUntilExpiry);
          }
          observer.next(true);
          observer.complete();
        },
        error: (error) => {
          console.error('Failed to refresh token:', error);
          this.logout(false);
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  logout(showMessage: boolean = true): void {
    // Clear all auth data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('currentUser');
    
    // Update observables
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    
    // Navigate to signin page if showMessage is true
    if (showMessage) {
      this.router.navigate(['/signin'], {
        queryParams: { sessionExpired: true }
      });
    }
  }

  getCurrentUser(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.roles.includes(role) : false;
  }

  isAdmin(): boolean {
    return this.hasRole('admin') || this.hasRole('ADMIN') || this.hasRole('ROLE_ADMIN');
  }

  isFormateur(): boolean {
    return this.hasRole('formateur') || this.hasRole('FORMATEUR') || this.hasRole('ROLE_FORMATEUR');
  }

  isUser(): boolean {
    return this.hasRole('user') || this.hasRole('USER') || this.hasRole('ROLE_USER') || this.hasRole('default-roles-my-app-realm');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }
}