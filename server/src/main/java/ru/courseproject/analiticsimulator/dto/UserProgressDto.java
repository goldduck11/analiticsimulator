package ru.courseproject.analiticsimulator.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class UserProgressDto extends TaskDto {

    private boolean isCompleted;
    private Integer score;
}
