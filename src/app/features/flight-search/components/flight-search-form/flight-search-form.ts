import { Component, input, output, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  Airport,
  CabinClass,
  FlightSearchRequest,
} from '../../../../core/api/skyroute-api.models';
import { LanguageService } from '../../../../core/i18n/language.service';

@Component({
  selector: 'app-flight-search-form',
  imports: [ReactiveFormsModule],
  templateUrl: './flight-search-form.html',
  styleUrl: './flight-search-form.scss',
})
export class FlightSearchForm {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly defaultDepartureDate = this.formatDate(this.addDays(new Date(), 21));
  protected readonly t = inject(LanguageService).text;

  readonly airports = input<Airport[]>([]);
  readonly loading = input(false);
  readonly search = output<FlightSearchRequest>();

  protected readonly cabinClasses: CabinClass[] = ['Economy', 'Business', 'FirstClass'];
  protected readonly minDepartureDate = this.formatDate(new Date());
  protected readonly form = this.fb.group({
    origin: ['EZE', [Validators.required]],
    destination: ['MIA', [Validators.required]],
    departureDate: [this.defaultDepartureDate, [Validators.required]],
    passengerCount: [1, [Validators.required, Validators.min(1), Validators.max(9)]],
    cabinClass: ['Economy' as CabinClass, [Validators.required]],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request = this.form.getRawValue();

    if (request.origin === request.destination) {
      this.form.controls.destination.setErrors({ sameAirport: true });
      return;
    }

    this.search.emit(request);
  }

  private addDays(date: Date, days: number): Date {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
  }

  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
