import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PollutionDeclaration } from '../../models/pollution-declaration.model';

@Component({
  selector: 'app-pollution-recap',
  standalone: true,
  templateUrl: './pollution-recap.component.html',
  styleUrl: './pollution-recap.component.css'
})
export class PollutionRecapComponent {
  @Input({ required: true }) declaration!: PollutionDeclaration;
  @Output() restart = new EventEmitter<void>();
}