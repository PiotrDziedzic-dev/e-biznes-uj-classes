package routes

import (
	"zadanie4/controllers"

	"github.com/labstack/echo/v4"
)

func InitRouter(e *echo.Echo) {
	e.GET("/products", controllers.GetProducts)
	e.GET("/products/:id", controllers.GetProduct)
	e.POST("/products", controllers.CreateProduct)
	e.PUT("/products/:id", controllers.UpdateProduct)
	e.DELETE("/products/:id", controllers.DeleteProduct)
	e.POST("/carts", controllers.CreateCart)
	e.GET("/carts/:id", controllers.GetCart)
	e.POST("/carts/:cartId/products/:productId", controllers.AddProductToCart)
	e.POST("/categories", controllers.CreateCategory)
    e.GET("/categories", controllers.GetCategories)
}