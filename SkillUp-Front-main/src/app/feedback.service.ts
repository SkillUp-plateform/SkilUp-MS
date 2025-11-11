import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback } from './models/feedback.model'; // Adjust the import path
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  // Use API Gateway instead of direct service URL
  private apiUrl = `${environment.feedbackService}/feedback`;

  constructor(private http: HttpClient) { }

  // Add a new feedback
  addFeedback(feedback: Feedback, keycloakUserId: string): Observable<Feedback> {
    return this.http.post<Feedback>(`${this.apiUrl}/addFeedback/user/${keycloakUserId}`, feedback);
  }

  // Delete feedback by ID
  deleteFeedback(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteFeedback/${id}`);
  }

  // Get feedback by ID
  getFeedbackById(id: number): Observable<Feedback> {
    return this.http.get<Feedback>(`${this.apiUrl}/getFeedbackById/${id}`);
  }

  // Get all feedbacks
  getAllFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/getAllFeedbacks`);
  }

  // Get feedbacks by user ID
  getFeedbacksByUserId(userId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/getFeedbacksByUserId/${userId}`);
  }
}
