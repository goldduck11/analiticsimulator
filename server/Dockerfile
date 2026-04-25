# 1. Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /build

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn package -DskipTests

# 2. Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /deployments

COPY --from=build /build/target/quarkus-app/ /deployments/

EXPOSE 8080

CMD ["java", "-jar", "/deployments/quarkus-run.jar"]