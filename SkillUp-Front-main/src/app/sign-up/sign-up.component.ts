import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { UserService } from '../user.service';
import { ImageUserService } from '../image-user.service';
import { KeycloakAdminService } from '../services/keycloak-admin.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  forminput!: FormGroup;
  selectedImage: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private router: Router, 
    private formBuilder: FormBuilder,
    private userService: UserService,
    private imageUserService: ImageUserService,
    private keycloakAdminService: KeycloakAdminService
  ) {}

  ngOnInit(): void {
    this.forminput = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      address: ['', [Validators.required]],
      password: ['', [Validators.required]],
      image: [null]
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.selectedImage = e.target.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  signUp() {
    if (this.forminput.valid) {
      const formData = this.forminput.value;
      
      // Create user in Keycloak with 'user' role
      const keycloakUser = {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstname,
        lastName: formData.lastname,
        temporaryPassword: formData.password,
        role: 'user' as 'user'
      };

      this.keycloakAdminService.createUser(keycloakUser).subscribe(
        (response) => {
          console.log('User created in Keycloak:', response);
          alert('Inscription réussie! Vous pouvez maintenant vous connecter.');
          
          // Also create in local service for backward compatibility
          this.userService.addUser(formData).subscribe({
            next: (newUser) => {
              if (this.selectedFile) {
                this.imageUserService.uploadImage(this.selectedFile, newUser.id).subscribe(
                  (response) => console.log('Image uploaded successfully:', response),
                  (error) => console.error('Error uploading image:', error)
                );
              }
              this.router.navigate(['/signin']);
            },
            error: (error) => {
              console.error('Error creating user in local service:', error);
              // Still navigate to signin even if local creation fails
              this.router.navigate(['/signin']);
            }
          });
        },
        (error) => {
          console.error('Failed to create user in Keycloak:', error);
          alert('Erreur lors de l\'inscription. Veuillez réessayer.');
          
          // Fallback: create only in local service
          this.userService.addUser(formData).subscribe({
            next: (newUser) => {
              if (this.selectedFile) {
                this.imageUserService.uploadImage(this.selectedFile, newUser.id).subscribe(
                  (response) => console.log('Image uploaded successfully:', response),
                  (error) => console.error('Error uploading image:', error)
                );
              }
              this.router.navigate(['/signin']);
            },
            error: (error) => {
              console.error('Erreur', error);
              alert('Erreur lors de l\'inscription. Veuillez réessayer.');
            }
          });
        }
      );
    }
  }
}
