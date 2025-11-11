import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Quiz } from './models/quiz';
import { Observable } from 'rxjs';
import { Question } from './models/question';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizServiceService {

  // Use API Gateway instead of direct service URL
  private baseUrl = `${environment.quizService}/quizzes`;
  private apiUrl = `${environment.quizService}/evaluations`;
  private base1Url = `${environment.quizService}/questions`;

  constructor(private http: HttpClient) {}

  getAllQuizzesByFormation(formationId:number): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.baseUrl}/getAllQuizzes/${formationId}`);    
  }

  createQuiz(quiz: Quiz, formationId:number): Observable<Quiz> {
    return this.http.post<Quiz>(`${this.baseUrl}/create/${formationId}`, quiz);   
  }

  deleteQuiz(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteQuiz/${id}`);
  }

  getQuizById(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.baseUrl}/getQuiz/${id}`);
  }

  submitQuiz(quizId: number, answers: { [key: number]: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/quiz/${quizId}/submit`, answers);
  }

  getAllQuestionsByQuiz (quizId:number): Observable<Question[]> {  
    return this.http.get<Question[]>(`${this.base1Url}/questionByQuiz/${quizId}`);
  }
}
