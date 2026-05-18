import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Airport, FlightSearchRequest } from '../../../../core/api/skyroute-api.models';
import { FlightSearchForm } from './flight-search-form';

describe('FlightSearchForm', () => {
  let fixture: ComponentFixture<FlightSearchForm>;

  const airports: Airport[] = [
    {
      code: 'EZE',
      name: 'Ministro Pistarini International Airport',
      city: 'Buenos Aires',
      countryCode: 'AR',
    },
    { code: 'MIA', name: 'Miami International Airport', city: 'Miami', countryCode: 'US' },
  ];

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [FlightSearchForm],
    }).compileComponents();

    fixture = TestBed.createComponent(FlightSearchForm);
    fixture.componentRef.setInput('airports', airports);
    fixture.detectChanges();
  });

  it('should not emit a search when origin and destination are the same', () => {
    const emittedRequests: FlightSearchRequest[] = [];
    fixture.componentInstance.search.subscribe((request) => emittedRequests.push(request));

    const destination = fixture.nativeElement.querySelector('#destination') as HTMLSelectElement;
    destination.value = 'EZE';
    destination.dispatchEvent(new Event('change'));

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(emittedRequests).toHaveLength(0);
    expect(fixture.nativeElement.textContent).toContain(
      'Origin and destination must be different.',
    );
  });
});
