import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PollutionPayload, PollutionDeclaration } from '../../models/pollution-declaration.model';

@Component({
  selector: 'app-pollution-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pollution-form.component.html',
  styleUrl: './pollution-form.component.css'
})
export class PollutionFormComponent {
  @Input() initialValue: PollutionDeclaration | null = null;
  private readonly pollutionTypes = ['Plastique', 'Chimique', 'Dépôt sauvage', 'Eau', 'Air', 'Autre'];
  private readonly formBuilder = inject(FormBuilder);

  private readonly numberValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null;
    }

    return Number.isFinite(Number(control.value)) ? null : { number: true };
  };

  private readonly dateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    return Number.isNaN(Date.parse(control.value)) ? { date: true } : null;
  };

  get photoUrlControl() {
  return this.form.controls.photoUrl;
}

  private readonly imageUrlValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const value = control.value;

    // Le champ reste facultatif
    if (!value) {
      return null;
    }

    const imageUrlRegex =
      /^https?:\/\/[^\s?#]+\.(?:jpe?g|png|gif|webp|svg|bmp|avif)(?:[?#][^\s]*)?$/i;

    return imageUrlRegex.test(value)
      ? null
      : { imageUrl: true };
  };
    

  readonly form = this.formBuilder.group({
    title: ['', Validators.required],
    type: ['', Validators.required],
    description: ['', Validators.required],
    observationDate: [
      '',
      [Validators.required, this.dateValidator]
    ],
    location: ['', Validators.required],

    latitude: [
      null as number | null,
      [
        Validators.required,
        this.numberValidator,
        Validators.min(-90),
        Validators.max(90)
      ]
    ],

    longitude: [
      null as number | null,
      [
        Validators.required,
        this.numberValidator,
        Validators.min(-180),
        Validators.max(180)
      ]
    ],

    photoUrl: ['', this.imageUrlValidator]
  });
    

  @Output() submitted = new EventEmitter<PollutionPayload>();

  ngOnInit(): void {
    if (this.initialValue) {
      this.form.patchValue(this.initialValue);
    }
  }

  get types(): string[] {
    return this.pollutionTypes;
  }

  get titleControl() { return this.form.controls.title; }
  get typeControl() { return this.form.controls.type; }
  get descriptionControl() { return this.form.controls.description; }
  get observationDateControl() { return this.form.controls.observationDate; }
  get locationControl() { return this.form.controls.location; }
  get latitudeControl() { return this.form.controls.latitude; }
  get longitudeControl() { return this.form.controls.longitude; }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue() as {
      title: string;
      type: string;
      description: string;
      observationDate: string;
      location: string;
      latitude: number | null;
      longitude: number | null;
      photoUrl: string;
    };

    this.submitted.emit({
      ...raw,
      latitude: Number(raw.latitude),
      longitude: Number(raw.longitude)
    });

    this.form.reset({
      title: '',
      type: '',
      description: '',
      observationDate: '',
      location: '',
      latitude: null,
      longitude: null,
      photoUrl: ''
    });
  }
}