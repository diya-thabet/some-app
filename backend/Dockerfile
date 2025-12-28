# Build Stage
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

# Run Stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Create a non-root user for security (The "Perfect" touch)
RUN addgroup -S hirfa && adduser -S hirfa -G hirfa
USER hirfa

EXPOSE 8080

# Default to Prod (safe) or allow override
ENTRYPOINT ["java", "-jar", "app.jar"]
