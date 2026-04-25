package ru.courseproject.analiticsimulator.user.account.controller;

import io.quarkus.security.Authenticated;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import ru.courseproject.analiticsimulator.dto.UserProgressDto;
import ru.courseproject.analiticsimulator.user.account.service.UserService;
import ru.courseproject.analiticsimulator.user.pogress.service.UserProgressService;

import java.util.List;

@Path("/api/user")
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class UserController {

    private final UserService userService;
    private final UserProgressService userProgressService;

    public UserController(UserService userService, UserProgressService userProgressService) {
        this.userService = userService;
        this.userProgressService = userProgressService;
    }

    @GET
    @Path("/profile")
    public List<UserProgressDto> getProfile() {
        return userProgressService.getAllUserTaskWithProgress();
    }
}