package ru.courseproject.analiticsimulator.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import ru.courseproject.analiticsimulator.dto.TaskDto;
import ru.courseproject.analiticsimulator.dto.SubmissionRequest;
import ru.courseproject.analiticsimulator.dto.SubmissionResult;
import ru.courseproject.analiticsimulator.service.TaskService;

import java.util.List;

@Tag(name = "Задания", description = "API для получения и сдачи заданий")
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearer-jwt")
public class TaskController {

    private final TaskService taskService;

    @Operation(summary = "Получить все доступные задания")
    @ApiResponse(responseCode = "200", content = @Content(array = @ArraySchema(schema = @Schema(implementation = TaskDto.class))))
    @GetMapping
    public ResponseEntity<List<TaskDto>> getAllTasks() {
        List<TaskDto> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

    @Operation(summary = "Сдать ответ на задание")
    @PostMapping("/submit/{taskId}")
    public ResponseEntity<SubmissionResult> submitAnswer(
            @Parameter(description = "ID задания", required = true) @PathVariable Long taskId,
            @RequestBody SubmissionRequest submission,
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        SubmissionResult result = taskService.submitAnswer(email, taskId, submission.getAnswer());
        return ResponseEntity.ok(result);
    }
}