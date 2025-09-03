# Zadanie 3 - Scala 3 CRUD 

Aplikacja w **Play** i **Scala** z kontrolerami typu CRUD oraz repozytoriami.
Encje i endpointy:
- **Kategorie** — `/categories`
- **Produkty** — `/products`
- **Koszyk** — `/cart`
- **Health** — `/health`

---

## Wymagania
- **Java 17** (Play 2.9 wspiera 11/17/21)
- **sbt 1.10.x**
- **Docker** oraz **ngrok**

---


## Uruchomienie lokalne

```bash
env PLAY_SECRET="$PLAY_SECRET" JAVA_HOME=$(/usr/libexec/java_home -v 17) \
sbt -java-home "$JAVA_HOME" clean run
```
Aplikacja działa na `http://localhost:9000`.

---

## Endpoints

```
GET    /health

# Kategorie
GET    /categories
GET    /categories/:id
POST   /categories
PUT    /categories/:id
DELETE /categories/:id

# Produkty
GET    /products
GET    /products/:id
POST   /products
PUT    /products/:id
DELETE /products/:id

# Koszyk
GET    /cart
GET    /cart/:id
POST   /cart
PUT    /cart/:id
DELETE /cart/:id
```



## Testy szybkie (curl)


**Health**
```bash
curl -i http://localhost:9000/health
```

**Kategorie**
```bash
curl -s http://localhost:9000/categories | jq
curl -s http://localhost:9000/categories/1 | jq

curl -s -X POST http://localhost:9000/categories \
  -H 'Content-Type: application/json' \
  -d '{"name":"Elektronika"}' | jq

curl -s -X PUT http://localhost:9000/categories/1 \
  -H 'Content-Type: application/json' \
  -d '{"name":"RTV/Audio"}' | jq

curl -i -X DELETE http://localhost:9000/categories/3
```

**Produkty**
```bash
curl -s http://localhost:9000/products | jq
curl -s http://localhost:9000/products/1 | jq

curl -s -X POST http://localhost:9000/products \
  -H 'Content-Type: application/json' \
  -d '{"name":"Kamera","price":499.99,"categoryId":1}' | jq

curl -s -X PUT http://localhost:9000/products/1 \
  -H 'Content-Type: application/json' \
  -d '{"name":"Telewizor 4K","price":2599.00,"categoryId":1}' | jq

curl -i -X DELETE http://localhost:9000/products/1

# Błąd walidacji (oczekiwane 400):
curl -i -X POST http://localhost:9000/products \
  -H 'Content-Type: application/json' \
  -d '{"name":"X","price":10,"categoryId":999}'
```

**Koszyk**
```bash
curl -s http://localhost:9000/cart | jq
curl -s http://localhost:9000/cart/1 | jq

curl -s -X POST http://localhost:9000/cart \
  -H 'Content-Type: application/json' \
  -d '{"productId":1,"quantity":2}' | jq

curl -s -X PUT http://localhost:9000/cart/1 \
  -H 'Content-Type: application/json' \
  -d '{"productId":1,"quantity":5}' | jq

curl -i -X DELETE http://localhost:9000/cart/1
```


Uruchom:
```bash
bash scripts/ngrok.sh 9000
```

