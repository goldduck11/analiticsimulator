package ru.courseproject.analiticsimulator.user.pogress.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import ru.courseproject.analiticsimulator.task.task.model.Task;
import ru.courseproject.analiticsimulator.user.account.model.User;
import ru.courseproject.analiticsimulator.user.account.repository.UserRepository;
import ru.courseproject.analiticsimulator.user.pogress.model.UserProgress;
import ru.courseproject.analiticsimulator.user.pogress.repository.UserProgressRepository;

@ApplicationScoped
public class UserProgressService {

    private final UserProgressRepository progressRepository;
    private final UserRepository userRepository;

    public UserProgressService(UserProgressRepository progressRepository, UserRepository userRepository) {
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public UserSubmissionResult saveProgress(String userEmail, Task task, String userAnswer) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProgress existing = progressRepository.findByUserIdAndTaskId(user.getId(), task.getId())
                .orElse(null);

        if (existing != null && existing.isCompleted()) {
            return new UserSubmissionResult(false, existing.getScore(),
                    "Task already completed", true);
        }

        boolean isCorrect = checkAnswer(task, userAnswer);
        int score = isCorrect ? task.getMaxScore() : 0;

        UserProgress progress = existing != null ? existing : new UserProgress();
        progress.setUser(user);
        progress.setTask(task);
        progress.setUserAnswer(userAnswer);
        progress.setCompleted(isCorrect);
        progress.setScore(score);

        progressRepository.save(progress);

        String message = isCorrect ? "Correct. Score added." : "Incorrect. Try again.";
        return new UserSubmissionResult(isCorrect, score, message, false);
    }

    private boolean checkAnswer(Task task, String userAnswer) {
        if (userAnswer == null || userAnswer.trim().isEmpty()) {
            return false;
        }

        return switch (task.getType()) {
            case TEST, ERROR_DETECTION -> userAnswer.trim().equalsIgnoreCase(task.getAnswer().trim());
            case PRACTICE -> true;
        };
    }

    public record UserSubmissionResult(
            boolean correct,
            int score,
            String message,
            boolean alreadyCompleted
    ) {
    }
}
