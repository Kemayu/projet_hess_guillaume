export type PollutionLevel = 'Faible' | 'Modérée' | 'Élevée' | 'Dangereuse';

// Seuils de l'indice de dangerosité, partagés par PollutionLevelPipe et HighlightPollutionDirective
export const pollutionLevel = (index: number | null | undefined): PollutionLevel | '' => {
  if (index === null || index === undefined || !Number.isFinite(Number(index))) {
    return '';
  }
  const value = Number(index);
  if (value <= 20) {
    return 'Faible';
  }
  if (value <= 50) {
    return 'Modérée';
  }
  if (value <= 100) {
    return 'Élevée';
  }
  return 'Dangereuse';
};
