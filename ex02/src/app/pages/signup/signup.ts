import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-signup',
  imports: [FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})

export class Signup {
  private auth = inject(Auth);

  name = '';
  email = '';
  password = '';

  message = '';
  loading = false;

  onSignup(): void {
    this.loading = true;
    this.message = '';

    this.auth.signup({
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.message = response.message;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.message = error.message;
        this.loading = false;
      }
    });
  }
}
