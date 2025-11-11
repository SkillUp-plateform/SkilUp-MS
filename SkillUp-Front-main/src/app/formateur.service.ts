import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formateur } from './models/formateur.model'

@Injectable({
  providedIn: 'root'
})
export class FormateurService {

  constructor( private httpClient: HttpClient) { }

  private apiUrl="http://localhost:9094/formateur/"

  getAllFormateur():Observable<Formateur[]> {
    return this.httpClient.get<Formateur[]>(this.apiUrl+"getAllFormateur")
  }

  addFormateur(formateur:Formateur): Observable <Formateur> {
    return this.httpClient.post<Formateur>(this.apiUrl+"addFormateur",formateur)
  }

  updateFormateur(id:number,formateur:Formateur):Observable<Formateur>{
    return this.httpClient.put<Formateur>(this.apiUrl+"updateFormateur/"+id,formateur);
  }

  deleteFormateur(id:number) : Observable<void>
  {
    return this.httpClient.delete<void>(this.apiUrl+"deleteFormateur/"+id)
  }

  getFormateurById(id:Number):Observable<Formateur>{
    return this.httpClient.get<Formateur>(this.apiUrl+"getFormateurById/"+id);
  }
}
