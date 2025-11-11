import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Question } from './models/question';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  // Use API Gateway instead of direct service URL
  private baseUrl = `${environment.quizService}/questions`;

  constructor(private http: HttpClient) {}

  createQuestion(question: Question, quizId:number): Observable<Question> {
    return this.http.post<Question>(`${this.baseUrl}/questions/${quizId}`, question);   
  }

  deleteQuestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  getAllQuestions (): Observable<Question[]> {  
    return this.http.get<Question[]>(`${this.baseUrl}/allQuestions`);
  }

  getAllQuestionsByQuiz (quizId:number): Observable<Question[]> {  
    return this.http.get<Question[]>(`${this.baseUrl}/questionByQuiz/${quizId}`);
  }

 
}
