import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Formateur } from '../models/formateur.model';
import { FormateurService } from '../formateur.service';
import { ImageFormateurService } from '../image-formateur.service';

@Component({
  selector: 'app-signup-for',
  templateUrl: './signup-for.component.html',
  styleUrls: ['./signup-for.component.css']
})
export class SignupForComponent {
  forminput!: FormGroup;
  selectedImage: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private router: Router, 
    private formBuilder: FormBuilder,
    private formateurService: FormateurService,
    private imageFormateurService: ImageFormateurService
  ) {}

  ngOnInit(): void {
    this.forminput = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      speciality: ['',[Validators.required]],
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
      this.formateurService.addFormateur(this.forminput.value).subscribe({
        next: (newUser) => {
          if (this.selectedFile && typeof newUser.id === 'number') {
            this.imageFormateurService.uploadImage(this.selectedFile, newUser.id).subscribe(
              (response) => console.log('Image uploaded successfully:', response),
              (error) => console.error('Error uploading image:', error)
            );
          }
          this.router.navigate(['/signinFor']);
        },
        error: (error) => {
          console.error("Erreur", error);
        }
      });
    }
  }
}
