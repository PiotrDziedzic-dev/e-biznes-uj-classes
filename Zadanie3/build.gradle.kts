plugins {
    kotlin("jvm") version "1.9.24"
    application
}

repositories { mavenCentral() }

dependencies {
    // Discord (Kord)
    implementation("dev.kord:kord-core:0.13.1")

    // Ktor
    val ktor = "2.3.12"
    implementation("io.ktor:ktor-server-netty:$ktor")
    implementation("io.ktor:ktor-server-core:$ktor")
    implementation("io.ktor:ktor-server-status-pages:$ktor")
    implementation("io.ktor:ktor-server-content-negotiation:$ktor")
    implementation("io.ktor:ktor-serialization-kotlinx-json:$ktor")
    implementation("io.ktor:ktor-client-core:$ktor")
    implementation("io.ktor:ktor-client-cio:$ktor")

    // Env
    implementation("io.github.cdimascio:dotenv-kotlin:6.4.1")

    // Tests
    testImplementation(kotlin("test"))
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.2")
}

tasks.test { useJUnitPlatform() }

kotlin { jvmToolchain(17) }

application { mainClass.set("app.MainKt") }
