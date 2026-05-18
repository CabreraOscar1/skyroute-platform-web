import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';

import {
  Airport,
  BookingResponse,
  FlightOffer,
  FlightSearchRequest,
  PassengerRequest,
} from '../../../../core/api/skyroute-api.models';
import { SkyrouteApiService } from '../../../../core/api/skyroute-api.service';
import { BookingPanel } from '../../../booking/components/booking-panel/booking-panel';
import { FlightResultsList } from '../../components/flight-results-list/flight-results-list';
import { FlightSearchForm } from '../../components/flight-search-form/flight-search-form';

@Component({
  selector: 'app-flight-search-page',
  imports: [BookingPanel, FlightResultsList, FlightSearchForm],
  templateUrl: './flight-search-page.html',
  styleUrl: './flight-search-page.scss',
})
export class FlightSearchPage implements OnInit {
  private readonly api = inject(SkyrouteApiService);

  protected readonly airports = signal<Airport[]>([]);
  protected readonly offers = signal<FlightOffer[]>([]);
  protected readonly selectedOffer = signal<FlightOffer | null>(null);
  protected readonly booking = signal<BookingResponse | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly hasSearched = signal(false);
  protected readonly loadingAirports = signal(false);
  protected readonly searching = signal(false);
  protected readonly bookingInProgress = signal(false);

  protected readonly isBusy = computed(
    () => this.loadingAirports() || this.searching() || this.bookingInProgress(),
  );

  ngOnInit(): void {
    this.loadAirports();
  }

  protected searchFlights(request: FlightSearchRequest): void {
    this.error.set(null);
    this.booking.set(null);
    this.selectedOffer.set(null);
    this.offers.set([]);
    this.hasSearched.set(true);
    this.searching.set(true);

    this.api
      .searchFlights(request)
      .pipe(finalize(() => this.searching.set(false)))
      .subscribe({
        next: (response) => {
          this.offers.set(response.results);
          this.selectedOffer.set(response.results[0] ?? null);
        },
        error: (error) => this.setError(error, 'No pudimos buscar vuelos.'),
      });
  }

  protected selectOffer(offer: FlightOffer): void {
    this.selectedOffer.set(offer);
    this.booking.set(null);
  }

  protected confirmBooking(primaryPassenger: PassengerRequest): void {
    const offer = this.selectedOffer();

    if (!offer) {
      this.error.set('Selecciona una oferta antes de reservar.');
      return;
    }

    this.error.set(null);
    this.bookingInProgress.set(true);

    this.api
      .confirmBooking({
        offerId: offer.offerId,
        primaryPassenger,
      })
      .pipe(finalize(() => this.bookingInProgress.set(false)))
      .subscribe({
        next: (booking) => this.booking.set(booking),
        error: (error) => this.setError(error, 'No pudimos confirmar la reserva.'),
      });
  }

  private loadAirports(): void {
    this.loadingAirports.set(true);

    this.api
      .getAirports()
      .pipe(finalize(() => this.loadingAirports.set(false)))
      .subscribe({
        next: (airports) => this.airports.set(airports),
        error: (error) => this.setError(error, 'No pudimos cargar los aeropuertos.'),
      });
  }

  private setError(error: unknown, fallbackMessage: string): void {
    if (error instanceof HttpErrorResponse) {
      const backendMessage =
        typeof error.error === 'string'
          ? error.error
          : (error.error as { message?: string } | null)?.message;

      this.error.set(backendMessage ?? `${fallbackMessage} Codigo ${error.status}.`);
      return;
    }

    this.error.set(fallbackMessage);
  }
}
