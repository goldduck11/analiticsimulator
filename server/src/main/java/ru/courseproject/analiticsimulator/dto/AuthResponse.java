package ru.courseproject.analiticsimulator.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private Long id;
    private String username;
    private String name;
    private String email;
}
