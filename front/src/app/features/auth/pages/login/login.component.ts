import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  readonly message = signal('');
  readonly loading = signal(false);
  // Affiché quand on arrive depuis la page d'inscription
  readonly registered = this.route.snapshot.queryParamMap.has('registered');

  readonly form = this.formBuilder.nonNullable.group({
    email: [this.route.snapshot.queryParamMap.get('email') ?? '', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  get emailControl() { return this.form.controls.email; }
  get passwordControl() { return this.form.controls.password; }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.message.set('');
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        // Retour à la page demandée avant la connexion, sinon à l'accueil
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/pollutions';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.message.set(err.error?.message ?? 'Impossible de se connecter.');
      }
    });
  }
}
