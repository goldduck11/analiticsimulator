package ru.courseproject.analiticsimulator.dto;

import lombok.Data;

/**
 * DTO для передачи информации о задании клиенту
 */
@Data
public class TaskDto {

    private Long id;
    private String question;
    private String type;
    private String topicName;
    private String hint;
}