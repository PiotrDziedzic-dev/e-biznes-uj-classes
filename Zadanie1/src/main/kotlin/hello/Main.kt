package hello


import java.sql.DriverManager


fun main() {
    println("Hello, World! from Kotlin on Ubuntu + Python3.10 + Java8 + Gradle")
    println("Java: " + System.getProperty("java.version"))
    println("Kotlin: " + KotlinVersion.CURRENT)


// Test JDBC SQLite in-memory
    val url = "jdbc:sqlite::memory:"
    DriverManager.getConnection(url).use { conn ->
        conn.createStatement().use { st ->
            st.executeUpdate("CREATE TABLE t(id INTEGER PRIMARY KEY, name TEXT);")
            st.executeUpdate("INSERT INTO t(name) VALUES ('Alice'), ('Bob');")
            st.executeQuery("SELECT COUNT(*) c FROM t").use { rs ->
                if (rs.next()) println("SQLite rows: ${rs.getInt("c")}")
            }
        }
    }
}