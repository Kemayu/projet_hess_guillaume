import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { PollutionFormComponent } from '../../components/pollution-form/pollution-form.component';
import { PollutionPayload } from '../../models/pollution-declaration.model';
import { PollutionService } from '../../services/pollution.service';

@Component({
  selector: 'app-pollution-detail',
  standalone: true,
  imports: [PollutionFormComponent, RouterLink],
  templateUrl: './pollution-detail.component.html',
  styleUrl: './pollution-detail.component.css'
})
export class PollutionDetailComponent {
  private readonly service = inject(PollutionService);
  private readonly route = inject(ActivatedRoute);
  readonly message = signal('');
  readonly pollution = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('id')),
      switchMap((id) => this.service.getById(id ?? ''))
    ),
    { initialValue: null }
  );

  update(pollution: PollutionPayload): void {
    const id = this.pollution()?.id;
    if (id === undefined) {
      return;
    }
    this.service.update(String(id), pollution).subscribe({
      next: () => this.message.set('La pollution a été modifiée.'),
      error: () => this.message.set('Impossible de modifier la pollution.')
    });
  }
}
