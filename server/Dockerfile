# 1. Сборка
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /build

COPY pom.xml .
COPY src ./src

# Собираем с флагом uber-jar. Это создаст ОДИН исполняемый файл в папке target
RUN mvn package -DskipTests -Dquarkus.package.type=uber-jar

# 2. Запуск
FROM eclipse-temurin:17-jre
WORKDIR /deployments

# Копируем всё из target (там будет наш большой jar)
COPY --from=build /build/target/ .

EXPOSE 8080

# Запускаем файл, который заканчивается на -runner.jar
# (флаг uber-jar гарантирует, что этот файл будет иметь манифест)
CMD sh -c "java -jar *-runner.jar"