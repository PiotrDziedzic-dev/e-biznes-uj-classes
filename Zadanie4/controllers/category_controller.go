package controllers

import (
	"net/http"

	"zadanie4/database"
	"zadanie4/models"
	"github.com/labstack/echo/v4"
)

func CreateCategory(c echo.Context) error {
	category := new(models.Category)
	if err := c.Bind(category); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	database.DB.Create(category)
	return c.JSON(http.StatusCreated, category)
}

func GetCategories(c echo.Context) error {
	var categories []models.Category
	database.DB.Find(&categories)
	return c.JSON(http.StatusOK, categories)
}