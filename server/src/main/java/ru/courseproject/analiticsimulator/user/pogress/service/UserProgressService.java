package ru.courseproject.analiticsimulator.user.pogress.service;

import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import ru.courseproject.analiticsimulator.dto.UserProgressDto;
import ru.courseproject.analiticsimulator.task.task.model.Task;
import ru.courseproject.analiticsimulator.task.task.repository.TaskRepository;
import ru.courseproject.analiticsimulator.user.account.model.User;
import ru.courseproject.analiticsimulator.user.account.repository.UserRepository;
import ru.courseproject.analiticsimulator.user.pogress.model.UserProgress;
import ru.courseproject.analiticsimulator.user.pogress.repository.UserProgressRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ApplicationScoped
public class UserProgressService {

    private final UserProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final SecurityIdentity securityIdentity;
    private final UserProgressRepository userProgressRepository;
    private final TaskRepository taskRepository;

    public UserProgressService(UserProgressRepository progressRepository, UserRepository userRepository, SecurityIdentity securityIdentity, UserProgressRepository userProgressRepository, TaskRepository taskRepository) {
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
        this.securityIdentity = securityIdentity;
        this.userProgressRepository = userProgressRepository;
        this.taskRepository = taskRepository;
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
        String principalName = securityIdentity.getPrincipal().getName();
        User user = userRepository.findByIdOptional(Long.valueOf(principalName))
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<UserProgress> userProgressList = userProgressRepository.findByUserId(user.getId());
        Map<Long, UserProgress> progressByTaskId = userProgressList.stream()
                .collect(Collectors.toMap(up -> up.getTask().getId(), up -> up, (a, b) -> a));

        List<UserProgressDto> result = taskRepository.findAllWithTopic()
                .stream()
                .map(task -> mapTaskWithProgress(task, progressByTaskId.get(task.getId())))
                .collect(Collectors.toList());
        return result;
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
        userProgressDto.setTopicId(userProgress.getTask().getTopic().getId());
        userProgressDto.setTaskType(userProgress.getTask().getTaskType().name());
        userProgressDto.setComplexity(userProgress.getTask().getComplexity() != null
                ? userProgress.getTask().getComplexity().name()
                : null);
        userProgressDto.setScore(userProgress.getScore());
        userProgressDto.setCompleted(userProgress.isCompleted());
        return userProgressDto;
    }

    private UserProgressDto mapTaskWithProgress(Task task, UserProgress userProgress) {
        UserProgressDto dto = new UserProgressDto();
        dto.setTaskId(task.getId());
        dto.setQuestion(task.getQuestion());
        dto.setTopicId(task.getTopic().getId());
        dto.setTaskType(task.getTaskType().name());
        dto.setComplexity(task.getComplexity() != null ? task.getComplexity().name() : null);
        if (userProgress != null) {
            dto.setScore(userProgress.getScore());
            dto.setCompleted(userProgress.isCompleted());
        } else {
            dto.setScore(0);
            dto.setCompleted(false);
        }
        return dto;
    }

}
