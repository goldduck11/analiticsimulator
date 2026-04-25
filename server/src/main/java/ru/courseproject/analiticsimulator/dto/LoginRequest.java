package ru.courseproject.analiticsimulator.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serializable;

@Data
public class LoginRequest {

    @NotBlank
    private String emailOrUsername;

    @NotBlank
    private String password;
}
