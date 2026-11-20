import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserPayload } from '../../../../core/models/user.model';
import { UserService } from '../../../../core/services/user.service';
import { UserFormComponent } from '../../components/user-form/user-form.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [UserFormComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private readonly service = inject(UserService);
  private readonly router = inject(Router);
  readonly message = signal('');

  register(user: UserPayload): void {
    this.message.set('');
    this.service.create(user).subscribe({
      // Compte créé : on envoie vers la connexion avec l'email pré-rempli
      next: ({ email }) =>
        this.router.navigate(['/auth/login'], { queryParams: { registered: true, email } }),
      error: (err: HttpErrorResponse) =>
        this.message.set(err.error?.message ?? 'Impossible de créer le compte.')
    });
  }
}
