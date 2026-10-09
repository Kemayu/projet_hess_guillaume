import { Component } from '@angular/core';
import { PollutionDeclaration } from './models/pollution-declaration.model';
import { PollutionFormComponent } from './components/pollution-form/pollution-form.component';
import { PollutionRecapComponent } from './components/pollution-recap/pollution-recap.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PollutionFormComponent, PollutionRecapComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected submittedDeclaration: PollutionDeclaration | null = null;

  protected onDeclarationSubmitted(declaration: PollutionDeclaration): void {
    this.submittedDeclaration = declaration;
  }

  protected onRestart(): void {
    this.submittedDeclaration = null;
  }
}
