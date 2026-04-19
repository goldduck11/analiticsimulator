package ru.courseproject.analiticsimulator.task.task.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.courseproject.analiticsimulator.dto.SubmissionRequest;
import ru.courseproject.analiticsimulator.dto.SubmissionResult;
import ru.courseproject.analiticsimulator.dto.TaskDto;
import ru.courseproject.analiticsimulator.task.task.service.TaskService;

import java.util.List;

@Tag(name = "Tasks", description = "API for fetching and submitting tasks")
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @Operation(summary = "Get all available tasks")
    @ApiResponse(responseCode = "200", content = @Content(array = @ArraySchema(schema = @Schema(implementation = TaskDto.class))))
    @GetMapping
    public ResponseEntity<List<TaskDto>> getAllTasks() {
        List<TaskDto> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

    @Operation(summary = "Submit task answer")
    @PostMapping("/submit/{taskId}")
    public ResponseEntity<SubmissionResult> submitAnswer(
            @Parameter(description = "Task id", required = true) @PathVariable Long taskId,
            @RequestBody SubmissionRequest submission,
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        SubmissionResult result = taskService.submitAnswer(email, taskId, submission.getAnswer());
        return ResponseEntity.ok(result);
    }
}
