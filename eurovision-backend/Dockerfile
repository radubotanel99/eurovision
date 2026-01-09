# Use a Maven image that supports Java 21+ to build
FROM maven:3.9.6-eclipse-temurin-21 AS build
COPY . .
RUN mvn clean package -DskipTests

# Use an OpenJDK 25 (Early Access/Stable) image to run
# Note: Since Java 25 is very new, we use the specific openjdk tag
FROM openjdk:25-jdk-slim
COPY --from=build /target/*.jar app.jar
EXPOSE 10000
ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=10000"]