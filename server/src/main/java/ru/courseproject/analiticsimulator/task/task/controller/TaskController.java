package ru.courseproject.analiticsimulator.task.task.controller;

import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import ru.courseproject.analiticsimulator.dto.*;
import ru.courseproject.analiticsimulator.task.task.service.TaskService;

import java.util.List;

@Path("/api/tasks")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService, SecurityIdentity securityIdentity) {
        this.taskService = taskService;
    }

    @GET
    @Path("/topics")
    public List<TopicDto> getAllTopics() {
        return taskService.getAllTopics();
    }

    @GET
    @Path("/tasks")
    public List<UserProgressDto> getAllTasks() {
        return taskService.getAllTasksWithProgress();
    }

    @POST
    @Path("/submit/{taskId}")
    public SubmissionResult submitAnswer(@PathParam("taskId") Long taskId, @Valid SubmissionRequest submission) {
        return taskService.submitAnswer(taskId, submission.getAnswer());
    }
}
