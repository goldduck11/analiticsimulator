package ru.courseproject.analiticsimulator.user.account.controller;

import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import ru.courseproject.analiticsimulator.dto.UserDto;
import ru.courseproject.analiticsimulator.user.account.service.UserService;

@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class UserController {

    private final UserService userService;
    private final SecurityIdentity securityIdentity;

    public UserController(UserService userService, SecurityIdentity securityIdentity) {
        this.userService = userService;
        this.securityIdentity = securityIdentity;
    }

    @GET
    @Path("/profile")
    public UserDto getProfile() {
        return userService.getUserByEmail(securityIdentity.getPrincipal().getName());
    }
}
