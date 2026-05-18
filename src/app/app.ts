import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import { SkyrouteApiService } from './core/api/skyroute-api.service';
import { Airport, BookingResponse, FlightOffer } from './core/api/skyroute-api.models';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly api = inject(SkyrouteApiService);

  protected readonly airports = signal<Airport[]>([]);
  protected readonly offers = signal<FlightOffer[]>([]);
  protected readonly selectedOffer = signal<FlightOffer | null>(null);
  protected readonly booking = signal<BookingResponse | null>(null);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly hasResults = computed(() => this.offers().length > 0);

  protected loadAirports(): void {
    this.runRequest(() => {
      this.api.getAirports().subscribe({
        next: (airports) => this.airports.set(airports),
        error: (error) => this.handleError(error),
        complete: () => this.loading.set(false),
      });
    });
  }

  protected searchFlights(): void {
    this.booking.set(null);
    this.selectedOffer.set(null);

    this.runRequest(() => {
      this.api
        .searchFlights({
          origin: 'EZE',
          destination: 'MIA',
          departureDate: '2026-06-10',
          passengerCount: 2,
          cabinClass: 'Economy',
        })
        .subscribe({
          next: (response) => {
            this.offers.set(response.results);
            this.selectedOffer.set(response.results[0] ?? null);
          },
          error: (error) => this.handleError(error),
          complete: () => this.loading.set(false),
        });
    });
  }

  protected confirmBooking(): void {
    const offer = this.selectedOffer();

    if (!offer) {
      this.error.set('Search flights before confirming a booking.');
      return;
    }

    this.runRequest(() => {
      this.api
        .confirmBooking({
          offerId: offer.offerId,
          primaryPassenger: {
            fullName: 'Ana Perez',
            email: 'ana.perez@example.com',
            documentNumber: 'A1234567',
          },
        })
        .subscribe({
          next: (booking) => this.booking.set(booking),
          error: (error) => this.handleError(error),
          complete: () => this.loading.set(false),
        });
    });
  }

  protected selectOffer(offer: FlightOffer): void {
    this.selectedOffer.set(offer);
    this.booking.set(null);
  }

  private runRequest(start: () => void): void {
    this.error.set(null);
    this.loading.set(true);
    start();
  }

  private handleError(error: unknown): void {
    this.loading.set(false);
    this.error.set(error instanceof Error ? error.message : 'The backend request failed.');
  }
}
