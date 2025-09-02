package domain

class ProductService {
    private val data = listOf(
        Product("p1", "Stetoskop Classic", "sprzęt"),
        Product("p2", "Młotek Werner 500g", "narzędzia"),
        Product("p3", "Monitor EKG Pro", "sprzęt"),
        Product("p4", "Rękawice nitrylowe", "materiały"),
        Product("p5", "Szczypce Hartowane", "narzędzia"),
        Product("p6", "Płyn dezynfekujący", "materiały")
    )

    fun categories(): List<String> =
        data.map { it.category }.distinct().sorted()

    fun productsBy(category: String): List<Product> =
        data.filter { it.category.equals(category.trim(), ignoreCase = true) }
}
