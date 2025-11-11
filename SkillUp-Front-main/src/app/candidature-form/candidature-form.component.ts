import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecrutementService } from '../recrutement/recrutement.service';
import { AuthUserService } from '../auth-user-service.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-candidature-form',
  templateUrl: './candidature-form.component.html',
  styleUrls: ['./candidature-form.component.css']
})
export class CandidatureFormComponent {
  submitting = false;
  error?: string;
  success?: string;
  selectedFile?: File | null;
  keycloakUserId?: string;

  form = this.fb.group({
    motivation: ['']
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private recrutementService: RecrutementService,
    private authUserService: AuthUserService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    console.log('📋 CandidatureFormComponent loaded');
    const user = this.authUserService.getCurrentUser();
    console.log('👤 Current user:', user);
    console.log('🔐 User roles:', user?.roles);
    
    // Fetch Keycloak ID by username
    if (user?.username) {
      this.userService.getKeycloakIdByUsername(user.username, 'user').subscribe(
        (keycloakId) => {
          if (keycloakId) {
            this.keycloakUserId = keycloakId;
            console.log('✅ Keycloak ID fetched for candidature:', keycloakId);
          } else {
            console.error('❌ No Keycloak ID found for user');
            this.error = 'Impossible de récupérer votre identifiant utilisateur.';
          }
        },
        (error) => {
          console.error('❌ Error fetching Keycloak ID:', error);
          this.error = 'Erreur lors de la récupération de votre identifiant.';
        }
      );
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
  }

  submit(): void {
    if (!this.keycloakUserId) {
      this.error = 'Identifiant utilisateur non disponible. Veuillez rafraîchir la page.';
      return;
    }
    
    this.error = undefined;
    this.success = undefined;
    this.submitting = true;

    const { motivation } = this.form.value;
    this.recrutementService.submitWithCvKeycloak(this.keycloakUserId, motivation || '', this.selectedFile || undefined)
      .subscribe({
        next: () => {
          this.success = 'Votre candidature a été envoyée.';
          this.submitting = false;
          this.form.get('motivation')?.reset();
          this.selectedFile = null;
        },
        error: (err) => {
          const msg = err?.error?.message || err?.statusText || 'Inconnu';
          this.error = 'Échec de la soumission: ' + msg;
          this.submitting = false;
        }
      });
  }
}