package ru.courseproject.analiticsimulator.dto;

public record UserDto(
    String id,
    String email,
    String name,
    String createdAt
) {}