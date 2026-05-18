import { Component, computed, input, output, signal } from '@angular/core';

import { FlightOffer } from '../../../../core/api/skyroute-api.models';
import { FlightOfferCard } from '../flight-offer-card/flight-offer-card';

type FlightSortOption = 'priceAsc' | 'priceDesc' | 'durationAsc' | 'departureAsc';

@Component({
  selector: 'app-flight-results-list',
  imports: [FlightOfferCard],
  templateUrl: './flight-results-list.html',
  styleUrl: './flight-results-list.scss',
})
export class FlightResultsList {
  readonly offers = input<FlightOffer[]>([]);
  readonly selectedOfferId = input<string | null>(null);
  readonly loading = input(false);
  readonly hasSearched = input(false);
  readonly selected = output<FlightOffer>();

  protected readonly sortOptions: { value: FlightSortOption; label: string }[] = [
    { value: 'priceAsc', label: 'Precio: menor a mayor' },
    { value: 'priceDesc', label: 'Precio: mayor a menor' },
    { value: 'durationAsc', label: 'Duracion: menor primero' },
    { value: 'departureAsc', label: 'Salida: mas temprano' },
  ];
  protected readonly selectedSort = signal<FlightSortOption>('priceAsc');
  protected readonly sortedOffers = computed(() => {
    const offers = [...this.offers()];

    switch (this.selectedSort()) {
      case 'priceDesc':
        return offers.sort((current, next) => next.totalPrice - current.totalPrice);
      case 'durationAsc':
        return offers.sort((current, next) => current.durationMinutes - next.durationMinutes);
      case 'departureAsc':
        return offers.sort(
          (current, next) =>
            new Date(current.departureAt).getTime() - new Date(next.departureAt).getTime(),
        );
      case 'priceAsc':
      default:
        return offers.sort((current, next) => current.totalPrice - next.totalPrice);
    }
  });

  protected changeSort(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as FlightSortOption;
    this.selectedSort.set(value);
  }
}
