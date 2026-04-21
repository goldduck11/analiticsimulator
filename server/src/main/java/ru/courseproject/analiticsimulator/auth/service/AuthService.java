package ru.courseproject.analiticsimulator.auth.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import org.mindrot.jbcrypt.BCrypt;
import ru.courseproject.analiticsimulator.dto.AuthResponse;
import ru.courseproject.analiticsimulator.dto.LoginRequest;
import ru.courseproject.analiticsimulator.dto.RegisterRequest;
import ru.courseproject.analiticsimulator.user.account.model.User;
import ru.courseproject.analiticsimulator.user.account.repository.UserRepository;

@ApplicationScoped
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthResponse authentication(LoginRequest loginRequest) {
        User user = userRepository.findByEmailOrUsername(loginRequest.getEmailOrUsername(), loginRequest.getEmailOrUsername());
        if (user == null || !BCrypt.checkpw(loginRequest.getPassword(), user.getPassword())) {
            return null;
        }
        return new AuthResponse(user.getId(), user.getUsername(), user.getName(), user.getEmail());
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
        user.setRole("USER");

        userRepository.save(user);
        return new AuthResponse(user.getId(), user.getUsername(), user.getName(), user.getEmail());
    }
}
