package ru.courseproject.analiticsimulator.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
public class UserProgressDto extends TaskDto {

    private boolean isCompleted;
    private Integer score;
    private LocalDateTime lastAttemptAt;
}
