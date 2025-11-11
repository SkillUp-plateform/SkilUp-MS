import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Reclamation {
  id?: number;
  keycloakUserId?: string;
  title: string;
  description: string;
  status: string; // "OPEN", "IN_PROGRESS", "CLOSED"
}

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  // Use API Gateway instead of direct service URL
  private apiUrl = `${environment.reclamationService}/api/reclamations`;

  constructor(private http: HttpClient) { }

  /**
   * Create a new reclamation for a specific user
   * @param keycloakUserId - Keycloak user ID (with 'user' role)
   * @param reclamation - Reclamation data
   */
  createReclamation(keycloakUserId: string, reclamation: Reclamation): Observable<Reclamation> {
    return this.http.post<Reclamation>(`${this.apiUrl}/user/${keycloakUserId}`, reclamation);
  }

  /**
   * Get all reclamations
   */
  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.apiUrl);
  }

  /**
   * Get reclamation by ID
   * @param id - Reclamation ID
   */
  getReclamationById(id: number): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get all reclamations for a specific user
   * @param keycloakUserId - Keycloak user ID
   */
  getReclamationsByUserId(keycloakUserId: string): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.apiUrl}/user/${keycloakUserId}`);
  }

  /**
   * Update a reclamation
   * @param id - Reclamation ID
   * @param reclamation - Updated reclamation data
   */
  updateReclamation(id: number, reclamation: Reclamation): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.apiUrl}/${id}`, reclamation);
  }

  /**
   * Delete a reclamation
   * @param id - Reclamation ID
   */
  deleteReclamation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
