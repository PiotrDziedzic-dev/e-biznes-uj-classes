package app

import dev.kord.core.Kord
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.on
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import domain.ProductService
import http.startHttpServer
import io.github.cdimascio.dotenv.dotenv
import kotlinx.coroutines.runBlocking

@OptIn(PrivilegedIntent::class) // <<< pozwala użyć Intent.MessageContent
fun main() = runBlocking {
    val env = dotenv {
        ignoreIfMalformed = true
        ignoreIfMissing = true
    }
    val token = System.getenv("DISCORD_TOKEN") ?: env["DISCORD_TOKEN"]
    require(!token.isNullOrBlank()) { "Brak DISCORD_TOKEN w env/.env" }

    val port = (System.getenv("PORT") ?: env["PORT"] ?: "8080").toInt()
    startHttpServer(port = port)

    val kord = Kord(token)
    val productService = ProductService()
    val handler = CommandHandler(productService)

    kord.on<MessageCreateEvent> {
        if (message.author?.isBot == true) return@on
        val content = message.content
        println("MSG from ${message.author?.username}: $content")
        handler.handle(content, message.channel)
    }

    println("Bot uruchomiony. Czekam na wiadomości...")

    kord.login {
        intents {
            +Intent.Guilds
            +Intent.GuildMessages
            +Intent.MessageContent
        }
    }
}
