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


### Przed uruchomieniem przygotuj konfigurację `.env`
W katalogu głównym projektu otwórz plik `.env`:

```env
DISCORD_TOKEN=TWÓJ_TOKEN_BOTA
PORT=TWOJ_PORT

Bota możesz testować na jedynm z moich kanałów

https://discord.com/channels/1412342294962769994/1412342294962769997
