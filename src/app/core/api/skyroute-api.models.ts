export type CabinClass = 'Economy' | 'Business' | 'FirstClass';

export interface Airport {
  code: string;
  name: string;
  city: string;
  countryCode: string;
}

export interface FlightSearchRequest {
  origin: string;
  destination: string;
  departureDate: string;
  passengerCount: number;
  cabinClass: CabinClass;
}

export interface FlightSearchCriteria {
  origin: string;
  destination: string;
  departureDate: string;
  passengerCount: number;
  cabinClass: CabinClass;
}

export interface FlightSearchResponse {
  searchId: string;
  criteria: FlightSearchCriteria;
  results: FlightOffer[];
}

export interface FlightOffer {
  offerId: string;
  provider: string;
  flightNumber: string;
  origin: Airport;
  destination: Airport;
  departureAt: string;
  arrivalAt: string;
  durationMinutes: number;
  cabinClass: CabinClass;
  currency: string;
  pricePerPassenger: number;
  passengerCount: number;
  totalPrice: number;
}

export interface PassengerRequest {
  fullName: string;
  email: string;
  documentNumber: string;
}

export interface BookingRequest {
  offerId: string;
  primaryPassenger: PassengerRequest;
}

export interface BookingResponse {
  bookingReference: string;
  status: 'Confirmed';
  offerId: string;
  provider: string;
  flightNumber: string;
  totalPrice: number;
  currency: string;
}

