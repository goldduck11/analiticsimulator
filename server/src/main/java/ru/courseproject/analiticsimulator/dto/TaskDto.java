package ru.courseproject.analiticsimulator.dto;

import lombok.Data;
import ru.courseproject.analiticsimulator.user.pogress.model.UserProgress;

import java.io.Serializable;

/**
 * DTO для передачи информации о задании клиенту
 */
@Data
public class TaskDto {

    private Long taskId;
    private String question;
    private Long topicId;
    private String taskType;
    private String complexity;

}