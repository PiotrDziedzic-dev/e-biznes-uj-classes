package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import models._
import repositories._

@Singleton
class CategoriesController @Inject() (cc: ControllerComponents, catRepo: CategoryRepo)
    extends AbstractController(cc) {

  def list: Action[AnyContent] =
    Action { implicit request: Request[AnyContent] =>
      Ok(Json.toJson(catRepo.all()))
    }

  def get(id: Long): Action[AnyContent] =
    Action { implicit request: Request[AnyContent] =>
      catRepo.get(id)
        .map(c => Ok(Json.toJson(c)))
        .getOrElse(NotFound(Json.obj("error" -> s"Category $id not found")))
    }

  def create: Action[JsValue] =
    Action(parse.json) { implicit request: Request[JsValue] =>
      request.body.validate[CategoryData].fold(
        errs => BadRequest(JsError.toJson(errs)),
        data => {
          val c = catRepo.create(data)
          Created(Json.toJson(c)).withHeaders(LOCATION -> s"/categories/${c.id}")
        }
      )
    }

  def update(id: Long): Action[JsValue] =
    Action(parse.json) { implicit request: Request[JsValue] =>
      request.body.validate[CategoryData].fold(
        errs => BadRequest(JsError.toJson(errs)),
        data =>
          catRepo.replace(id, data)
            .map(c => Ok(Json.toJson(c)))
            .getOrElse(NotFound(Json.obj("error" -> s"Category $id not found")))
      )
    }

  def delete(id: Long): Action[AnyContent] =
    Action { implicit request: Request[AnyContent] =>
      if (catRepo.delete(id)) NoContent
      else NotFound(Json.obj("error" -> s"Category $id not found"))
    }
}
