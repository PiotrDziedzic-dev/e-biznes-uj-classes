# Zadanie 6 – Testy

## Opis projektu
- **Cypress (E2E + API)** 
  - UI: 20 przypadków testowych
  - API: pokrycie wszystkich endpointów (`GET/POST/PUT/DELETE /api/products`) + scenariusze negatywne.

## Jak uruchomić testy lokalnie

### 1) Backend + Frontend
Uruchom aplikację z Zadania 5 (lokalnie lub przez Docker Compose). W trybie lokalnym:
```bash
# backend
cd Zadanie5/backend
go run main.go   # :8080

# frontend
cd Zadanie5/frontend
npm install
npm start        # :3000 (proxy /api -> :8080)
```

### 2) Cypress (lokalnie)
W tym folderze:
```bash
npm install
npm run cypress:open    # tryb interaktywny
# lub
npm run cypress:run     # headless
```



