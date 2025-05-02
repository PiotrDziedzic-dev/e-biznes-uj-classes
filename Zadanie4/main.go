package main

import (
	"zadanie4/database"
	"zadanie4/routes"
	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()

	database.Connect()
	routes.InitRouter(e)

	e.Logger.Fatal(e.Start(":1323"))
}