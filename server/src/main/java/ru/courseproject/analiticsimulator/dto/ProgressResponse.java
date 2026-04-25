package ru.courseproject.analiticsimulator.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * DTO для ответа с прогрессом пользователя: общий счёт, количество выполненных заданий, детали по задачам
 */
@Data
public class ProgressResponse {

    private int totalScore;
    private int tasksCompleted;
    private int totalTasks;
    private List<TaskProgressDto> taskProgressList;

    @Data
    public static class TaskProgressDto {
        private Long taskId;
        private Long topicId;
        private boolean completed;
        private Integer score;
        private String userAnswer;
    }
}