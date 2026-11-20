import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PollutionFormComponent } from '../../components/pollution-form/pollution-form.component';
import { PollutionPayload } from '../../models/pollution-declaration.model';
import { PollutionService } from '../../services/pollution.service';

@Component({
  selector: 'app-pollution-create',
  standalone: true,
  imports: [PollutionFormComponent, RouterLink],
  templateUrl: './pollution-create.component.html',
  styleUrl: './pollution-create.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PollutionCreateComponent {
  private readonly service = inject(PollutionService);
  private readonly router = inject(Router);
  readonly message = signal('');

  create(pollution: PollutionPayload): void {
    this.message.set('');
    this.service.create(pollution).subscribe({
      // Déclaration enregistrée : on affiche directement sa fiche
      next: ({ id }) => this.router.navigate(['/pollutions', id]),
      error: (err: HttpErrorResponse) =>
        this.message.set(err.error?.message ?? 'Impossible d’ajouter la pollution.')
    });
  }
}
