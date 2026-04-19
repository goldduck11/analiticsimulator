package ru.courseproject.analiticsimulator.task.topic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.courseproject.analiticsimulator.task.topic.model.Topic;

/**
 * Репозиторий для работы с темами заданий
 */
@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
}