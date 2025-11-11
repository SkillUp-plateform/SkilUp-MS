import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImageUser } from './models/imageUser.model';

@Injectable({
  providedIn: 'root'
})
export class ImageUserService {

  private baseUrl = 'http://localhost:9094/imageUser'; // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) { }

  uploadImage(image: File, idUser: number): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('imageFile', image);

    return this.http.post<string>(`${this.baseUrl}/upload/${idUser}`, formData);
  }
  
  getImageByUserId(idUser: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get/${idUser}`);
  }
  
  

  updateImage(image: File, idUser: number): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('imageFile', image);

    return this.http.put<string>(`${this.baseUrl}/update/${idUser}`, formData);
  }

  deleteImage(idUser: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/delete/${idUser}`);
  }
}
