import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Airport, FlightOffer } from '../../../../core/api/skyroute-api.models';
import { FlightResultsList } from './flight-results-list';

describe('FlightResultsList', () => {
  let fixture: ComponentFixture<FlightResultsList>;

  const origin: Airport = {
    code: 'EZE',
    name: 'Ministro Pistarini International Airport',
    city: 'Buenos Aires',
    countryCode: 'AR',
  };
  const destination: Airport = {
    code: 'MIA',
    name: 'Miami International Airport',
    city: 'Miami',
    countryCode: 'US',
  };
  const offers: FlightOffer[] = [
    createOffer('OFF-EXPENSIVE', 'GlobalAir', 900, 400, '2026-06-10T13:00:00'),
    createOffer('OFF-CHEAP', 'BudgetWings', 300, 520, '2026-06-10T08:00:00'),
    createOffer('OFF-FAST', 'GlobalAir Express', 600, 120, '2026-06-10T11:00:00'),
  ];

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [FlightResultsList],
    }).compileComponents();

    fixture = TestBed.createComponent(FlightResultsList);
    fixture.componentRef.setInput('offers', offers);
    fixture.componentRef.setInput('hasSearched', true);
    fixture.detectChanges();
  });

  it('should sort offers locally by selected criteria', () => {
    expect(firstOfferText()).toContain('BudgetWings');

    changeSort('priceDesc');
    expect(firstOfferText()).toContain('GlobalAir');

    changeSort('durationAsc');
    expect(firstOfferText()).toContain('GlobalAir Express');

    changeSort('departureAsc');
    expect(firstOfferText()).toContain('BudgetWings');
  });

  function changeSort(value: string): void {
    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.value = value;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  function firstOfferText(): string {
    return (fixture.nativeElement.querySelector('.offer-card') as HTMLElement).textContent ?? '';
  }

  function createOffer(
    offerId: string,
    provider: string,
    totalPrice: number,
    durationMinutes: number,
    departureAt: string,
  ): FlightOffer {
    return {
      offerId,
      provider,
      flightNumber: `${provider.slice(0, 2).toUpperCase()}123`,
      origin,
      destination,
      departureAt,
      arrivalAt: '2026-06-10T15:00:00',
      durationMinutes,
      cabinClass: 'Economy',
      currency: 'USD',
      pricePerPassenger: totalPrice,
      passengerCount: 1,
      totalPrice,
    };
  }
});
