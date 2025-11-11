import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CandidatureResponse, CandidatureStatus } from './models/candidature.model';

@Injectable({
  providedIn: 'root'
})
export class RecrutementService {
  private apiUrl = 'http://localhost:9095/candidatures';

  constructor(private http: HttpClient) {}

  // Soumission JSON (sans CV)
  submit(userId: number, motivation?: string): Observable<CandidatureResponse> {
    const body = { userId, motivation };
    return this.http.post<CandidatureResponse>(`${this.apiUrl}`, body);
  }

  // Soumission multipart (avec CV optionnel)
  submitWithCv(userId: number, motivation?: string, file?: File): Observable<CandidatureResponse> {
    const form = new FormData();
    form.append('userId', String(userId));
    if (motivation) form.append('motivation', motivation);
    if (file) form.append('cv', file); // côté backend: accepte 'cv' ou 'cvPath', on standardise 'cv'
    return this.http.post<CandidatureResponse>(`${this.apiUrl}`, form);
  }

  approve(id: number): Observable<CandidatureResponse> {
    return this.http.post<CandidatureResponse>(`${this.apiUrl}/${id}/approve`, {});
  }

  reject(id: number): Observable<CandidatureResponse> {
    return this.http.post<CandidatureResponse>(`${this.apiUrl}/${id}/reject`, {});
  }

  get(id: number): Observable<CandidatureResponse> {
    return this.http.get<CandidatureResponse>(`${this.apiUrl}/${id}`);
  }

  list(status?: CandidatureStatus): Observable<CandidatureResponse[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<CandidatureResponse[]>(`${this.apiUrl}`, { params });
  }

  downloadCv(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/cv`, { responseType: 'blob' });
  }
}