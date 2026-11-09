import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, Subject, startWith, switchMap } from 'rxjs';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { UserPayload } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [UserFormComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  private readonly service = inject(UserService);
  private readonly refresh$ = new Subject<void>();
  readonly message = signal('');
  readonly users = toSignal(
    this.refresh$.pipe(
      startWith(void 0),
      switchMap(() =>
        this.service.getAll().pipe(
          catchError(() => {
            this.message.set(
              'Impossible de récupérer les utilisateurs. Vérifiez que l’API est démarrée.'
            );
            return of([]);
          })
        )
      )
    ),
    { initialValue: [] }
  );

  create(user: UserPayload): void {
    this.service.create(user).subscribe({
      next: () => {
        this.message.set('L’utilisateur a été créé.');
        this.refresh$.next();
      },
      error: (err: HttpErrorResponse) =>
        this.message.set(err.error?.message ?? 'Impossible de créer l’utilisateur.')
    });
  }
}
