package controllers

import javax.inject._
import play.api.mvc._

@Singleton
class HealthController @Inject() (cc: ControllerComponents) extends AbstractController(cc) {
  def ping: Action[AnyContent] =
    Action { implicit request: Request[AnyContent] => Ok("OK") }
}
