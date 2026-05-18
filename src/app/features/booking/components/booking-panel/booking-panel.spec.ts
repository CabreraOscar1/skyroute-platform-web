import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Airport, FlightOffer, PassengerRequest } from '../../../../core/api/skyroute-api.models';
import { BookingPanel } from './booking-panel';

describe('BookingPanel', () => {
  let fixture: ComponentFixture<BookingPanel>;

  const argentinaAirport: Airport = {
    code: 'EZE',
    name: 'Ministro Pistarini International Airport',
    city: 'Buenos Aires',
    countryCode: 'AR',
  };
  const argentinaDomesticAirport: Airport = {
    code: 'AEP',
    name: 'Jorge Newbery Airfield',
    city: 'Buenos Aires',
    countryCode: 'AR',
  };
  const usaAirport: Airport = {
    code: 'MIA',
    name: 'Miami International Airport',
    city: 'Miami',
    countryCode: 'US',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingPanel);
  });

  it('should use passport validation for international flights', () => {
    fixture.componentRef.setInput('selectedOffer', createOffer(argentinaAirport, usaAirport));
    fixture.detectChanges();

    expect(documentLabel()).toContain('Passport Number');
    expect(fixture.nativeElement.textContent).toContain('Letras y numeros');
  });

  it('should use national id validation for domestic flights', () => {
    fixture.componentRef.setInput(
      'selectedOffer',
      createOffer(argentinaAirport, argentinaDomesticAirport),
    );
    fixture.detectChanges();

    expect(documentLabel()).toContain('National ID');
    expect(fixture.nativeElement.textContent).toContain('Solo numeros');
  });

  it('should not confirm a domestic booking with an alphanumeric national id', () => {
    const emittedPassengers: PassengerRequest[] = [];
    fixture.componentInstance.confirmed.subscribe((passenger) => emittedPassengers.push(passenger));
    fixture.componentRef.setInput(
      'selectedOffer',
      createOffer(argentinaAirport, argentinaDomesticAirport),
    );
    fixture.detectChanges();

    const documentInput = fixture.nativeElement.querySelector('#documentNumber') as HTMLInputElement;
    documentInput.value = 'A1234567';
    documentInput.dispatchEvent(new Event('input'));

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(emittedPassengers).toHaveLength(0);
    expect(fixture.nativeElement.textContent).toContain('National ID invalido.');
  });

  function documentLabel(): string {
    return (
      fixture.nativeElement.querySelector('label[for="documentNumber"]') as HTMLLabelElement
    ).textContent ?? '';
  }

  function createOffer(origin: Airport, destination: Airport): FlightOffer {
    return {
      offerId: 'OFF-GA-ABC12345-01',
      provider: 'GlobalAir',
      flightNumber: 'GA123',
      origin,
      destination,
      departureAt: '2026-06-10T08:00:00',
      arrivalAt: '2026-06-10T12:00:00',
      durationMinutes: 240,
      cabinClass: 'Economy',
      currency: 'USD',
      pricePerPassenger: 120,
      passengerCount: 2,
      totalPrice: 240,
    };
  }
});
