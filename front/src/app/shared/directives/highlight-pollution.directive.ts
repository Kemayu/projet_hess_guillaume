import { Directive, computed, input } from '@angular/core';
import { PollutionLevel, pollutionLevel } from '../utils/pollution-level';

const LEVEL_COLORS: Record<PollutionLevel, string> = {
  Faible: '#c8f0c8',     // vert clair
  Modérée: '#fff176',    // jaune
  Élevée: '#ffb74d',     // orange
  Dangereuse: '#ef9a9a'  // rouge
};

@Directive({
  selector: '[appHighlightPollution]',
  host: {
    '[style.backgroundColor]': 'backgroundColor()'
  }
})
export class HighlightPollutionDirective {
  readonly appHighlightPollution = input<number | null | undefined>();

  readonly backgroundColor = computed(() => {
    const level = pollutionLevel(this.appHighlightPollution());
    return level ? LEVEL_COLORS[level] : null;
  });
}
