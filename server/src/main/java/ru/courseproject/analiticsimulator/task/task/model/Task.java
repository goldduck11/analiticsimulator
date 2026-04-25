package ru.courseproject.analiticsimulator.task.task.model;

import jakarta.persistence.*;
import lombok.*;
import ru.courseproject.analiticsimulator.task.task.enums.ComplexityType;
import ru.courseproject.analiticsimulator.task.task.enums.TaskType;
import ru.courseproject.analiticsimulator.task.topic.model.Topic;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String question;

    @Column(columnDefinition = "TEXT")
    private String answer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Column(columnDefinition = "TEXT")
    private String hint;

    private TaskType taskType;

    @Column(name = "max_score")
    private int maxScore = 100;

    private ComplexityType complexity;
}