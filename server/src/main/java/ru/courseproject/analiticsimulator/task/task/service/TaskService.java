package ru.courseproject.analiticsimulator.task.task.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import ru.courseproject.analiticsimulator.dto.SubmissionResult;
import ru.courseproject.analiticsimulator.dto.TaskDto;
import ru.courseproject.analiticsimulator.task.task.model.Task;
import ru.courseproject.analiticsimulator.task.task.repository.TaskRepository;
import ru.courseproject.analiticsimulator.user.pogress.service.UserProgressService;

import java.util.List;

@ApplicationScoped
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserProgressService userProgressService;

    public TaskService(TaskRepository taskRepository, UserProgressService userProgressService) {
        this.taskRepository = taskRepository;
        this.userProgressService = userProgressService;
    }

    public List<TaskDto> getAllTasks() {
        return taskRepository.findAllWithTopic().stream()
                .map(this::mapToDto)
                .toList();
    }

    public Task getTaskById(Long taskId) {
        return taskRepository.findByIdOptional(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found: " + taskId));
    }

    @Transactional
    public SubmissionResult submitAnswer(String userEmail, Long taskId, String answer) {
        Task task = getTaskById(taskId);
        UserProgressService.UserSubmissionResult result = userProgressService.saveProgress(userEmail, task, answer);
        return new SubmissionResult(result.correct(), result.score(), result.message(), result.alreadyCompleted());
    }

    private TaskDto mapToDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setQuestion(task.getQuestion());
        dto.setType(task.getType().name());
        dto.setTopicName(task.getTopic().getName());
        dto.setHint(task.getHint());
        return dto;
    }
}
