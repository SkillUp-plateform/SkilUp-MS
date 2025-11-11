import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFormateurService } from '../auth-formateur-service.service'; // Assurez-vous que ce chemin est correct

@Component({
  selector: 'app-signin-formateur',
  templateUrl: './signin-formateur.component.html',
  styleUrls: ['./signin-formateur.component.css']
})
export class SigninFormateurComponent {
  forminput!: FormGroup;
  username: string = "";
  password: string = "";
  loginError: string = ""; // Ajoutez cette propriété
  
  constructor(private router: Router, private formBuilder: FormBuilder,private authFormateurService: AuthFormateurService) {}

  ngOnInit(): void {
    this.forminput = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  signIn() {
    if (this.forminput.valid) {
      const { username, password } = this.forminput.value;

      this.authFormateurService.login(username, password).subscribe({
        next: (formateur) => {
          this.authFormateurService.storeUser(formateur);
          this.router.navigate(['/homeformateur']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.loginError = "Échec de la connexion. Veuillez vérifier vos identifiants."; // Définir le message d'erreur
        }
      });
    }
  }

}
