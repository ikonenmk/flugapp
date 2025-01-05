# Builder code, use Maven to build
FROM maven:3.9.8-eclipse-temurin-21 AS build

# Working directory for build
WORKDIR /app

# Copy all project files
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests -e

# Java version for final image
FROM openjdk:21-slim

# Add volume to hold app data
VOLUME /tmp

# Copy the keystore file for https
COPY src/main/resources/keystore.p12 /app/keystore.p12

# Application's jar file
ARG JAR_FILE=target/*.jar

# Copy jar file from build stage to final image
COPY --from=build /app/${JAR_FILE} app.jar

EXPOSE 8080 8443

ENTRYPOINT ["java", "-jar", "/app.jar"]