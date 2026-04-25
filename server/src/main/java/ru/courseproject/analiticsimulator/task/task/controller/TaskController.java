package ru.courseproject.analiticsimulator.task.controller;

import io.quarkus.security.Authenticated;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import ru.courseproject.analiticsimulator.dto.*;
import ru.courseproject.analiticsimulator.task.service.TaskService;

import java.util.List;

@Path("/api/tasks")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GET
    public List<TaskDto> getAllTasks() {
        return taskService.getAllTasks();
    }

    @GET
    @Path("/{id}")
    public TaskDetailDto getTaskById(@PathParam("id") Long id) {
        return taskService.getTaskById(id);
    }

    @POST
    @Path("/{id}/submit")
    public SubmissionResultDto submitTask(
        @PathParam("id") Long id,
        @Valid SubmissionRequest request
    ) {
        return taskService.submitTask(id, request);
    }

    @GET
    @Path("/topics")
    public List<TopicDto> getAllTopics() {
        return taskService.getAllTopics();
    }
}

@Path("/api/user")
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class ProgressController {

    private final TaskService taskService;

    public ProgressController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GET
    @Path("/progress")
    public UserProgressResponse getProgress() {
        return taskService.getUserProgress();
    }
}

@Path("/api/results")
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class ResultController {

    private final TaskService taskService;

    public ResultController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GET
    @Path("/{id}")
    public SubmissionResultDto getResultById(@PathParam("id") String submissionId) {
        return taskService.getResultById(submissionId);
    }
}