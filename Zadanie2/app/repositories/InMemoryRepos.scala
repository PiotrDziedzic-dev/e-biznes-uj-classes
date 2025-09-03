package repositories

import models._
import javax.inject._
import java.util.concurrent.atomic.AtomicLong
import scala.collection.concurrent.TrieMap

trait Repo[K, V, D] {
  def all(): List[V]
  def get(id: K): Option[V]
  def create(data: D): V
  def replace(id: K, data: D): Option[V]
  def delete(id: K): Boolean
}

@Singleton
class CategoryRepo @Inject() () {
  private val seq   = new AtomicLong(0L)
  private val store = TrieMap.empty[Long, Category]

  // seed
  List("RTV", "AGD", "Sport").foreach(n => create(CategoryData(n)))

  def all(): List[Category] = store.values.toList.sortBy(_.id)
  def get(id: Long): Option[Category] = store.get(id)
  def create(data: CategoryData): Category = {
    val id = seq.incrementAndGet()
    val c  = Category(id, data.name)
    store.put(id, c)
    c
  }
  def replace(id: Long, data: CategoryData): Option[Category] =
    store.get(id).map { _ =>
      val c = Category(id, data.name)
      store.update(id, c)
      c
    }
  def delete(id: Long): Boolean = store.remove(id).isDefined
}

@Singleton
class ProductRepo @Inject() (categoryRepo: CategoryRepo) {
  private val seq   = new AtomicLong(0L)
  private val store = TrieMap.empty[Long, Product]

  // przykładowe dane
  List(
    ProductData("Telewizor", BigDecimal(1999.99), 1L),
    ProductData("Pralka",    BigDecimal(1299.00), 2L),
    ProductData("Piłka",     BigDecimal(  59.90), 3L)
  ).foreach(create)

  def all(): List[Product] = store.values.toList.sortBy(_.id)
  def get(id: Long): Option[Product] = store.get(id)
  def create(data: ProductData): Product = {
    require(categoryRepo.get(data.categoryId).nonEmpty, s"Category ${data.categoryId} not found")
    val id = seq.incrementAndGet()
    val p  = Product(id, data.name, data.price, data.categoryId)
    store.put(id, p); p
  }
  def replace(id: Long, data: ProductData): Option[Product] = {
    require(categoryRepo.get(data.categoryId).nonEmpty, s"Category ${data.categoryId} not found")
    store.get(id).map { _ =>
      val p = Product(id, data.name, data.price, data.categoryId)
      store.update(id, p); p
    }
  }
  def delete(id: Long): Boolean = store.remove(id).isDefined
}

@Singleton
class CartRepo @Inject() (productRepo: ProductRepo) {
  private val seq   = new AtomicLong(0L)
  private val store = TrieMap.empty[Long, CartItem]

  def all(): List[CartItem] = store.values.toList.sortBy(_.id)
  def get(id: Long): Option[CartItem] = store.get(id)
  def create(data: CartItemData): CartItem = {
    require(productRepo.get(data.productId).nonEmpty, s"Product ${data.productId} not found")
    val id = seq.incrementAndGet()
    val ci = CartItem(id, data.productId, data.quantity)
    store.put(id, ci); ci
  }
  def replace(id: Long, data: CartItemData): Option[CartItem] = {
    require(productRepo.get(data.productId).nonEmpty, s"Product ${data.productId} not found")
    store.get(id).map { _ =>
      val ci = CartItem(id, data.productId, data.quantity)
      store.update(id, ci); ci
    }
  }
  def delete(id: Long): Boolean = store.remove(id).isDefined
}
