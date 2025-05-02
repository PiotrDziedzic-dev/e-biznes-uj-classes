package models

import "gorm.io/gorm"

type Product struct {
    gorm.Model
    Name       string   `gorm:"not null" json:"name"`
    Price      float64  `gorm:"not null" json:"price"`
    CategoryID uint     `gorm:"not null" json:"category_id"`
    Category   Category `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
}

func WithCategory(db *gorm.DB) *gorm.DB {
	return db.Preload("Category")
}