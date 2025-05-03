package main

import (
    "encoding/json"
    "fmt"
    "math/rand"
    "net/http"
    "strconv"
    "sync"
    "time"
    "github.com/gorilla/mux"
    "github.com/rs/cors"
)

type Product struct {
    ID       int     `json:"id"`
    Name     string  `json:"name"`
    Price    float64 `json:"price"`
    Category string  `json:"category"`
}

var (
	products []Product
	mu       sync.Mutex
	idSeq    int = 2 // Początkowy ID
)

func main() {
    rand.New(rand.NewSource(time.Now().UnixNano()))
    categories := []string{"Electronics", "Clothing", "Home", "Sports", "Books"}

    products = make([]Product, 20)
    for i := 0; i < 20; i++ {
        products[i] = Product{
            ID:       i + 1,
            Name:     fmt.Sprintf("%s %d", categories[i%5], i+1),
            Price:    float64(10 + rand.Intn(200)) + rand.Float64(),
            Category: categories[i%5],
        }
    }
    idSeq = 21

	r := mux.NewRouter()

	// Product endpoints
	r.HandleFunc("/api/products", getProducts).Methods("GET")
	r.HandleFunc("/api/products", createProduct).Methods("POST")
	r.HandleFunc("/api/products/{id}", updateProduct).Methods("PUT")
	r.HandleFunc("/api/products/{id}", deleteProduct).Methods("DELETE")

	// CORS
handler := cors.New(cors.Options{
    AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:8080"},
    AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    AllowedHeaders:   []string{"Content-Type", "Authorization"},
    AllowCredentials: true,
}).Handler(r)

	http.ListenAndServe(":8080", handler)
}

func getProducts(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(products)
}

func createProduct(w http.ResponseWriter, r *http.Request) {
	var newProduct Product
	if err := json.NewDecoder(r.Body).Decode(&newProduct); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	mu.Lock()
	defer mu.Unlock()

	newProduct.ID = idSeq
	idSeq++
	products = append(products, newProduct)

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newProduct)
}

func updateProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])

	var updatedProduct Product
	if err := json.NewDecoder(r.Body).Decode(&updatedProduct); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	mu.Lock()
	defer mu.Unlock()

	for i, p := range products {
		if p.ID == id {
			products[i] = updatedProduct
			products[i].ID = id // Zachowaj oryginalne ID
			json.NewEncoder(w).Encode(products[i])
			return
		}
	}

	http.Error(w, "Product not found", http.StatusNotFound)
}

func deleteProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])

	mu.Lock()
	defer mu.Unlock()

	for i, p := range products {
		if p.ID == id {
			products = append(products[:i], products[i+1:]...)
			w.WriteHeader(http.StatusNoContent)
			return
		}
	}

	http.Error(w, "Product not found", http.StatusNotFound)
}