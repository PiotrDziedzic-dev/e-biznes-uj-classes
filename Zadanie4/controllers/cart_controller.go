package controllers

import (
	"net/http"
	"strconv"

	"zadanie4/database"
	"zadanie4/models"
	"github.com/labstack/echo/v4"
)

func CreateCart(c echo.Context) error {
	cart := new(models.Cart)
	if err := c.Bind(cart); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	database.DB.Create(cart)
	return c.JSON(http.StatusCreated, cart)
}

func GetCart(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	var cart models.Cart
	result := database.DB.Preload("Products").First(&cart, id)
	if result.Error != nil {
		return c.JSON(http.StatusNotFound, "Cart not found")
	}
	return c.JSON(http.StatusOK, cart)
}

func AddProductToCart(c echo.Context) error {
	cartID, _ := strconv.Atoi(c.Param("cartId"))
	productID, _ := strconv.Atoi(c.Param("productId"))

	var cart models.Cart
	if err := database.DB.First(&cart, cartID).Error; err != nil {
		return c.JSON(http.StatusNotFound, "Cart not found")
	}

	var product models.Product
	if err := database.DB.First(&product, productID).Error; err != nil {
		return c.JSON(http.StatusNotFound, "Product not found")
	}

	database.DB.Model(&cart).Association("Products").Append(&product)
	return c.JSON(http.StatusOK, cart)
}