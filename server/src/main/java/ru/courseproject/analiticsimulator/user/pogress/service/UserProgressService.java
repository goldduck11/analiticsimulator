package ru.courseproject.analiticsimulator.user.pogress.service;

import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import ru.courseproject.analiticsimulator.dto.UserProgressDto;
import ru.courseproject.analiticsimulator.task.task.model.Task;
import ru.courseproject.analiticsimulator.user.account.model.User;
import ru.courseproject.analiticsimulator.user.account.repository.UserRepository;
import ru.courseproject.analiticsimulator.user.pogress.model.UserProgress;
import ru.courseproject.analiticsimulator.user.pogress.repository.UserProgressRepository;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class UserProgressService {

    private final UserProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final SecurityIdentity securityIdentity;
    private final UserProgressRepository userProgressRepository;

    public UserProgressService(UserProgressRepository progressRepository, UserRepository userRepository, SecurityIdentity securityIdentity, UserProgressRepository userProgressRepository) {
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
        this.securityIdentity = securityIdentity;
        this.userProgressRepository = userProgressRepository;
    }

    @Transactional
    public UserSubmissionResult saveProgress( Task task, String userAnswer) {
        Long userId = Long.valueOf(securityIdentity.getPrincipal().getName());
        User user = userRepository.findByIdOptional(userId)
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

        String message = isCorrect ? "Верный ответ." : "Ответ неверный. Попробуйте ещё раз.";
        return new UserSubmissionResult(isCorrect, score, message, false);
    }

    public List<UserProgressDto> getAllUserTaskWithProgress() {
        User user = userRepository.findByIdOptional(Long.valueOf(securityIdentity.getPrincipal().getName()))
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userProgressRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public record UserSubmissionResult(
            boolean correct,
            int score,
            String message,
            boolean alreadyCompleted
    ) {
    }


    private boolean checkAnswer(Task task, String userAnswer) {
        if (userAnswer == null || userAnswer.trim().isEmpty()) {
            return false;
        }

        return switch (task.getTaskType()) {
            case TEST, ERROR_DETECTION -> userAnswer.trim().equalsIgnoreCase(task.getAnswer().trim());
            case PRACTICE -> true;
        };
    }

    private UserProgressDto mapToDto(UserProgress userProgress) {
        UserProgressDto userProgressDto = new UserProgressDto();
        userProgressDto.setTaskId(userProgress.getTask().getId());
        userProgressDto.setQuestion(userProgress.getTask().getQuestion());
        userProgressDto.setScore(userProgress.getScore());
        userProgressDto.setCompleted(userProgress.isCompleted());
        return userProgressDto;
    }

}
