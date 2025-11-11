import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (userInfo) => {
        this.loading = false;
        this.redirectBasedOnRole(userInfo);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.error_description || 'Invalid username or password';
      }
    });
  }

  private redirectBasedOnRole(userInfo: any): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    } else if (this.authService.isFormateur()) {
      this.router.navigate(['/formateur/home']);
    } else if (this.authService.isUser()) {
      this.router.navigate(['/user/home']);
    } else {
      this.error = 'No valid role assigned to this user. Please contact support.';
      this.authService.logout();
    }
  }
}