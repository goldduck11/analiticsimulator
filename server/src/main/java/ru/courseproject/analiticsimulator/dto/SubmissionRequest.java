package ru.courseproject.analiticsimulator.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

/**
 * DTO для отправки ответа на задание
 */
@Data
public class SubmissionRequest {

    @NotBlank(message = "Ответ не может быть пустым")
    @Size(max = 2000, message = "Ответ слишком длинный")
    private String answer;
}