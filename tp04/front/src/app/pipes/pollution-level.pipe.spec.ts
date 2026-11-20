import { PollutionLevelPipe } from './pollution-level.pipe';

describe('PollutionLevelPipe', () => {
  const pipe = new PollutionLevelPipe();

  it('retourne Faible de 0 à 20', () => {
    expect(pipe.transform(0)).toBe('Faible');
    expect(pipe.transform(20)).toBe('Faible');
  });

  it('retourne Modérée de 21 à 50', () => {
    expect(pipe.transform(21)).toBe('Modérée');
    expect(pipe.transform(50)).toBe('Modérée');
  });

  it('retourne Élevée de 51 à 100', () => {
    expect(pipe.transform(51)).toBe('Élevée');
    expect(pipe.transform(100)).toBe('Élevée');
  });

  it('retourne Dangereuse à partir de 101', () => {
    expect(pipe.transform(101)).toBe('Dangereuse');
    expect(pipe.transform(500)).toBe('Dangereuse');
  });

  it('retourne une chaîne vide sans indice', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
