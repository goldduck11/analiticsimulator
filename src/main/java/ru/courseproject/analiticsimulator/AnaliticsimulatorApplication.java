package ru.courseproject.analiticsimulator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * Главный класс приложения "Аналитик-тренажёр".
 *
 * Запускает Spring Boot-приложение со следующими возможностями:
 * - Регистрация и аутентификация (JWT)
 * - Просмотр и выполнение заданий (3 типа: тест, ошибка, практика)
 * - Отслеживание прогресса и начисление баллов
 * - REST API + Swagger UI
 *
 * После запуска:
 * - API доступно по: http://localhost:8080/api
 * - Документация Swagger: http://localhost:8080/swagger-ui.html
 * - База данных: PostgreSQL (настраивается через application.yml)
 */
@SpringBootApplication
@ComponentScan(basePackages = "ru.courseproject.analiticsimulator")
public class AnaliticsimulatorApplication {

    public static void main(String[] args) {
        System.out.println("🚀 Запуск тренажёра аналитика...");
        SpringApplication.run(AnaliticsimulatorApplication.class, args);
        System.out.println("""
                =============================================================
                ✅ Приложение успешно запущено!
                
                📚 API: http://localhost:8080/api
                📘 Swagger: http://localhost:8080/swagger-ui.html
                🔐 Аутентификация: /api/auth/login, /api/auth/register
                
                💡 Убедитесь, что PostgreSQL запущен.
                =============================================================
                """);
    }
}