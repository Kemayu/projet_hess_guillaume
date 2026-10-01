import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  user = {
    login: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    email: ''
  };

  submitted = false;
  passwordMismatch = false;

  onSubmit(form: NgForm): void {
    this.submitted = true;
    this.passwordMismatch = this.user.password !== this.user.confirmPassword;

    if (form.valid && !this.passwordMismatch) {
      console.log('Formulaire valide :', this.user);
      form.resetForm({
        login: '',
        password: '',
        confirmPassword: '',
        nom: '',
        prenom: '',
        email: ''
      });
      this.submitted = false;
      this.passwordMismatch = false;
    }
  }
}
