# Zadanie 5 – Aplikacja e-commerce (Go + React + Docker)

## Opis projektu
Projekt przedstawia prostą aplikację sklepową typu **full-stack**:
- **Backend** napisany w Go 
- **Frontend** w React
- Uruchamianie całości przez **Docker Compose**.

Aplikacja pozwala:
- wyświetlać listę produktów,
- dodawać, edytować i usuwać produkty,
- zarządzać koszykiem po stronie klienta,
- zasymulować proces płatności (formularz).


## Backend (Go)
- Endpointy REST (`/api/...`):
  - `GET    /api/products` – lista produktów,
  - `POST   /api/products` – dodanie produktu,
  - `PUT    /api/products/{id}` – edycja produktu,
  - `DELETE /api/products/{id}` – usunięcie produktu.
- Dane przechowywane są **w pamięci** (inicjalnie generowanych jest 20 przykładowych produktów).

## Frontend (React)
- Widoki:
  - **Products** – lista, edycja i usuwanie produktów, dodawanie do koszyka,
  - **Product Management** – formularz do dodania produktu,
  - **Cart** – koszyk z wykorzystaniem React Context,
  - **Payment** – makieta formularza płatności.
- Komunikacja z backendem przez `axios` (`/api/...`).

## Uruchomienie

### 1. Przez Docker Compose (zalecane)
W katalogu `Zadanie5`:
```bash
docker compose up --build
```
- Frontend: http://localhost:3000  
- Backend:  http://localhost:8080/api/products

### 2. Lokalnie (dev)
**Backend**
```bash
cd backend
go mod tidy
go run main.go
# serwer na :8080
```

**Frontend**
```bash
cd frontend
npm install
npm start
# serwer Reacta na :3000
```

## Testowanie

### Interfejs użytkownika
1. Otwórz `http://localhost:3000`.
2. W zakładce **Products** można dodać produkt do koszyka, edytować lub usunąć.
3. W zakładce **Product Management** można dodać nowy produkt.
4. W zakładce **Cart** widać zawartość koszyka.
5. Zakładka **Payment** zawiera przykładowy formularz płatności.

### API (curl)
```bash
# Lista produktów
curl http://localhost:8080/api/products

# Dodaj produkt
curl -X POST http://localhost:8080/api/products   -H "Content-Type: application/json"   -d '{"name":"Keyboard","price":149.99,"category":"Peripherals"}'

# Edytuj produkt
curl -X PUT http://localhost:8080/api/products/1   -H "Content-Type: application/json"   -d '{"name":"Mechanical Keyboard","price":199.99,"category":"Peripherals"}'

# Usuń produkt
curl -X DELETE http://localhost:8080/api/products/1 -i
```

---

## Uwagi
- Dane nie są trwałe – restart backendu = reset listy produktów.
- Koszyk i płatności są **symulowane po stronie frontendu** – nie ma backendu do obsługi zamówień.
- Projekt pokazuje integrację **Go + React + Docker**, nie pełną logikę biznesową sklepu.

