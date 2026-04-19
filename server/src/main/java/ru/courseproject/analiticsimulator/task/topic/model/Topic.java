package ru.courseproject.analiticsimulator.task.topic.model;

import jakarta.persistence.*;
import lombok.*;
import ru.courseproject.analiticsimulator.task.task.model.Task;

import java.util.List;

@Entity
@Table(name = "topics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Task> tasks;
}