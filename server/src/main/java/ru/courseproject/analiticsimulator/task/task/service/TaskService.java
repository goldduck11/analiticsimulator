package ru.courseproject.analiticsimulator.task.task.service;

import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import ru.courseproject.analiticsimulator.dto.SubmissionResult;
import ru.courseproject.analiticsimulator.dto.TaskDto;
import ru.courseproject.analiticsimulator.dto.UserProgressDto;
import ru.courseproject.analiticsimulator.dto.TopicDto;
import ru.courseproject.analiticsimulator.task.task.model.Task;
import ru.courseproject.analiticsimulator.task.task.repository.TaskRepository;
import ru.courseproject.analiticsimulator.user.pogress.model.UserProgress;
import ru.courseproject.analiticsimulator.user.pogress.service.UserProgressService;

import java.util.Collections;
import java.util.List;

@ApplicationScoped
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserProgressService  userProgressService;

    public TaskService(TaskRepository taskRepository, UserProgressService userProgressService, SecurityIdentity securityIdentity) {
        this.taskRepository = taskRepository;
        this.userProgressService = userProgressService;
    }

    public List<UserProgressDto> getAllTasksWithProgress() {
        return userProgressService.getAllUserTaskWithProgress();
    }

    public Task getTaskById(Long taskId) {
        return taskRepository.findByIdOptional(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found: " + taskId));
    }

    @Transactional
    public SubmissionResult submitAnswer(Long taskId, String answer) {
        Task task = getTaskById(taskId);
        UserProgressService.UserSubmissionResult result = userProgressService.saveProgress(task, answer);
        return new SubmissionResult(result.correct(), result.score(), result.message(), result.alreadyCompleted());
    }

    private <T extends TaskDto> T mapToTaskDto(Task task, T dto) {
        dto.setTaskId(task.getId());
        dto.setQuestion(task.getQuestion());
        dto.setTopicId(task.getTopic().getId());
        return dto;
    }

    private UserProgressDto mapToTaskProgressDto(UserProgress userProgress) {
        UserProgressDto taskProgressDto = mapToTaskDto(userProgress.getTask(), new UserProgressDto());
        taskProgressDto.setCompleted(userProgress.isCompleted());
        taskProgressDto.setScore(userProgress.getScore());
        return taskProgressDto;
    }

    public List<TopicDto> getAllTopics() {
        return Collections.emptyList();
    }
}
