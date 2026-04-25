package ru.courseproject.analiticsimulator.user.account.controller;

import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import ru.courseproject.analiticsimulator.dto.UserProgressDto;
import ru.courseproject.analiticsimulator.user.account.service.UserService;
import ru.courseproject.analiticsimulator.user.pogress.repository.UserProgressRepository;
import ru.courseproject.analiticsimulator.user.pogress.service.UserProgressService;

import java.util.List;

@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class UserController {

    private final UserService userService;
    private final UserProgressService userProgressService;

    public UserController(UserService userService, SecurityIdentity securityIdentity, UserProgressRepository userProgressRepository, UserProgressService userProgressService) {
        this.userService = userService;
        this.userProgressService = userProgressService;
    }

    @POST
    @Path("api/user/profile")
    public List<UserProgressDto> getProfile() {
        return userProgressService.getAllUserTaskWithProgress();
    }
}
