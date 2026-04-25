package ru.courseproject.analiticsimulator.dto;

import java.util.Map;
import java.util.List;

public record SubmissionRequest(
    Map<String, String> answers,
    List<String> foundErrors,
    String openAnswer
) {}