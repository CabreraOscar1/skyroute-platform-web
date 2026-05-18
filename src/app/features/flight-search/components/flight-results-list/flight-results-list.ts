import { Component, computed, inject, input, output, signal } from '@angular/core';

import { FlightOffer } from '../../../../core/api/skyroute-api.models';
import { LanguageService } from '../../../../core/i18n/language.service';
import { FlightOfferCard } from '../flight-offer-card/flight-offer-card';

type FlightSortOption = 'priceAsc' | 'priceDesc' | 'durationAsc' | 'departureAsc';

@Component({
  selector: 'app-flight-results-list',
  imports: [FlightOfferCard],
  templateUrl: './flight-results-list.html',
  styleUrl: './flight-results-list.scss',
})
export class FlightResultsList {
  private readonly language = inject(LanguageService);

  readonly offers = input<FlightOffer[]>([]);
  readonly selectedOfferId = input<string | null>(null);
  readonly loading = input(false);
  readonly hasSearched = input(false);
  readonly selected = output<FlightOffer>();

  protected readonly t = this.language.text;
  protected readonly sortOptions = computed<{ value: FlightSortOption; label: string }[]>(() => [
    { value: 'priceAsc', label: this.t().sortPriceAsc },
    { value: 'priceDesc', label: this.t().sortPriceDesc },
    { value: 'durationAsc', label: this.t().sortDurationAsc },
    { value: 'departureAsc', label: this.t().sortDepartureAsc },
  ]);
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
