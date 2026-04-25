package ru.courseproject.analiticsimulator.auth.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import org.mindrot.jbcrypt.BCrypt;
import ru.courseproject.analiticsimulator.dto.AuthResponse;
import ru.courseproject.analiticsimulator.dto.LoginRequest;
import ru.courseproject.analiticsimulator.dto.RegisterRequest;
import ru.courseproject.analiticsimulator.user.account.model.User;
import ru.courseproject.analiticsimulator.user.account.repository.UserRepository;

import javax.naming.AuthenticationException;
import java.util.List;

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
            return null;
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(BCrypt.hashpw(registerRequest.getPassword(), BCrypt.gensalt()));

        userRepository.save(user);
        return new AuthResponse(user.getId(), user.getUsername(), user.getName(), user.getEmail());
    }
}
