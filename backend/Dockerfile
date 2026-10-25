# ==============================================================================
# Multi-stage Dockerfile for Spring Boot 3.4 (Java 21) Backend
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Application
# ------------------------------------------------------------------------------
FROM eclipse-temurin:21-jdk-jammy AS builder

WORKDIR /app

# Install curl, unzip, and Gradle directly to avoid wrapper connection timeouts in container
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl unzip && \
    curl -fsSL --retry 5 --retry-delay 3 https://services.gradle.org/distributions/gradle-9.5.1-bin.zip -o /tmp/gradle.zip && \
    unzip -q /tmp/gradle.zip -d /opt && \
    ln -s /opt/gradle-9.5.1/bin/gradle /usr/local/bin/gradle && \
    rm /tmp/gradle.zip && \
    rm -rf /var/lib/apt/lists/*

# Force IPv4 for Gradle to avoid IPv6 timeouts on container bridge networks
ENV GRADLE_OPTS="-Djava.net.preferIPv4Stack=true -Djava.net.preferIPv6Addresses=false"

# Copy build configuration first to cache dependencies
COPY settings.gradle build.gradle ./

# Download dependencies to cache them in a dedicated Docker layer
RUN gradle dependencies --no-daemon || true

# Copy application source code
COPY src ./src

# Build production jar excluding tests (tests run in CI pipeline)
RUN gradle bootJar --no-daemon -x test

# ------------------------------------------------------------------------------
# Stage 2: Runtime Image
# ------------------------------------------------------------------------------
FROM eclipse-temurin:21-jre-jammy AS runner

WORKDIR /app

# Install curl for container health check
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Run as an unprivileged non-root user for enhanced security
RUN groupadd -r spring && useradd -r -g spring -u 1001 spring

# Copy the built jar artifact from builder stage
COPY --from=builder --chown=spring:spring /app/build/libs/*.jar app.jar

# Switch to non-root user
USER spring:spring

# Configure JVM flags optimized for container environments
ENV SERVER_PORT=8080 \
    JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

EXPOSE 8080

# Health check verifies the Spring Boot HTTP server is responding
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -s -f http://localhost:8080/swagger-ui.html || exit 1

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
