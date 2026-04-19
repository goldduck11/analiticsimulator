package ru.courseproject.analiticsimulator.user.pogress.model;

import jakarta.persistence.*;
import lombok.*;
import ru.courseproject.analiticsimulator.task.task.model.Task;
import ru.courseproject.analiticsimulator.user.account.model.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @Column(columnDefinition = "TEXT")
    private String userAnswer;

    private boolean completed = false;

    private int score = 0;

    private LocalDateTime completedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        if (completed && completedAt == null) {
            completedAt = LocalDateTime.now();
        }
    }
}