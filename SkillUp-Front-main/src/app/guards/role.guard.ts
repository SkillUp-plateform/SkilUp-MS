import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkUserRole(route);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkUserRole(childRoute);
  }

  private checkUserRole(route: ActivatedRouteSnapshot): Observable<boolean> {
    const requiredRoles = route.data['roles'] as Array<string>;
    
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          this.router.navigate(['/signin'], { queryParams: { returnUrl: this.router.url } });
          return false;
        }

        // Check if user has any of the required roles
        const hasRequiredRole = requiredRoles.some(role => 
          user.roles.includes(role)
        );

        if (hasRequiredRole) {
          return true;
        }

        // If no specific role is required but user is authenticated
        if (requiredRoles.length === 0) {
          return true;
        }

        // User doesn't have required role
        this.router.navigate(['/unauthorized']);
        return false;
      }),
      catchError(() => {
        this.router.navigate(['/signin']);
        return of(false);
      })
    );
  }
}