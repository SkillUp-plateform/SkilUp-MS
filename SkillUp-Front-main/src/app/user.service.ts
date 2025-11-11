import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './models/user.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private httpClient: HttpClient) { }

  // Use API Gateway instead of direct service URL
  private apiUrl = `${environment.userManagementService}/user/`;

  getAllUsers():Observable<User[]> {
    return this.httpClient.get<User[]>(this.apiUrl+"getAllUser")
  }

  addUser(user:User): Observable <User> {
    return this.httpClient.post<User>(this.apiUrl+"addUser",user)
  }

  updateUser(id:number,user:User):Observable<User>{
    return this.httpClient.put<User>(this.apiUrl+"updateUser/"+id,user);
  }

  deleteUser(id:number) : Observable<void>
  {
    //http://localhost:8080/user/deleteUser/id  
    return this.httpClient.delete<void>(this.apiUrl+"deleteUser/"+id)
  }

  getUserById(id:Number):Observable<User>{
    return this.httpClient.get<User>(this.apiUrl+"getUserById/"+id);
  }

  // Get all users with Keycloak IDs by role
  // Using direct URL to avoid CORS issues with Gateway
  getUsersByRole(role: string): Observable<any[]> {
    const directUrl = `${environment.directUrls.userManagement}/users?role=${role}`;
    console.log('Fetching users from:', directUrl);
    return this.httpClient.get<any[]>(directUrl);
  }

  // Get Keycloak ID by username
  getKeycloakIdByUsername(username: string, role: string = 'user'): Observable<string | null> {
    return new Observable(observer => {
      this.getUsersByRole(role).subscribe(
        (users: any[]) => {
          console.log('📋 All users received:', users);
          console.log('🔍 Looking for username:', username);
          
          const user = users.find(u => u.username === username);
          console.log('👤 Found user:', user);
          
          // The Keycloak UUID is in the 'id' property
          if (user && user.id) {
            console.log('✅ Keycloak ID found:', user.id);
            observer.next(user.id);
          } else {
            console.error('❌ No id property found. User object keys:', user ? Object.keys(user) : 'user is null');
            observer.next(null);
          }
          observer.complete();
        },
        error => {
          console.error('❌ Error fetching users:', error);
          observer.error(error);
        }
      );
    });
  }
}
