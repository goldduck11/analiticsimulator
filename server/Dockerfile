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
EXPOSE 5005

CMD ["sh", "-c", "if [ \"$JAVA_ENABLE_DEBUG\" = \"true\" ]; then DEBUG_OPTS=\"-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:${JAVA_DEBUG_PORT:-5005}\"; fi; exec java $DEBUG_OPTS -jar /deployments/quarkus-run.jar"]
