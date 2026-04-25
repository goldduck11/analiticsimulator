package ru.courseproject.analiticsimulator.user.progress.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import ru.courseproject.analiticsimulator.dto.*;
import ru.courseproject.analiticsimulator.task.model.Task;
import ru.courseproject.analiticsimulator.user.model.User;
import ru.courseproject.analiticsimulator.user.repository.UserRepository;
import ru.courseproject.analiticsimulator.progress.model.UserProgress;
import ru.courseproject.analiticsimulator.progress.repository.UserProgressRepository;

import java.time.LocalDateTime;
import java.util.*;

@ApplicationScoped
public class UserProgressService {

    private final UserProgressRepository progressRepository;
    private final UserRepository userRepository;

    public UserProgressService(UserProgressRepository progressRepository,
                               UserRepository userRepository) {
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public SubmissionResultDto evaluateAndSave(Task task, SubmissionRequest request, String userIdStr) {
        Long userId = Long.valueOf(userIdStr);
        User user = userRepository.findById(userId);
        UserProgress existing = progressRepository.findByUserIdAndTaskId(userId, task.getId())
            .orElse(null);

        if (existing != null && existing.isCompleted()) {
            return getResultFromProgress(existing, task);
        }

        boolean isCorrect = checkAnswer(task, request);
        int score = isCorrect ? task.getMaxScore() : 0;

        UserProgress progress = Optional.ofNullable(existing)
            .orElseGet(() -> new UserProgress());

        progress.setUser(user);
        progress.setTask(task);
        progress.setUserAnswer(request.openAnswer() != null ? request.openAnswer() : request.answers().toString());
        progress.setCompleted(isCorrect);
        progress.setScore(score);
        if (progress.getId() == null) {
            progressRepository.persist(progress);
        }

        return buildResultDto(progress, task, isCorrect, score);
    }

    private boolean checkAnswer(Task task, SubmissionRequest request) {
        return switch (task.getTaskType()) {
            case TEST -> {
                String selected = request.answers().values().iterator().next();
                yield selected != null && selected.equals(task.getAnswer());
            }
            case ERROR_DETECTION -> {
                String found = request.foundErrors().get(0);
                yield found != null && found.equals(task.getAnswer());
            }
            case PRACTICE -> {
                String answer = request.openAnswer();
                if (task.getExpectedKeywords() == null || task.getExpectedKeywords().isEmpty()) {
                    yield true;
                }
                yield Arrays.stream(task.getExpectedKeywords().split("\\|"))
                    .anyMatch(kw -> answer.toLowerCase().contains(kw.trim().toLowerCase()));
            }
        };
    }

    private SubmissionResultDto buildResultDto(UserProgress p, Task t, boolean correct, int score) {
        FeedbackDto feedback = new FeedbackDto(
            correct ? 1 : 0,
            1,
            List.of(new FeedbackDetailDto(t.getId().toString(), correct, t.getAnswer()))
        );

        return new SubmissionResultDto(
            "sub_" + System.currentTimeMillis(),
            t.getId().toString(),
            t.getQuestion(),
            score,
            t.getMaxScore(),
            feedback,
            LocalDateTime.now().toString()
        );
    }

    private SubmissionResultDto getResultFromProgress(UserProgress p, Task t) {
        FeedbackDto feedback = new FeedbackDto(
            1,
            1,
            List.of(new FeedbackDetailDto(t.getId().toString(), true, t.getAnswer()))
        );

        return new SubmissionResultDto(
            "sub_" + p.getId(),
            t.getId().toString(),
            t.getQuestion(),
            p.getScore(),
            t.getMaxScore(),
            feedback,
            p.getCompletedAt().toString()
        );
    }

    public UserProgressResponse getUserOverallProgress() {
        Long userId = getCurrentUserId();
        List<UserProgress> progresses = progressRepository.findByUserId(userId);
        int totalScore = progresses.stream().mapToInt(UserProgress::getScore).sum();
        int completedTasks = progresses.size();
        int totalTasks = Math.max(completedTasks, 6); // заглушка

        List<HistoryItemDto> history = progresses.stream()
            .map(p -> new HistoryItemDto(
                p.getTask().getId().toString(),
                p.getTask().getQuestion(),
                p.getTask().getTaskType().name(),
                p.getScore(),
                p.getTask().getMaxScore(),
                p.getCompletedAt().toString()
            ))
            .collect(Collectors.toList());

        return new UserProgressResponse(totalScore, completedTasks, totalTasks, history);
    }

    public SubmissionResultDto getResultById(String submissionId) {
        return getUserOverallProgress().history().stream()
            .filter(h -> h.taskId().equals(submissionId.replace("sub_", "")))
            .findFirst()
            .map(h -> new SubmissionResultDto(
                submissionId,
                h.taskId(),
                h.taskTitle(),
                h.score(),
                h.maxScore(),
                new FeedbackDto(1, 1, List.of(new FeedbackDetailDto(h.taskId(), true, "N/A"))),
                LocalDateTime.now().toString()
            ))
            .orElseThrow(() -> new RuntimeException("Result not found"));
    }

    private Long getCurrentUserId() {
        return 1L; // заглушка — в реальности из SecurityIdentity
    }
}