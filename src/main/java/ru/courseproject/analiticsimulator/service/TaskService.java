package ru.courseproject.analiticsimulator.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.courseproject.analiticsimulator.dto.SubmissionResult;
import ru.courseproject.analiticsimulator.dto.TaskDto;
import ru.courseproject.analiticsimulator.model.Task;
import ru.courseproject.analiticsimulator.repository.TaskRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserProgressService userProgressService;

    public List<TaskDto> getAllTasks() {
        return taskRepository.findAllWithTopic().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public Task getTaskById(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Задание не найдено: " + taskId));
    }

    @Transactional
    public SubmissionResult submitAnswer(String userEmail, Long taskId, String answer) {
        Task task = getTaskById(taskId);
        UserProgressService.UserSubmissionResult result = userProgressService.saveProgress(userEmail, task, answer);

        // ✅ Возвращаем DTO из пакета dto
        return new SubmissionResult(
                result.correct(),
                result.score(),
                result.message(),
                result.alreadyCompleted()
        );
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