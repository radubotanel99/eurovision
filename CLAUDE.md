# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Eurovision Song Contest game — a full-stack app where users pick a country, watch performances, vote, and see results. No database; all state is in-memory on the backend.

## Repository Layout

```
eurovision/
├── eurovision-frontend/   # Angular 18 SPA
└── eurovision-backend/    # Spring Boot 4 REST API
```

## Frontend (Angular 18)

**Dev server:**
```bash
cd eurovision-frontend
npm install
npm start          # http://localhost:4200
```

**Build & test:**
```bash
npm run build      # production build
npm run watch      # dev build with file watching
npm test           # Karma/Jasmine unit tests (headless Chrome)
# Run a single spec file:
npm test -- --include='**/select-country.component.spec.ts'
```

**Architecture:**
- All components are standalone (no NgModules)
- Routes defined in `src/app/app.routes.ts`
- `EurovisionService` handles all HTTP calls to the backend API
- `AudioService` manages background music/audio state
- Environment files (`environment.ts` / `environment.prod.ts`) define `apiUrl`
- Production API: `https://eurovision-backend-6o1q.onrender.com/api`
- Angular Material (`azure-blue` prebuilt theme) is available but lightly used

**UI flow (route order):**
Home → Select-Country → Transition → My-Performance → Performance-Complete → Performances → Voting → Results-Transition → Results → Statistics

**Key non-obvious patterns:**

- **`TransitionComponent`** is a reusable animated interstitial that auto-navigates after a delay. It reads `message`, `target`, and `duration` from query params — navigate to `/transition?message=...&target=/some-route&duration=3500` to use it.

- **`AudioService`** maps routes to audio tracks in a `trackMap`. Routes absent from the map play silence. The service auto-pauses when the tab is hidden and resumes on visibility restore. YouTube video modals in `VotingComponent` explicitly call `audioService.pause()` / `audioService.resume()`. Browser autoplay restrictions are handled by deferring playback until any user interaction (click/keydown/touchstart/mousedown).

- **`PerformancesComponent`** gates navigation to `/voting`: the "Continue to Voting" button is only enabled once every non-user country has been opened in the YouTube modal (`watchedCountries` Set tracks this).

- **YouTube embeds** use `DomSanitizer.bypassSecurityTrustResourceUrl` to construct safe iframe URLs — required for Angular's security model.

- **`ResultsComponent`** uses the `canvas-confetti` library to trigger a celebration animation on load.

## Backend (Spring Boot 4 / Java 25)

**Run locally:**
```bash
cd eurovision-backend
./mvnw spring-boot:run    # http://localhost:8080
```

**Build JAR:**
```bash
./mvnw clean package
```

**Architecture:**
- No database — country and vote data lives in-memory (reset on restart)
- Two controllers: `CountryController` (`/api/countries`) and `VoteController` (`/api/vote`)
- Each controller has a corresponding service: `CountryService`, `VoteService`
- CORS is configured in `WebConfig.java` for `localhost:4200` and the production frontend
- Dockerfile exposes port 10000; deployed on Render

**Key API endpoints:**
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/countries` | All countries |
| PUT | `/api/countries` | Set user's country |
| GET | `/api/countries/user` | Get user's selected country |
| POST | `/api/vote` | Submit votes |
| GET | `/api/vote` | All votes |
| GET | `/api/vote/results` | Aggregated results |

## Key Data Models (Backend)

- **Country** — name, totalPoints, userCountry flag, Song (artist, title, YouTube video ID)
- **Vote** — voting data per country
- **CountryVotesDTO / ResultVotesDTO** — response shapes for vote aggregation
