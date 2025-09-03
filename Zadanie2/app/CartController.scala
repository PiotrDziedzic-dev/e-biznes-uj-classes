package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import models._
import repositories._

@Singleton
class CartController @Inject() (cc: ControllerComponents, cartRepo: CartRepo)
    extends AbstractController(cc) {

  def list: Action[AnyContent] =
    Action { implicit request: Request[AnyContent] =>
      Ok(Json.toJson(cartRepo.all()))
    }

  def get(id: Long): Action[AnyContent] =
    Action { implicit request: Request[AnyContent] =>
      cartRepo.get(id)
        .map(ci => Ok(Json.toJson(ci)))
        .getOrElse(NotFound(Json.obj("error" -> s"Cart item $id not found")))
    }

  def create: Action[JsValue] =
    Action(parse.json) { implicit request: Request[JsValue] =>
      request.body.validate[CartItemData].fold(
        errs => BadRequest(JsError.toJson(errs)),
        data =>
          try {
            val ci = cartRepo.create(data)
            Created(Json.toJson(ci)).withHeaders(LOCATION -> s"/cart/${ci.id}")
          } catch {
            case e: IllegalArgumentException => BadRequest(Json.obj("error" -> e.getMessage))
          }
      )
    }

  def update(id: Long): Action[JsValue] =
    Action(parse.json) { implicit request: Request[JsValue] =>
      request.body.validate[CartItemData].fold(
        errs => BadRequest(JsError.toJson(errs)),
        data =>
          try {
            cartRepo.replace(id, data)
              .map(ci => Ok(Json.toJson(ci)))
              .getOrElse(NotFound(Json.obj("error" -> s"Cart item $id not found")))
          } catch {
            case e: IllegalArgumentException => BadRequest(Json.obj("error" -> e.getMessage))
          }
      )
    }

  def delete(id: Long): Action[AnyContent] =
    Action { implicit request: Request[AnyContent] =>
      if (cartRepo.delete(id)) NoContent
      else NotFound(Json.obj("error" -> s"Cart item $id not found"))
    }
}
