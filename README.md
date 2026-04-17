src/
└── main/
    ├── java/ru/courseproject/analiticsimulator/
    │   │
    │   ├── AnaliticsimulatorApplication.java     ← @SpringBootApplication
    │   │
    │   ├── config/
    │   │   ├── SecurityConfig.java               ← Настройка Spring Security + JWT
    │   │   ├── WebConfig.java                    ← CORS, форматы и т.п.
    │   │   └── SwaggerConfig.java                ← OpenAPI (для документации API)
    │   │
    │   ├── controller/
    │   │   ├── AuthController.java               ← /api/auth/login, /register
    │   │   ├── UserController.java               ← /api/user/profile
    │   │   └── TaskController.java               ← /api/tasks, /submit
    │   │
    │   ├── service/
    │   │   ├── UserService.java
    │   │   ├── TaskService.java
    │   │   └── UserProgressService.java
    │   │
    │   ├── repository/
    │   │   ├── UserRepository.java
    │   │   ├── TaskRepository.java
    │   │   └── UserProgressRepository.java
    │   │
    │   ├── model/
    │   │   ├── User.java                         ← @Entity
    │   │   ├── Task.java
    │   │   ├── UserProgress.java
    │   │   ├── Topic.java
    │   │   └── TaskType.java                     ← enum
    │   │
    │   ├── dto/
    │   │   ├── LoginRequest.java
    │   │   ├── RegisterRequest.java
    │   │   ├── TaskDto.java
    │   │   └── ProgressResponse.java
    │   │
    │   ├── security/
    │   │   ├── JwtTokenProvider.java             ← Генерация и валидация JWT
    │   │   ├── CustomUserDetailsService.java
    │   │   └── JwtAuthFilter.java                ← Фильтр для проверки токена
    │   │
    │   └── util/
    │       └── SampleDataLoader.java             ← @Component + @PostConstruct → загрузка тестовых заданий
    │
    └── resources/
        ├── application.yml                       ← Настройки БД, server.port и т.д.
        ├── data.sql                              ← Начальные данные (опционально)
        ├── schema.sql                            ← DDL таблиц
        └── import.sql                            ← Альтернатива data.sql (если используется H2 для dev)