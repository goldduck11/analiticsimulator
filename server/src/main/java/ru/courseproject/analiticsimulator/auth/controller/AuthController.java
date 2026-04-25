package ru.courseproject.analiticsimulator.auth.controller;

import io.smallrye.jwt.build.Jwt;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import ru.courseproject.analiticsimulator.auth.service.AuthService;
import ru.courseproject.analiticsimulator.dto.LoginRequest;
import ru.courseproject.analiticsimulator.dto.RegisterRequest;
import ru.courseproject.analiticsimulator.dto.LoginResponse;
import ru.courseproject.analiticsimulator.user.model.User;

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
    public Response login(@Valid LoginRequest authRequest) {
        try {
            User user = authService.authentication(authRequest);
            String token = Jwt.issuer(issuer)
                .upn(user.getId().toString())
                .groups(user.getRole())
                .expiresIn(expirySeconds)
                .sign();

            UserDto userDto = new UserDto(
                user.getId().toString(),
                user.getEmail(),
                user.getName(),
                LocalDateTime.now().toString()
            );

            LoginResponse response = new LoginResponse(token, userDto);
            return Response.ok(response).build();
        } catch (Exception e) {
            return Response.status(Response.Status.UNAUTHORIZED)
                .entity("Неверный email/username или пароль.")
                .build();
        }
    }

    @POST
    @Path("/register")
    public Response register(@Valid RegisterRequest registerRequest) {
        try {
            var authResponse = authService.register(registerRequest);
            String token = Jwt.issuer(issuer)
                .upn(authResponse.id().toString())
                .groups(Set.of("USER"))
                .expiresIn(expirySeconds)
                .sign();

            UserDto userDto = new UserDto(
                authResponse.id().toString(),
                authResponse.email(),
                authResponse.name(),
                LocalDateTime.now().toString()
            );

            LoginResponse response = new LoginResponse(token, userDto);
            return Response.ok(response).build();
        } catch (WebApplicationException e) {
            return Response.status(e.getResponse().getStatus())
                .entity(e.getMessage())
                .build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(e.getMessage())
                .build();
        }
    }
}