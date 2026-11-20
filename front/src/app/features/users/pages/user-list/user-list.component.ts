import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  private readonly service = inject(UserService);
  readonly message = signal('');
  readonly users = toSignal(
    this.service.getAll().pipe(
      catchError(() => {
        this.message.set('Impossible de récupérer les utilisateurs. Vérifiez que l’API est démarrée.');
        return of([]);
      })
    ),
    { initialValue: [] }
  );
}
