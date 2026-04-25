package ru.courseproject.analiticsimulator.auth.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.WebApplicationException;
import org.mindrot.jbcrypt.BCrypt;
import ru.courseproject.analiticsimulator.dto.AuthResponse;
import ru.courseproject.analiticsimulator.dto.LoginRequest;
import ru.courseproject.analiticsimulator.dto.RegisterRequest;
import ru.courseproject.analiticsimulator.user.account.model.User;
import ru.courseproject.analiticsimulator.user.account.repository.UserRepository;

import javax.naming.AuthenticationException;
import java.util.Set;

@ApplicationScoped
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User authentication(LoginRequest loginRequest) throws AuthenticationException {
        User user = userRepository.findByEmailOrUsername(loginRequest.getEmailOrUsername(), loginRequest.getEmailOrUsername());
        if (user == null || !BCrypt.checkpw(loginRequest.getPassword(), user.getPassword())) {
            throw new AuthenticationException("Неверное имя пользователя или пароля");
        }
        return user;
    }

    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmailOrUsername(registerRequest.getEmail(), registerRequest.getUsername())) {
            throw new WebApplicationException("Email или username уже существуют", 409);
        }

        String password = registerRequest.getPassword();
        if (password == null || password.length() < 8) {
            throw new IllegalArgumentException("Пароль должен быть не менее 8 символов");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());

        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt(12));
        user.setPassword(hashedPassword);

        user.setRole(Set.of("USER"));

        userRepository.save(user);
        return new AuthResponse(user.getId(), user.getUsername(), user.getName(), user.getEmail());
    }
}