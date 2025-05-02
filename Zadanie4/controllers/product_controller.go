package controllers

import (
	"net/http"
	"strconv"

	"zadanie4/database"
	"zadanie4/models"
	"github.com/labstack/echo/v4"
)

func GetProducts(c echo.Context) error {
	var products []models.Product
	database.DB.Scopes(models.WithCategory).Find(&products)
	return c.JSON(http.StatusOK, products)
}

func GetProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	var product models.Product
	result := database.DB.Scopes(models.WithCategory).First(&product, id)
	if result.Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Product not found"})
	}
	return c.JSON(http.StatusOK, product)
}

func CreateProduct(c echo.Context) error {
	product := new(models.Product)
	if err := c.Bind(product); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	var category models.Category
	if err := database.DB.First(&category, product.CategoryID).Error; err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Category does not exist"})
	}

	database.DB.Create(product)
	return c.JSON(http.StatusCreated, product)
}

func UpdateProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	product := new(models.Product)
	if err := c.Bind(product); err != nil {
		return err
	}

	var existingProduct models.Product
	if err := database.DB.First(&existingProduct, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, "Product not found")
	}

	existingProduct.Name = product.Name
	existingProduct.Price = product.Price
	existingProduct.CategoryID = product.CategoryID
	database.DB.Save(&existingProduct)

	return c.JSON(http.StatusOK, existingProduct)
}

func DeleteProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	database.DB.Delete(&models.Product{}, id)
	return c.NoContent(http.StatusNoContent)
}