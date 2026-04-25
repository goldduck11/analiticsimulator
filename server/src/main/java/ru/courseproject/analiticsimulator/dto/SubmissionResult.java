package ru.courseproject.analiticsimulator.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

/**
 * DTO для результата проверки ответа на задание
 */
@Data
@AllArgsConstructor
public class SubmissionResult {
    private boolean correct;
    private int score;
    private String message;
    private boolean alreadyCompleted;
}