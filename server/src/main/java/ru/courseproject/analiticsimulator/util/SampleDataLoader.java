package ru.courseproject.analiticsimulator.util;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import ru.courseproject.analiticsimulator.task.task.enums.TaskType;
import ru.courseproject.analiticsimulator.task.task.repository.TaskRepository;
import ru.courseproject.analiticsimulator.task.topic.model.Topic;
import ru.courseproject.analiticsimulator.task.topic.repository.TopicRepository;
import ru.courseproject.analiticsimulator.task.task.model.Task;

import java.util.List;

/**
 * Утилита для загрузки начальных данных (темы и задания) при запуске приложения.
 * Работает только если в БД нет ни одной темы.
 */
@Component
@RequiredArgsConstructor
public class SampleDataLoader implements CommandLineRunner {

    private final TopicRepository topicRepository;
    private final TaskRepository taskRepository;

    @Override
    public void run(String... args) throws Exception {
        if (topicRepository.count() == 0) {
            loadSampleData();
        }
    }

    private void loadSampleData() {
        // Создаём темы
        Topic sql = new Topic();
        sql.setName("SQL");
        topicRepository.save(sql);

        Topic metrics = new Topic();
        metrics.setName("Метрики и аналитика");
        topicRepository.save(metrics);

        Topic validation = new Topic();
        validation.setName("Валидация данных");
        topicRepository.save(validation);

        taskRepository.saveAll(List.of(
                createTask("Какой запрос выбирает все записи из таблицы users?", "SELECT * FROM users;", TaskType.TEST, sql),
                createTask("Какая команда используется для фильтрации строк в SQL?", "WHERE", TaskType.TEST, sql),
                createTask("Что делает JOIN в SQL?", "Объединяет таблицы по условию", TaskType.TEST, sql),

                createTask("Найдите ошибку: SELECT * FORM users;", "FORM", TaskType.ERROR_DETECTION, sql),
                createTask("Исправьте синтаксис: SELEC * FROM orders WHERE price > 100;", "SELEC", TaskType.ERROR_DETECTION, sql),
                createTask("Где ошибка: UPDATE users SET name = 'John' WERE id = 1;", "WERE", TaskType.ERROR_DETECTION, sql),

                createOpenTask(
                        "Рассчитайте DAU за вчера на основе таблицы events.",
                        "Напишите SQL-запрос или опишите логику подсчёта DAU (Daily Active Users).",
                        metrics),
                createOpenTask(
                        "Предложите метрику для оценки качества онбординга нового пользователя.",
                        "Опишите, какую метрику вы бы использовали и почему.",
                        metrics),
                createOpenTask(
                        "Как проверить, что рост числа регистраций не вызван ботами?",
                        "Опишите подход к валидации данных и выявлению аномалий.",
                        validation),
                createOpenTask(
                        "Как доказать, что A/B-тест корректен?",
                        "Опишите, какие проверки вы бы провели перед анализом результатов.",
                        validation)
        ));

        System.out.println("✅ Тестовые данные успешно загружены в базу.");
    }

    private Task createTask(String question, String answer, TaskType type, Topic topic) {
        Task task = new Task();
        task.setQuestion(question);
        task.setAnswer(answer);
        task.setType(type);
        task.setTopic(topic);
        return task;
    }

    private Task createOpenTask(String question, String hint, Topic topic) {
        Task task = new Task();
        task.setQuestion(question);
        task.setAnswer("Эталонный ответ будет добавлен позже или оценен вручную.");
        task.setType(TaskType.PRACTICE);
        task.setTopic(topic);
        task.setHint(hint);
        return task;
    }
}