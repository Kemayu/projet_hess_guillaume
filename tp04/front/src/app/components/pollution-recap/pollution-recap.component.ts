import { Component, Input } from '@angular/core';
import { HighlightPollutionDirective } from '../../directives/highlight-pollution.directive';
import { PollutionDeclaration } from '../../models/pollution-declaration.model';
import { PollutionLevelPipe } from '../../pipes/pollution-level.pipe';
import { openStreetMapUrl } from '../../utils/open-street-map';

// Fiche en lecture seule d'une pollution
@Component({
  selector: 'app-pollution-recap',
  standalone: true,
  imports: [PollutionLevelPipe, HighlightPollutionDirective],
  templateUrl: './pollution-recap.component.html',
  styleUrl: './pollution-recap.component.css'
})
export class PollutionRecapComponent {
  @Input({ required: true }) declaration!: PollutionDeclaration;
  readonly mapUrl = openStreetMapUrl;
}
