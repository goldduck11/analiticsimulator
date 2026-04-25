package ru.courseproject.analiticsimulator.task.task.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import ru.courseproject.analiticsimulator.task.task.model.Task;

import java.util.List;

@ApplicationScoped
public class TaskRepository implements PanacheRepository<Task> {

    public List<Task> findAllByOrderById() {
        return list("ORDER BY id");
    }

//    public List<Task> findBy(TaskType type) {
//        return list("type", type);
//    }

    public List<Task> findByTopicId(Long topicId) {
        return list("topic.id", topicId);
    }

//    public List<Task> findByTypeAndTopicId(TaskType type, Long topicId) {
//        return list("type = ?1 AND topic.id = ?2", type, topicId);
//    }

    public List<Task> findAllWithTopic() {
        return getEntityManager().createQuery(
                        "SELECT t FROM Task t LEFT JOIN FETCH t.topic ORDER BY t.id", Task.class)
                .getResultList();
    }
}
