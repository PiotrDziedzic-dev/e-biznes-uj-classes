# Discord Bot – Zadanie 3 (Kotlin + Ktor + Kord)

## Opis
Aplikacja kliencka w **Kotlinie** zbudowana z użyciem:
- **Ktor** – prosty serwer HTTP (health check + endpoint `/simulate` do testowania logiki),
- **Kord** – biblioteka do obsługi bota Discord.

Bot potrafi:
- odpowiadać na wiadomości użytkowników,
- zwrócić listę kategorii produktów (`!kategorie`),
- zwrócić listę produktów wg wybranej kategorii (`!produkty <kategoria>`),
- powtarzać tekst (`!powiedz <tekst>`),
- podpowiadać dostępne komendy (`!pomoc`).

Dane produktów są wbudowane w kod (stub w `ProductService`).

---

## Wymagania
- **Java 17+** (np. z [Adoptium Temurin](https://adoptium.net/))
- **Gradle Wrapper** (w repozytorium znajduje się `gradlew`, więc nie trzeba instalować Gradle globalnie)
- Konto Discord + własny serwer (guildia) do testów
- Utworzona aplikacja bota w [Discord Developer Portal](https://discord.com/developers/applications)

---

## Instalacja i uruchomienie

### 1. Utwórz bota w Developer Portal
1. Wejdź na [Discord Developer Portal](https://discord.com/developers/applications).
2. **New Application** → nazwa → zakładka **Bot** → **Add Bot**.
3. Skopiuj **Token** bota (potrzebny w `.env`).
4. W sekcji **Privileged Gateway Intents** włącz:
    - ✅ **Message Content Intent**
5. W zakładce **OAuth2 → URL Generator**:
    - Scopes: `bot`
    - Bot Permissions: `Send Messages`, `Read Message History`, `View Channels`
    - Skopiuj wygenerowany link i otwórz go w przeglądarce → zaproś bota na swój serwer.

### 2. Przygotuj konfigurację `.env`
W katalogu głównym projektu (`Zadanie3/`) utwórz plik `.env`:

```env
DISCORD_TOKEN=TWÓJ_TOKEN_BOTA
PORT=8090
