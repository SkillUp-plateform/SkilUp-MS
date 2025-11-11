import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthAdminService } from '../auth-admin-service.service';

@Component({
  selector: 'app-signin-admin',
  templateUrl: './signin-admin.component.html',
  styleUrls: ['./signin-admin.component.css']
})
export class SigninAdminComponent {

  forminput!: FormGroup;
  username: string = "";
  password: string = "";
  loginError: string = ""; // Ajoutez cette propriété

  constructor(private router: Router, private formBuilder: FormBuilder,private authAdminService: AuthAdminService) {}

  ngOnInit(): void {
    this.forminput = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  signIn() {
    if (this.forminput.valid) {
      const { username, password } = this.forminput.value;

      this.authAdminService.login(username, password).subscribe({
        next: (admin) => {
          this.authAdminService.storeUser(admin);
          this.router.navigate(['/dashbordAdmin']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.loginError = "Échec de la connexion. Veuillez vérifier vos identifiants."; // Définir le message d'erreur
        }
      });
    }
  }
}
