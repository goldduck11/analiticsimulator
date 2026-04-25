package ru.courseproject.analiticsimulator.dto;

import java.util.List;
import java.util.Map;

public record TaskDetailDto(
    String id,
    String title,
    String type,
    String difficulty,
    String description,
    String content,
    List<QuestionDto> questions,
    List<ArtifactDto> artifacts,
    String artifactTemplate
) {}

public record QuestionDto(
    String id,
    String question,
    List<OptionDto> options,
    String correctOptionId
) {}

public record OptionDto(
    String id,
    String text
) {}

public record ArtifactDto(
    String id,
    String text,
    boolean hasError,
    String errorDescription
) {}