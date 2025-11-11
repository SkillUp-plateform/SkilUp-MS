import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageFormateurService {
  private baseUrl = 'http://localhost:9094/imageFormateur'; // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) { }
  uploadImage(image: File, idFormateur: number): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('imageFile', image);

    return this.http.post<string>(`${this.baseUrl}/upload/${idFormateur}`, formData);
  }

  getImageByUserId(idFormateur: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get/${idFormateur}`);
  }

  updateImage(image: File, idFormateur: number): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('imageFile', image);

    return this.http.put<string>(`${this.baseUrl}/update/${idFormateur}`, formData);
  }

  deleteImage(idFormateur: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/delete/${idFormateur}`);
  }
}
