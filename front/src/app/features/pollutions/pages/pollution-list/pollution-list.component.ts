import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, Subject, startWith, switchMap } from 'rxjs';
import { HighlightPollutionDirective } from '../../../../shared/directives/highlight-pollution.directive';
import { PollutionLevelPipe } from '../../../../shared/pipes/pollution-level.pipe';
import { AuthService } from '../../../../core/services/auth.service';
import { PollutionService } from '../../services/pollution.service';
import { openStreetMapUrl } from '../../../../shared/utils/open-street-map';

@Component({
  selector: 'app-pollution-list',
  standalone: true,
  imports: [RouterLink, PollutionLevelPipe, HighlightPollutionDirective],
  templateUrl: './pollution-list.component.html',
  styleUrl: './pollution-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PollutionListComponent {
  private readonly service = inject(PollutionService);
  private readonly refresh$ = new Subject<void>();
  readonly auth = inject(AuthService);
  readonly mapUrl = openStreetMapUrl;
  readonly search = signal('');
  readonly selectedType = signal('');
  readonly selectedLocation = signal('');
  readonly message = signal('');
  readonly pollutions = toSignal(
    this.refresh$.pipe(
      startWith(void 0),
      switchMap(() =>
        this.service.getAll().pipe(
          catchError(() => {
            this.message.set(
              'Impossible de récupérer les pollutions. Vérifiez que l’API est démarrée.'
            );
            return of([]);
          })
        )
      )
    ),
    { initialValue: [] }
  );
  readonly types = computed(() => [...new Set(this.pollutions().map(({ type }) => type))].sort());
  readonly locations = computed(() => [...new Set(this.pollutions().map(({ location }) => location))].sort());
  readonly filteredPollutions = computed(() => {
    const search = this.search().trim().toLocaleLowerCase();
    const type = this.selectedType();
    const location = this.selectedLocation();
    return this.pollutions().filter((pollution) => {
      const matchesSearch =
        !search ||
        [pollution.title, pollution.description, pollution.location, pollution.type]
          .some((value) => value.toLocaleLowerCase().includes(search));
      return matchesSearch && (!type || pollution.type === type) && (!location || pollution.location === location);
    });
  });

  remove(id: number | string | undefined, title: string): void {
    if (id === undefined || !confirm(`Supprimer définitivement « ${title} » ?`)) {
      return;
    }
    this.service.delete(String(id)).subscribe({
      next: () => {
        this.message.set('La pollution a été supprimée.');
        this.refresh$.next();
      },
      error: (err: HttpErrorResponse) =>
        this.message.set(err.error?.message ?? 'Impossible de supprimer la pollution.')
    });
  }
}
