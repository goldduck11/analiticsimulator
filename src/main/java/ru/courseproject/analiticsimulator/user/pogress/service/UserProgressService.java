package ru.courseproject.analiticsimulator.user.pogress.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.courseproject.analiticsimulator.task.task.model.Task;
import ru.courseproject.analiticsimulator.user.account.model.User;
import ru.courseproject.analiticsimulator.user.pogress.model.UserProgress;
import ru.courseproject.analiticsimulator.user.pogress.repository.UserProgressRepository;
import ru.courseproject.analiticsimulator.user.account.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserProgressService {

    private final UserProgressRepository progressRepository;
    private final UserRepository userRepository;

    /**
     * Сохраняет или обновляет прогресс пользователя при сдаче задания.
     * Проверяет тип задания и начисляет баллы.
     */
    @Transactional
    public UserSubmissionResult saveProgress(String userEmail, Task task, String userAnswer) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        UserProgress existing = progressRepository.findByUserIdAndTaskId(user.getId(), task.getId())
                .orElse(null);

        if (existing != null && existing.isCompleted()) {
            return new UserSubmissionResult(false, existing.getScore(),
                    "Вы уже выполнили это задание", true);
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

        String message = isCorrect ? "Правильно! Баллы начислены." : "Неверно. Попробуйте ещё раз.";

        return new UserSubmissionResult(isCorrect, score, message, false);
    }

    /**
     * Проверка ответа в зависимости от типа задания
     */
    private boolean checkAnswer(Task task, String userAnswer) {
        if (userAnswer == null || userAnswer.trim().isEmpty()) {
            return false;
        }

        return switch (task.getType()) {
            case TEST -> userAnswer.trim().equalsIgnoreCase(task.getAnswer().trim());
            case ERROR_DETECTION -> userAnswer.trim().equalsIgnoreCase(task.getAnswer().trim());
            case PRACTICE -> true; //
        };
    }

    /**
     * DTO результата проверки (внутренний класс)
     */
    public record UserSubmissionResult(
            boolean correct,
            int score,
            String message,
            boolean alreadyCompleted
    ) {}
}