# Eurovision Game

Eurovision Song Contest game application with country selection, performance viewing, voting, and results tracking. Built with Angular frontend and Spring Boot backend.

## Project Structure

```
EurovisionGame/
├── eurovision-frontend/    # Angular frontend application
└── eurovision-backend/     # Spring Boot REST API backend
```

## Tech Stack

### Frontend
- **Angular 18** - Frontend framework
- **TypeScript** - Programming language
- **CSS3** - Styling with custom Eurovision theme

### Backend
- **Spring Boot 4.0.1** - Java framework
- **Maven** - Build tool
- **REST API** - Backend services

## Features

- 🎵 Country selection for Eurovision participants
- 🎤 Performance viewing
- 🗳️ Voting system

## Getting Started

### Prerequisites

- Node.js and npm (for frontend)
- Java 25+ (for backend)
- Maven (for backend)

### Frontend Setup

```bash
cd eurovision-frontend
npm install
ng serve
```

The frontend will be available at `http://localhost:4200`

### Backend Setup

```bash
cd eurovision-backend
mvn spring-boot:run
```

The backend API will be available at `http://localhost:8080/api`

## API Endpoints

- `GET /api/countries` - Get all countries
- `PUT /api/countries` - Set user's selected country

## Development

### Frontend Development
```bash
cd eurovision-frontend
ng serve
```

### Backend Development
```bash
cd eurovision-backend
mvn spring-boot:run
```

## License

This project is for educational purposes.

