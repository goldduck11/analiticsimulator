package ru.courseproject.analiticsimulator.task.topic.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import ru.courseproject.analiticsimulator.task.topic.model.Topic;

@ApplicationScoped
public class TopicRepository implements PanacheRepository<Topic> {
}
