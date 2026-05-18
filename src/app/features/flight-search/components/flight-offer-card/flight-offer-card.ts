import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';

import { FlightOffer } from '../../../../core/api/skyroute-api.models';
import { LanguageService } from '../../../../core/i18n/language.service';

@Component({
  selector: 'app-flight-offer-card',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './flight-offer-card.html',
  styleUrl: './flight-offer-card.scss',
})
export class FlightOfferCard {
  readonly offer = input.required<FlightOffer>();
  readonly selected = input(false);
  readonly selectedChange = output<FlightOffer>();
  protected readonly t = inject(LanguageService).text;

  protected chooseOffer(): void {
    this.selectedChange.emit(this.offer());
  }

  protected formatDuration(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  }
}
