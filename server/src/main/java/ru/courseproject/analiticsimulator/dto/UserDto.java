package ru.courseproject.analiticsimulator.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * DTO для передачи данных пользователя (без пароля)
 */
@Data
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String password;
}