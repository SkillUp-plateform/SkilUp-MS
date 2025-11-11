// src/app/email.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { send, init } from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private serviceID = 'default_service'; // Remplacez par votre ID de service EmailJS
  private templateID = 'template_b2zooqm'; // Remplacez par votre ID de modèle EmailJS
  private userID = 'gR317H4oQY3EhCTzc'; // Remplacez par votre ID utilisateur EmailJS

  constructor() {
    init(this.userID);
  }

  sendEmail(to_name: string, message: string, reply_to: string): Observable<any> {
    const templateParams = {
      to_name: to_name,
      message: message,
      reply_to: reply_to,
    };

    return new Observable(observer => {
      send(this.serviceID, this.templateID, templateParams)
        .then(response => {
          observer.next(response);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
}
