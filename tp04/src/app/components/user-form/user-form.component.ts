import { Component, EventEmitter, Output, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserPayload } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  readonly passwordMinLength = 8;
  private readonly formBuilder = inject(FormBuilder);

  // Vérifie que les deux mots de passe saisis sont identiques
  private readonly passwordMatchValidator: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  };

  readonly form = this.formBuilder.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(this.passwordMinLength)]],
      confirmPassword: ['', Validators.required]
    },
    { validators: this.passwordMatchValidator }
  );

  @Output() submitted = new EventEmitter<UserPayload>();

  get emailControl() { return this.form.controls.email; }
  get lastNameControl() { return this.form.controls.lastName; }
  get firstNameControl() { return this.form.controls.firstName; }
  get addressControl() { return this.form.controls.address; }
  get passwordControl() { return this.form.controls.password; }
  get confirmPasswordControl() { return this.form.controls.confirmPassword; }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitted.emit(this.form.getRawValue());
    this.form.reset();
  }
}
