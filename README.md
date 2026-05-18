# SkyRoute Platform Web

Angular frontend for the SkyRoute Travel Platform technical challenge.

The application allows users to search flights, sort results locally, select an offer, and confirm a booking through the .NET backend API.

## Stack

- Angular 21
- TypeScript
- SCSS
- Angular Signals
- Reactive Forms
- HttpClient

## Requirements

- Node.js compatible with Angular 21.
- npm.
- SkyRoute backend running locally.

The expected API base URL is:

```text
https://localhost:7140
```

If the backend runs on a different port, update:

```text
src/app/core/config/api.config.ts
```

## Installation

```powershell
npm install
```

## Running Locally

Start the .NET backend first. Then run:

```powershell
npm start
```

Open:

```text
http://localhost:4200
```

## Verification

```powershell
npm run build
npm test -- --watch=false
```

## Implemented Features

- Loads airports from `GET /api/airports`.
- Flight search form with origin, destination, departure date, passengers, and cabin class.
- Flight search through `POST /api/flights/search`.
- Loading state while searching.
- Empty state when there are no matching results.
- Results showing provider, flight number, times, duration, cabin class, and price.
- Total price highlighted, with per-passenger price shown as secondary information.
- Local sorting without an additional backend call:
  - price low to high;
  - price high to low;
  - shortest duration first;
  - earliest departure time.
- Offer selection.
- Booking panel with selected flight summary.
- Price breakdown with per-passenger price, passenger count, and total.
- Dynamic document field:
  - `Passport Number` for international flights;
  - `National ID` for domestic flights.
- Frontend document validation based on the selected route.
- Booking confirmation through `POST /api/bookings`.
- Booking reference display.

## Frontend Architecture

```text
src/app/
  core/
    api/
    config/
  features/
    flight-search/
      pages/
      components/
    booking/
      components/
  shared/
```

## Technical Decisions

`core/api` centralizes HTTP communication and shared API models. Components do not build URLs or depend on endpoint details directly.

`features` groups code by business capability. `flight-search` contains the main search page, form, and results. `booking` contains the booking panel.

`App` remains a lightweight routing shell. Screen logic lives in `FlightSearchPage`, which coordinates local state, API calls, and child components.

Angular Signals are used for local state because the current flow is linear and does not require a global store. Reactive Forms are used for clear, testable validation.

## Trade-offs

- NgRx was not added because the current state is local and simple.
- Angular environments were not added yet; the API base URL is centralized in `api.config.ts`.
- End-to-end tests are not configured yet; build, base unit tests, and manual integration testing were prioritized.
- Booking is implemented as a panel inside the main flow to keep the challenge focused.
