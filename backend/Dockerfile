# ============================================
# Backend Dockerfile - Spring Boot (Multi-stage)
# ============================================

# --- Stage 1: Build ---
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias primero (cache de Docker)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar código fuente y compilar
COPY src ./src
RUN mvn clean package -DskipTests -B

# --- Stage 2: Runtime ---
FROM eclipse-temurin:17-jre-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
