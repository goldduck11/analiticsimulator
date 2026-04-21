package ru.courseproject.analiticsimulator.user.account.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import ru.courseproject.analiticsimulator.user.account.model.User;

import java.util.Optional;

@ApplicationScoped
public class UserRepository implements PanacheRepository<User> {

    public Optional<User> findByEmail(String email) {
        return find("email", email).firstResultOptional();
    }

    public User findByEmailOrUsername(String email, String username) {
        return find("email = ?1 OR username = ?2", email, username).firstResult();
    }

    public boolean existsByEmail(String email) {
        return count("email", email) > 0;
    }

    public boolean existsByUsername(String username) {
        return count("username", username) > 0;
    }

    public boolean existsByEmailAndUsername(String email, String username) {
        return count("email = ?1 AND username = ?2", email, username) > 0;
    }

    public boolean existsByEmailOrUsername(String email, String username) {
        return count("email = ?1 OR username = ?2", email, username) > 0;
    }

    public Optional<User> findByEmailWithProgress(String email) {
        return getEntityManager().createQuery(
                        "SELECT u FROM User u LEFT JOIN FETCH u.progressList WHERE u.email = :email", User.class)
                .setParameter("email", email)
                .getResultStream()
                .findFirst();
    }

    @Transactional
    public void save(User user) {
        persist(user);
    }
}
