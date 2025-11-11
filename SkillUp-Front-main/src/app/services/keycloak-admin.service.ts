import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface CreateKeycloakUserDto {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  temporaryPassword?: string;
  role: 'user' | 'formateur';
}

@Injectable({ providedIn: 'root' })
export class KeycloakAdminService {
  // Use API Gateway as primary, with fallback to direct URL
  private bases = [
    `${environment.userManagementService}/api/admin/keycloak`,  // Gateway first
    'http://localhost:8089/api/admin/keycloak',  // Direct Flask backend fallback
  ];

  constructor(private http: HttpClient) {}

  createUser(dto: CreateKeycloakUserDto): Observable<any> {
    return this.tryPost('/users', dto);
  }

  listUsersByRole(role: 'user' | 'formateur'): Observable<any[]> {
    const params = new HttpParams().set('role', role);
    return this.tryGet<any[]>('/users', params);
  }

  private tryPost<T>(path: string, body: any): Observable<T> {
    // Try first base, fallback to second if 404
    return this.http.post<T>(`${this.bases[0]}${path}`, body).pipe(
      catchError(err => {
        if (err?.status === 404) {
          return this.http.post<T>(`${this.bases[1]}${path}`, body);
        }
        return throwError(() => err);
      })
    );
  }

  private tryGet<T>(path: string, params: HttpParams): Observable<T> {
    // Try GET across all bases; if 404/0 move to next; if 405 (method not allowed), try POST with role in body
    const tryIndex = (i: number): Observable<T> => {
      if (i >= this.bases.length) {
        return throwError(() => ({ message: 'All bases failed' }));
      }
      const url = `${this.bases[i]}${path}`;
      return this.http.get<T>(url, { params }).pipe(
        catchError(err => {
          if (err?.status === 404 || err?.status === 0) {
            return tryIndex(i + 1);
          }
          if (err?.status === 405) {
            // Some backends expect POST for listing
            const role = params.get('role') || '';
            return this.http.post<T>(url, { role }).pipe(
              catchError(() => tryIndex(i + 1))
            );
          }
          return throwError(() => err);
        })
      );
    };
    return tryIndex(0);
  }
}
