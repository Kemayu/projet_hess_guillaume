import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HighlightPollutionDirective } from '../../../../shared/directives/highlight-pollution.directive';
import { PollutionDeclaration } from '../../models/pollution-declaration.model';
import { PollutionLevelPipe } from '../../../../shared/pipes/pollution-level.pipe';
import { openStreetMapUrl } from '../../../../shared/utils/open-street-map';

// Fiche en lecture seule d'une pollution
@Component({
  selector: 'app-pollution-recap',
  standalone: true,
  imports: [PollutionLevelPipe, HighlightPollutionDirective],
  templateUrl: './pollution-recap.component.html',
  styleUrl: './pollution-recap.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PollutionRecapComponent {
  @Input({ required: true }) declaration!: PollutionDeclaration;
  readonly mapUrl = openStreetMapUrl;
}
