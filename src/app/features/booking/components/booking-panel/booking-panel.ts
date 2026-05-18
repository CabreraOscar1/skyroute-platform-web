import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  BookingResponse,
  FlightOffer,
  PassengerRequest,
} from '../../../../core/api/skyroute-api.models';

@Component({
  selector: 'app-booking-panel',
  imports: [CurrencyPipe, DatePipe, ReactiveFormsModule],
  templateUrl: './booking-panel.html',
  styleUrl: './booking-panel.scss',
})
export class BookingPanel {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly selectedOffer = input<FlightOffer | null>(null);
  readonly booking = input<BookingResponse | null>(null);
  readonly loading = input(false);
  readonly confirmed = output<PassengerRequest>();

  protected readonly form = this.fb.group({
    fullName: ['Ana Perez', [Validators.required, Validators.minLength(3)]],
    email: ['ana.perez@example.com', [Validators.required, Validators.email]],
    documentNumber: ['A1234567', [Validators.required]],
  });
  protected readonly documentType = computed<'National ID' | 'Passport Number'>(() => {
    const offer = this.selectedOffer();

    return offer && offer.origin.countryCode === offer.destination.countryCode
      ? 'National ID'
      : 'Passport Number';
  });
  protected readonly documentHint = computed(() =>
    this.documentType() === 'National ID'
      ? 'Solo numeros, entre 6 y 12 digitos.'
      : 'Letras y numeros, entre 6 y 12 caracteres.',
  );
  protected readonly documentPlaceholder = computed(() =>
    this.documentType() === 'National ID' ? '12345678' : 'A1234567',
  );

  private readonly documentValidatorSync = effect(() => {
    const documentPattern =
      this.documentType() === 'National ID' ? /^\d{6,12}$/ : /^[a-zA-Z0-9]{6,12}$/;
    const control = this.form.controls.documentNumber;

    control.setValidators([Validators.required, Validators.pattern(documentPattern)]);
    control.updateValueAndValidity({ emitEvent: false });
  });

  protected confirm(): void {
    if (!this.selectedOffer()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.confirmed.emit(this.form.getRawValue());
  }

  protected formatDuration(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  }
}
