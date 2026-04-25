package ru.courseproject.analiticsimulator.dto;

import java.util.List;

public record UserProgressResponse(
    int totalScore,
    int completedTasks,
    int totalTasks,
    List<HistoryItemDto> history
) {}

public record HistoryItemDto(
    String taskId,
    String taskTitle,
    String taskType,
    int score,
    int maxScore,
    String date
) {}

