import { Pipe, PipeTransform } from '@angular/core';

export type PollutionLevel = 'Faible' | 'Modérée' | 'Élevée' | 'Dangereuse';

// Seuils de l'indice de dangerosité, partagés avec HighlightPollutionDirective
export const getPollutionLevel = (dangerIndex: number): PollutionLevel => {
  if (dangerIndex <= 20) {
    return 'Faible';
  }
  if (dangerIndex <= 50) {
    return 'Modérée';
  }
  if (dangerIndex <= 100) {
    return 'Élevée';
  }
  return 'Dangereuse';
};

@Pipe({
  name: 'pollutionLevel',
  standalone: true
})
export class PollutionLevelPipe implements PipeTransform {
  transform(dangerIndex: number | null | undefined): PollutionLevel | '' {
    if (dangerIndex === null || dangerIndex === undefined || !Number.isFinite(Number(dangerIndex))) {
      return '';
    }
    return getPollutionLevel(Number(dangerIndex));
  }
}
