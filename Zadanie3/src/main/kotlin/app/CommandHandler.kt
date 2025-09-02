package app

import domain.ProductService
import dev.kord.core.behavior.channel.MessageChannelBehavior

class CommandHandler(
    private val productService: ProductService
) {

    fun respond(content: String): String? {
        val trimmed = content.trim()
        if (!trimmed.startsWith("!")) return null

        val parts = trimmed.split(Regex("\\s+"), limit = 2)
        val cmd = parts.firstOrNull()?.lowercase() ?: return null

        return when (cmd) {
            "!pomoc" -> """
                Dostępne komendy:
                • !kategorie
                • !produkty <kategoria>
                • !powiedz <tekst>
            """.trimIndent()

            "!kategorie" -> {
                val cats = productService.categories()
                if (cats.isEmpty()) "Brak kategorii."
                else "Kategorie: " + cats.joinToString(", ")
            }

            "!produkty" -> {
                val arg = parts.getOrNull(1)?.trim()
                if (arg.isNullOrBlank()) {
                    "Użycie: `!produkty <kategoria>`"
                } else {
                    val items = productService.productsBy(arg)
                    if (items.isEmpty()) {
                        "Brak produktów w kategorii: $arg"
                    } else {
                        val lines = items.joinToString("\n") { "• ${it.name} (id=${it.id})" }
                        "Produkty w kategorii '${arg}':\n$lines"
                    }
                }
            }

            "!powiedz" -> {
                val text = parts.getOrNull(1)?.takeIf { it.isNotBlank() } ?: "(pusto)"
                text
            }

            else -> null
        }
    }


    suspend fun handle(content: String, channel: MessageChannelBehavior) {
        val reply = respond(content) ?: return
        channel.createMessage(reply)
    }
}
