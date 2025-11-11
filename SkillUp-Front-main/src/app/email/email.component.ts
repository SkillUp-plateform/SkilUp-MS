import { Component } from '@angular/core';
import { EmailService } from '../email.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent {
  toName: string = '';
  message: string = '';
  replyTo: string = '';
  isSidebarCollapsed = false;

  constructor(private emailService: EmailService) { }

  sendEmail() {
    this.emailService.sendEmail(this.toName, this.message, this.replyTo).subscribe({
      next: (response) => {
        this.resetForm();
      },
      error: (error) => {
        alert('Erreur lors de l\'envoi de l\'e-mail: ' + error);
      }
    });
  }

  resetForm() {
    this.toName = '';
    this.message = '';
    this.replyTo = '';
  }

  onSidebarToggle(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}
