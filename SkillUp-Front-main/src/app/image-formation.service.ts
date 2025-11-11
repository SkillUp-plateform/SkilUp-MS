import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageFormationService {
  private baseUrl = 'http://localhost:9094/Formation/imageFormation'; // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) { }
  uploadImage(image: File, idFormation: number): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('imageFile', image);

    return this.http.post<string>(`${this.baseUrl}/upload/${idFormation}`, formData);
  }

  getImageByUserId(idFormation: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get/${idFormation}`);
  }

  updateImage(image: File, idFormation: number): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('imageFile', image);

    return this.http.put<string>(`${this.baseUrl}/update/${idFormation}`, formData);
  }

  deleteImage(idFormation: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/delete/${idFormation}`);
  }
}
