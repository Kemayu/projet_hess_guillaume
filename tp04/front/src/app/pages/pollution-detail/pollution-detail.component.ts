import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, combineLatest, map, of, startWith, Subject, switchMap } from 'rxjs';
import { PollutionFormComponent } from '../../components/pollution-form/pollution-form.component';
import { PollutionRecapComponent } from '../../components/pollution-recap/pollution-recap.component';
import { PollutionPayload } from '../../models/pollution-declaration.model';
import { AuthService } from '../../services/auth.service';
import { PollutionService } from '../../services/pollution.service';

@Component({
  selector: 'app-pollution-detail',
  standalone: true,
  imports: [PollutionFormComponent, PollutionRecapComponent, RouterLink],
  templateUrl: './pollution-detail.component.html',
  styleUrl: './pollution-detail.component.css'
})
export class PollutionDetailComponent {
  private readonly service = inject(PollutionService);
  private readonly route = inject(ActivatedRoute);
  private readonly refresh$ = new Subject<void>();
  readonly auth = inject(AuthService);
  // Pour revenir sur ce détail après la connexion
  readonly currentUrl = inject(Router).url;
  readonly message = signal('');
  readonly notFound = signal(false);
  readonly pollution = toSignal(
    combineLatest([
      this.route.paramMap.pipe(map((params) => params.get('id'))),
      this.refresh$.pipe(startWith(void 0))
    ]).pipe(
      switchMap(([id]) => {
        this.notFound.set(false);
        return this.service.getById(id ?? '').pipe(
          catchError(() => {
            this.notFound.set(true);
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  update(pollution: PollutionPayload): void {
    const id = this.pollution()?.id;
    if (id === undefined) {
      return;
    }
    this.service.update(String(id), pollution).subscribe({
      next: () => {
        this.message.set('La pollution a été modifiée.');
        this.refresh$.next();
      },
      error: (err: HttpErrorResponse) =>
        this.message.set(err.error?.message ?? 'Impossible de modifier la pollution.')
    });
  }
}
