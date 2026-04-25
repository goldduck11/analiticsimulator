package ru.courseproject.analiticsimulator.user.account.service;

import jakarta.enterprise.context.ApplicationScoped;
import ru.courseproject.analiticsimulator.dto.UserDto;
import ru.courseproject.analiticsimulator.user.account.model.User;
import ru.courseproject.analiticsimulator.user.account.repository.UserRepository;

@ApplicationScoped
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDto(user);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User getUserEntityByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public boolean existsByEmailOrUsername(String username, String email) {
        return userRepository.existsByEmailOrUsername(username, email);
    }

    public UserDto getUserByIdentity(Long identity) {
        User user = userRepository.findById(identity);
        return mapToDto(user);
    }

    private UserDto mapToDto(User user) {
        UserDto dto = new UserDto();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        return dto;
    }
}
