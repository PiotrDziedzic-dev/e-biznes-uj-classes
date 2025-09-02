package http

import app.CommandHandler
import domain.ProductService
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable

fun startHttpServer(port: Int = 8090) =
    embeddedServer(Netty, port = port) {
        install(ContentNegotiation) { json() }

        val productService = ProductService()
        val handler = CommandHandler(productService)

        routing {
            get("/health") { call.respond(mapOf("status" to "ok")) }

            @Serializable data class SimulateRequest(val content: String)
            @Serializable data class SimulateResponse(val reply: String)

            post("/simulate") {
                val body = call.receiveNullable<SimulateRequest>()
                val reply = handler.respond(body?.content ?: "")
                call.respond(SimulateResponse(reply ?: ""))
            }
        }
    }.start(wait = false)
