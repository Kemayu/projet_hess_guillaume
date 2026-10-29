import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, Subject, startWith, switchMap } from 'rxjs';
import { PollutionFormComponent } from '../../components/pollution-form/pollution-form.component';
import { PollutionPayload } from '../../models/pollution-declaration.model';
import { PollutionService } from '../../services/pollution.service';

@Component({
  selector: 'app-pollution-list',
  standalone: true,
  imports: [PollutionFormComponent, RouterLink],
  templateUrl: './pollution-list.component.html',
  styleUrl: './pollution-list.component.css'
})
export class PollutionListComponent {
  private readonly service = inject(PollutionService);
  private readonly refresh$ = new Subject<void>();
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

  create(pollution: PollutionPayload): void {
    this.service.create(pollution).subscribe({
      next: () => {
        this.message.set('La pollution a été ajoutée.');
        this.refresh$.next();
      },
      error: () => this.message.set('Impossible d’ajouter la pollution.')
    });
  }

  remove(id: number | string | undefined): void {
    if (id === undefined) {
      return;
    }
    this.service.delete(String(id)).subscribe({
      next: () => {
        this.message.set('La pollution a été supprimée.');
        this.refresh$.next();
      },
      error: () => this.message.set('Impossible de supprimer la pollution.')
    });
  }
}
