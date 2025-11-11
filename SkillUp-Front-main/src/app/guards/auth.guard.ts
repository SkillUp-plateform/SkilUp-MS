import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    // If no tokens, redirect to login
    if (!accessToken || !refreshToken) {
      return of(this.redirectToLogin());
    }

    const tokenData = this.authService.decodeToken(accessToken);
    const currentTime = Math.floor(Date.now() / 1000);

    // If token is expired, try to refresh it
    if (tokenData.exp && tokenData.exp <= currentTime) {
      return this.authService.refreshToken().pipe(
        switchMap(success => {
          if (success) {
            return of(true);
          }
          return of(this.redirectToLogin(true));
        }),
        catchError(() => of(this.redirectToLogin(true)))
      );
    }

    // If token is valid but about to expire soon, refresh it
    if (tokenData.exp && (tokenData.exp - currentTime) < 300) { // 5 minutes
      return this.authService.refreshToken().pipe(
        switchMap(success => of(success)),
        catchError(() => of(this.redirectToLogin(true)))
      );
    }

    // Token is valid and not about to expire
    return of(true);
  }

  private redirectToLogin(sessionExpired = false): UrlTree {
    return this.router.createUrlTree(['/signin'], {
      queryParams: { 
        returnUrl: this.router.url,
        ...(sessionExpired && { sessionExpired: 'true' })
      }
    });
  }
}