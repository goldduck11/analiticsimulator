package ru.courseproject.analiticsimulator.task.service;

import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import ru.courseproject.analiticsimulator.dto.*;
import ru.courseproject.analiticsimulator.task.model.Task;
import ru.courseproject.analiticsimulator.task.repository.TaskRepository;
import ru.courseproject.analiticsimulator.topic.repository.TopicRepository;
import ru.courseproject.analiticsimulator.user.progress.service.UserProgressService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ApplicationScoped
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserProgressService userProgressService;
    private final TopicRepository topicRepository;
    private final SecurityIdentity securityIdentity;

    public TaskService(TaskRepository taskRepository,
                       UserProgressService userProgressService,
                       TopicRepository topicRepository,
                       SecurityIdentity securityIdentity) {
        this.taskRepository = taskRepository;
        this.userProgressService = userProgressService;
        this.topicRepository = topicRepository;
        this.securityIdentity = securityIdentity;
    }

    public List<TaskDto> getAllTasks() {
        return taskRepository.listAll().stream()
            .map(task -> new TaskDto(
                task.getId().toString(),
                task.getQuestion(),
                task.getTaskType().name(),
                task.getComplexity().name(),
                task.getHint()
            ))
            .collect(Collectors.toList());
    }

    public TaskDetailDto getTaskById(Long id) {
        Task task = taskRepository.findByIdOptional(id)
            .orElseThrow(() -> new RuntimeException("Task not found"));

        return new TaskDetailDto(
            task.getId().toString(),
            task.getQuestion(),
            task.getTaskType().name(),
            task.getComplexity().name(),
            task.getHint(),
            task.getAnswer(),
            null,
            null,
            null
        );
    }

    @Transactional
    public SubmissionResultDto submitTask(Long id, SubmissionRequest request) {
        Task task = taskRepository.findById(id);
        String userId = securityIdentity.getPrincipal().getName();

        var result = userProgressService.evaluateAndSave(task, request, userId);

        return new SubmissionResultDto(
            result.submissionId(),
            task.getId().toString(),
            task.getQuestion(),
            result.score(),
            task.getMaxScore(),
            result.feedback(),
            LocalDateTime.now().toString()
        );
    }

    public List<TopicDto> getAllTopics() {
        return topicRepository.listAll().stream()
            .map(topic -> new TopicDto(topic.getId(), topic.getName()))
            .collect(Collectors.toList());
    }

    public UserProgressResponse getUserProgress() {
        return userProgressService.getUserOverallProgress();
    }

    public SubmissionResultDto getResultById(String submissionId) {
        return userProgressService.getResultById(submissionId);
    }
}