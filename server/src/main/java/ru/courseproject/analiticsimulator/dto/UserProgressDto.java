package ru.courseproject.analiticsimulator.dto;

import lombok.Data;

@Data
public class UserProgressDto {
    private Long taskId;
    private String question;
    private Long topicId;
    private String taskType;
    private String complexity;
    private boolean isCompleted;
    private Integer score;
}