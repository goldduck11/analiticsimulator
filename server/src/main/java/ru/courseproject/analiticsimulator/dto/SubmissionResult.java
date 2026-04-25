package ru.courseproject.analiticsimulator.dto;

import java.util.List;

public record SubmissionResult(
    String submissionId,
    String taskId,
    String taskTitle,
    int score,
    int maxScore,
    FeedbackDto feedback,
    String completedAt
) {}

public record FeedbackDto(
    int correct,
    int total,
    List<FeedbackDetailDto> details
) {}

public record FeedbackDetailDto(
    String questionId,
    boolean isCorrect,
    String correctAnswer
) {}