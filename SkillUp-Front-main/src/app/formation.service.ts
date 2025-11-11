// formation.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formation } from './models/formation.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  // Use API Gateway instead of direct service URL
  private apiUrl = `${environment.formationService}/formation`;

  constructor(private http: HttpClient) { }

  // Ajouter une formation
  addFormation(formation: Formation, keycloakFormateurId: string | number): Observable<Formation> {
    return this.http.post<Formation>(`${this.apiUrl}/add/formateur/${keycloakFormateurId}`, formation);
  }

  // Mettre à jour une formation
  updateFormation(id: number, formation: Formation, keycloakFormateurId: string | number): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/update/${id}/formateur/${keycloakFormateurId}`, formation);
  }

  // Supprimer une formation
  deleteFormation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  // Obtenir une formation par ID
  getFormationById(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/get/${id}`);
  }

  // Obtenir toutes les formations
  getAllFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/all`);
  }
}
