import play.sbt.PlayImport._

ThisBuild / scalaVersion     := "3.3.1"
ThisBuild / organization     := "com.example"
ThisBuild / version          := "0.1.0"

lazy val root = (project in file("."))
  .enablePlugins(PlayScala)
  .settings(
    name := "play-scala3-crud",
    libraryDependencies ++= Seq(
      guice,
      "com.typesafe.play" %% "play-filters-helpers" % play.core.PlayVersion.current
    ),
    scalacOptions ++= Seq("-deprecation", "-feature", "-unchecked")
  )
