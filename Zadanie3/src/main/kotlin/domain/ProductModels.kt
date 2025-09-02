package domain

@kotlinx.serialization.Serializable
data class Product(
    val id: String,
    val name: String,
    val category: String
)
