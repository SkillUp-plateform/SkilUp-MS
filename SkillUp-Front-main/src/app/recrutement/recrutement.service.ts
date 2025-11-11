import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CandidatureResponse, CandidatureStatus } from '../models/candidature.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecrutementService {
  // Use API Gateway instead of direct service URL
  private baseUrl = `${environment.recrutementService}/candidatures`;

  constructor(private http: HttpClient) {}

  // Soumission multipart avec CV (clé 'cv') - using Keycloak ID
  submitWithCvKeycloak(keycloakUserId: string, motivation?: string, cvFile?: File): Observable<CandidatureResponse> {
    const formData = new FormData();
    formData.append('keycloakFormateurId', keycloakUserId);  // Backend expects keycloakFormateurId
    if (motivation) formData.append('motivation', motivation);
    if (cvFile) formData.append('cv', cvFile, cvFile.name);

    console.log('📤 Submitting candidature with Keycloak ID:', keycloakUserId);
    return this.http.post<CandidatureResponse>(this.baseUrl, formData);
  }

  // Soumission multipart avec CV (clé 'cv') - legacy numeric userId
  submitWithCv(userId: number, motivation?: string, cvFile?: File): Observable<CandidatureResponse> {
    const formData = new FormData();
    formData.append('userId', String(userId));
    if (motivation) formData.append('motivation', motivation);
    if (cvFile) formData.append('cv', cvFile, cvFile.name);

    return this.http.post<CandidatureResponse>(this.baseUrl, formData);
  }

  // Soumission JSON sans fichier (optionnel)
  submitJson(body: { userId: number; motivation?: string }): Observable<CandidatureResponse> {
    return this.http.post<CandidatureResponse>(this.baseUrl, body);
  }

  list(status?: CandidatureStatus): Observable<CandidatureResponse[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<CandidatureResponse[]>(this.baseUrl, { params });
  }

  get(id: number): Observable<CandidatureResponse> {
    return this.http.get<CandidatureResponse>(`${this.baseUrl}/${id}`);
  }

  approve(id: number): Observable<CandidatureResponse> {
    return this.http.post<CandidatureResponse>(`${this.baseUrl}/${id}/approve`, {});
  }

  reject(id: number): Observable<CandidatureResponse> {
    return this.http.post<CandidatureResponse>(`${this.baseUrl}/${id}/reject`, {});
  }

  // Téléchargement du CV (PDF)
  downloadCv(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/cv`, { responseType: 'blob' });
  }
}