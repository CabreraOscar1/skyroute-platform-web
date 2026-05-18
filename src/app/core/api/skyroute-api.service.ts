import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import {
  Airport,
  BookingRequest,
  BookingResponse,
  FlightSearchRequest,
  FlightSearchResponse,
} from './skyroute-api.models';

@Injectable({ providedIn: 'root' })
export class SkyrouteApiService {
  private readonly http = inject(HttpClient);

  getAirports(): Observable<Airport[]> {
    return this.http.get<Airport[]>(`${API_BASE_URL}/api/airports`);
  }

  searchFlights(request: FlightSearchRequest): Observable<FlightSearchResponse> {
    return this.http.post<FlightSearchResponse>(`${API_BASE_URL}/api/flights/search`, request);
  }

  confirmBooking(request: BookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${API_BASE_URL}/api/bookings`, request);
  }
}

