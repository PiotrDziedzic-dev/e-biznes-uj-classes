package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import models._
import repositories._

@Singleton
class ProductsController @Inject() (cc: ControllerComponents, prodRepo: ProductRepo)
    extends AbstractController(cc) {

  def list: Action[AnyContent] =
    Action { implicit request: Request[AnyContent] =>
      Ok(Json.toJson(prodRepo.all()))
    }

  def get(id: Long): Action[AnyContent] =
    Action { implicit request: Request[AnyContent] =>
      prodRepo.get(id)
        .map(p => Ok(Json.toJson(p)))
        .getOrElse(NotFound(Json.obj("error" -> s"Product $id not found")))
    }

  def create: Action[JsValue] =
    Action(parse.json) { implicit request: Request[JsValue] =>
      request.body.validate[ProductData].fold(
        errs => BadRequest(JsError.toJson(errs)),
        data =>
          try {
            val p = prodRepo.create(data)
            Created(Json.toJson(p)).withHeaders(LOCATION -> s"/products/${p.id}")
          } catch {
            case e: IllegalArgumentException => BadRequest(Json.obj("error" -> e.getMessage))
          }
      )
    }

  def update(id: Long): Action[JsValue] =
    Action(parse.json) { implicit request: Request[JsValue] =>
      request.body.validate[ProductData].fold(
        errs => BadRequest(JsError.toJson(errs)),
        data =>
          try {
            prodRepo.replace(id, data)
              .map(p => Ok(Json.toJson(p)))
              .getOrElse(NotFound(Json.obj("error" -> s"Product $id not found")))
          } catch {
            case e: IllegalArgumentException => BadRequest(Json.obj("error" -> e.getMessage))
          }
      )
    }

  def delete(id: Long): Action[AnyContent] =
    Action { implicit request: Request[AnyContent] =>
      if (prodRepo.delete(id)) NoContent
      else NotFound(Json.obj("error" -> s"Product $id not found"))
    }
}
