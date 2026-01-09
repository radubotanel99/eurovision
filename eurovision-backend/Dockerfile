# 1. Use Java 25 for the build stage (instead of the Maven image)
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app
COPY . .

# Make the maven wrapper executable and build
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# 2. Use Java 25 for the run stage
FROM eclipse-temurin:25-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 10000
ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=10000"]