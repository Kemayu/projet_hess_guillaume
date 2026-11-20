import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HighlightPollutionDirective } from './highlight-pollution.directive';

@Component({
  standalone: true,
  imports: [HighlightPollutionDirective],
  template: `<span [appHighlightPollution]="dangerIndex()">test</span>`
})
class HostComponent {
  readonly dangerIndex = signal<number | null>(null);
}

describe('HighlightPollutionDirective', () => {
  const backgroundFor = (dangerIndex: number | null): string => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.dangerIndex.set(dangerIndex);
    fixture.detectChanges();
    return (fixture.nativeElement.querySelector('span') as HTMLElement).style.backgroundColor;
  };

  it('applique vert clair si Faible', () => {
    expect(backgroundFor(10)).toBe('rgb(200, 240, 200)');
  });

  it('applique jaune si Modérée', () => {
    expect(backgroundFor(30)).toBe('rgb(255, 241, 118)');
  });

  it('applique orange si Élevée', () => {
    expect(backgroundFor(80)).toBe('rgb(255, 183, 77)');
  });

  it('applique rouge si Dangereuse', () => {
    expect(backgroundFor(150)).toBe('rgb(239, 154, 154)');
  });

  it("n'applique pas de fond sans indice", () => {
    expect(backgroundFor(null)).toBe('');
  });
});
