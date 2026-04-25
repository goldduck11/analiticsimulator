package ru.courseproject.analiticsimulator.dto;

public record LoginResponse(
    String token,
    UserDto user
) {}