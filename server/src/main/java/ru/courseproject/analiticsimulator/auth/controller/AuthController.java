package ru.courseproject.analiticsimulator.auth.controller;

import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import ru.courseproject.analiticsimulator.auth.service.AuthService;
import ru.courseproject.analiticsimulator.dto.AuthResponse;
import ru.courseproject.analiticsimulator.dto.LoginRequest;
import ru.courseproject.analiticsimulator.dto.RegisterRequest;

@Path("/api/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @POST
    @Path("/login")
    public Response authentication(@Valid LoginRequest authRequest) {
        AuthResponse response = authService.authentication(authRequest);
        if (response == null) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Invalid username/email or password.").build();
        }
        return Response.ok(response).build();
    }

    @POST
    @Path("/register")
    public Response register(@Valid RegisterRequest registerRequest) {
        AuthResponse response = authService.register(registerRequest);
        if (response == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Email or username already exists.").build();
        }
        return Response.ok(response).build();
    }
}
