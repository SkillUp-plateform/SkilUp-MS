import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from './models/payment.model'; // Assure-toi que le chemin est correct

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = 'http://localhost:9094/api/payments'; // URL du backend

  constructor(private http: HttpClient) {}

  // Créer un paiement
  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(`${this.baseUrl}/add`, payment);
  }

  // Obtenir un paiement par ID
  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/getPaymentById/${id}`);
  }

  // Obtenir tous les paiements
  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/getAllPayments`);
  }

  // Supprimer un paiement par ID
  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deletePayment/${id}`);
  }
}
