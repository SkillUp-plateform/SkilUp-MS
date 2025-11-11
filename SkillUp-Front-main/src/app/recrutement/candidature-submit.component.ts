import { Component } from '@angular/core';
import { RecrutementService } from './recrutement.service';
import { CandidatureResponse } from '../models/candidature.model';

@Component({
  selector: 'app-candidature-submit',
  templateUrl: './candidature-submit.component.html',
  styleUrls: ['./candidature-submit.component.css']
})
export class CandidatureSubmitComponent {
  userId!: number;
  motivation = '';
  cvFile?: File;

  submitting = false;
  result?: CandidatureResponse;
  error?: string;

  constructor(private recrutementService: RecrutementService) {}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.cvFile = input.files[0];
    } else {
      this.cvFile = undefined;
    }
  }

  submit(): void {
    if (!this.userId) {
      this.error = 'Veuillez saisir un userId.';
      return;
    }
    this.error = undefined;
    this.submitting = true;
    this.recrutementService
      .submitWithCv(this.userId, this.motivation, this.cvFile)
      .subscribe({
        next: (res) => {
          this.result = res;
          this.submitting = false;
        },
        error: (err) => {
          this.error = 'Échec de la soumission: ' + (err?.error?.message || err?.statusText || 'Inconnu');
          this.submitting = false;
        }
      });
  }

  downloadCv(): void {
    const result = this.result;
    if (!result || !result.id) return;

    this.recrutementService.downloadCv(result.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cv-${result.id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.error = 'Impossible de télécharger le CV.';
      }
    });
  }
}