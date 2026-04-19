package ru.courseproject.analiticsimulator.dto;

import lombok.Data;

/**
 * DTO для передачи данных пользователя (без пароля)
 */
@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
}