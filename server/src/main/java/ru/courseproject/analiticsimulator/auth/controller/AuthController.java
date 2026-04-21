package ru.courseproject.analiticsimulator.auth.controller;

import io.smallrye.jwt.build.Jwt;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import ru.courseproject.analiticsimulator.auth.service.AuthService;
import ru.courseproject.analiticsimulator.dto.AuthResponse;
import ru.courseproject.analiticsimulator.dto.LoginRequest;
import ru.courseproject.analiticsimulator.dto.RegisterRequest;

import java.util.Arrays;
import java.util.HashSet;

@Path("/api/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthController {

    @ConfigProperty(name = "mp.jwt.verify.issuer")
    String issuer;

    @ConfigProperty(name = "auth.jwt.expiry-seconds")
    long expirySeconds;

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @POST
    @Path("/login")
    public Response authentication(@Valid LoginRequest authRequest) {
        try {
            authService.authentication(authRequest);
            String token = Jwt.issuer(issuer)
                    .upn(authRequest.getEmailOrUsername())
                    .groups(new HashSet<>(Arrays.asList("User", "Admin")))
                    .expiresIn(expirySeconds)
                    .sign();
            return Response.ok(token).build();

        } catch (Exception e) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Неверный email/username или пароль.").build();
        }
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
