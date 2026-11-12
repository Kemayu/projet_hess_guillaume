import { Directive, computed, input } from '@angular/core';
import { getPollutionLevel, PollutionLevel } from '../pipes/pollution-level.pipe';

const LEVEL_COLORS: Record<PollutionLevel, string> = {
  Faible: '#c8f0c8',     // vert clair
  Modérée: '#fff176',    // jaune
  Élevée: '#ffb74d',     // orange
  Dangereuse: '#ef9a9a'  // rouge
};

@Directive({
  selector: '[appHighlightPollution]',
  standalone: true,
  host: {
    '[style.backgroundColor]': 'backgroundColor()'
  }
})
export class HighlightPollutionDirective {
  readonly appHighlightPollution = input<number | null | undefined>();

  readonly backgroundColor = computed(() => {
    const dangerIndex = this.appHighlightPollution();
    if (dangerIndex === null || dangerIndex === undefined || !Number.isFinite(Number(dangerIndex))) {
      return null;
    }
    return LEVEL_COLORS[getPollutionLevel(Number(dangerIndex))];
  });
}
