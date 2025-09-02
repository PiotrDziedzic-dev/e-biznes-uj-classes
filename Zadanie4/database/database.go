package database

import (
	"os"
	"zadanie4/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	if err := os.Remove("test.db"); err != nil && !os.IsNotExist(err) {
		panic("failed to remove existing database")
	}

	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	db.Exec("PRAGMA foreign_keys = ON")

	DB = db

	DB.AutoMigrate(
		&models.Category{},
		&models.Product{},
		&models.Cart{},
	)
}