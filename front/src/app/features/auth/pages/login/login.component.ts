import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { Login } from '../../../../core/states/auth/auth.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  readonly message = signal('');
  readonly loading = signal(false);
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

    const { email } = this.form.getRawValue();
    this.store.dispatch(new Login({ email, nom: email.split('@')[0] }));

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/pollutions';
    this.router.navigateByUrl(returnUrl);
  }
}
