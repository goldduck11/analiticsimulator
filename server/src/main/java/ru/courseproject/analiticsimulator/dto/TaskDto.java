package ru.courseproject.analiticsimulator.dto;

public record TaskDto(
    String id,
    String title,
    String type,
    String difficulty,
    String description
) {}