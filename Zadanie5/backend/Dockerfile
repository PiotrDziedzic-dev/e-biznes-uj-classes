# Etap budowania
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Kopiuj i instaluj zależności
COPY go.mod go.sum ./
RUN go mod download

# Kopiuj źródła i buduj
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/main

# Etap uruchomieniowy
FROM alpine:latest

WORKDIR /app

# Skopiuj tylko binarkę
COPY --from=builder /app/main /app/main

# Bezpieczny użytkownik
RUN adduser -D myuser
USER myuser

EXPOSE 8080
CMD ["./main"]