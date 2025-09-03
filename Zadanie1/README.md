# Zadanie 1 – Docker

Obraz zawiera:
- **Ubuntu 24.04**
- **Python 3.10**
- **Java 8 (Zulu, SDKMAN)**
- **Kotlin**
- **Gradle 8.7**
- **SQLite JDBC driver** 

Projekt to aplikacja **HelloWorld w Kotlinie**, uruchamiana przez Gradle (`gradle run`).  
Dodatkowo aplikacja testuje bazę SQLite (in-memory).



---

## Budowanie obrazu

### Lokalnie (Docker)
```bash
docker build -t piotrdziedzic/e-biznes-uj-classes:latest .
```

### Docker Compose
```bash
docker compose build
```

---

## Uruchamianie

### Bezpośrednio
```bash
docker run --rm piotrdziedzic/e-biznes-uj-classes:latest
```

### Przez docker-compose
```bash
docker compose up
```
---

## Docker Hub

Obraz dostępny jest pod:
[piotrdziedzic/e-biznes-uj-classes](https://hub.docker.com/r/piotrdziedzic/e-biznes-uj-classes)



