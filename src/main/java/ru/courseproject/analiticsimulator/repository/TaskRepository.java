// src/main/java/ru/courseproject/analiticsimulator/repository/TaskRepository.java
package ru.courseproject.analiticsimulator.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.courseproject.analiticsimulator.model.Task;
import ru.courseproject.analiticsimulator.model.TaskType;

import java.util.List;

/**
 * Репозиторий для работы с заданиями
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    /**
     * Найти все задания, отсортированные по ID
     */
    List<Task> findAllByOrderById();

    /**
     * Найти задания по типу (использует enum TaskType)
     */
    List<Task> findByType(TaskType type);

    /**
     * Найти задания по теме (по topic.id)
     */
    List<Task> findByTopicId(Long topicId);

    /**
     * Найти задания по типу и теме
     * Использует enum TaskType и ID темы
     */
    List<Task> findByTypeAndTopicId(TaskType type, Long topicId);

    /**
     * Получить все задания с информацией о теме (JOIN для оптимизации)
     */
    @Query("""
        SELECT t FROM Task t 
        LEFT JOIN FETCH t.topic 
        ORDER BY t.id
        """)
    List<Task> findAllWithTopic();
}