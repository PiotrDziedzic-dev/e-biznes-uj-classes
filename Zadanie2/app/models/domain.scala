package models

import play.api.libs.json._

final case class Category(id: Long, name: String)
object Category { given OFormat[Category] = Json.format[Category] }

final case class Product(id: Long, name: String, price: BigDecimal, categoryId: Long)
object Product { given OFormat[Product] = Json.format[Product] }

final case class CartItem(id: Long, productId: Long, quantity: Int)
object CartItem { given OFormat[CartItem] = Json.format[CartItem] }

final case class CategoryData(name: String)
object CategoryData { given OFormat[CategoryData] = Json.format[CategoryData] }

final case class ProductData(name: String, price: BigDecimal, categoryId: Long)
object ProductData { given OFormat[ProductData] = Json.format[ProductData] }

final case class CartItemData(productId: Long, quantity: Int)
object CartItemData { given OFormat[CartItemData] = Json.format[CartItemData] }
