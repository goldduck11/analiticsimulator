package ru.courseproject.analiticsimulator.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProgressResponse {
    private int totalScore;
    private int tasksCompleted;
    private int totalTasks;
    private List<UserProgressDto> progressList;
}