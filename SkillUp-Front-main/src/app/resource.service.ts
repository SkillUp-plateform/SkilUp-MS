import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resource } from './models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private apiUrl = 'http://localhost:9094/resource'; // URL de l'API Spring Boot

  constructor(private http: HttpClient) { }

  // Upload a resource for a formation
  uploadResource(formationId: number, file: File): Observable<Resource> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Resource>(`${this.apiUrl}/upload/formation/${formationId}`, formData);
  }

  // Update a resource
  updateResource(id: number, file: File): Observable<Resource> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put<Resource>(`${this.apiUrl}/update/${id}`, formData);
  }

  // Delete a resource
  deleteResource(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  // Get a resource by ID
  getResourceById(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/get/${id}`, { responseType: 'blob' });
  }

  // Get all resources for a formation
  getResourcesByFormationId(formationId: number): Observable<Resource[]> {
    return this.http.get<Resource[]>(`${this.apiUrl}/formation/${formationId}`);
  }

  // Get all resources
  getAllResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(`${this.apiUrl}/all`);
  }
}