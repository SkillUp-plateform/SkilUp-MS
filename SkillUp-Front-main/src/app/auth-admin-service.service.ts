import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminService {
  private baseUrl = 'http://localhost:9094/admin';
  private currentUser: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/login`, {
      params: { username, password }
    });
  }

  storeUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUser = user;
  }

  getRole(): string | null {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user.role || null;
  }

  getCurrentUser() {
    // Assurez-vous que 'currentUser' est le bon élément du stockage local
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.router.navigate(['/signin']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('currentUser');
  }
}
