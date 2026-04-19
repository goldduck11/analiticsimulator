package ru.courseproject.analiticsimulator.user.account.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.courseproject.analiticsimulator.user.account.model.User;

import java.util.Optional;

/**
 * Репозиторий для работы с пользователями
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Найти пользователя по email
     */
    Optional<User> findByEmail(String email);

    /**
     * Проверить, существует ли пользователь с таким email
     */
    boolean existsByEmail(String email);

    /**
     * Получить пользователя с его прогрессом (ленивая загрузка, но можно переопределить через JOIN)
     */
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.progressList WHERE u.email = :email")
    Optional<User> findByEmailWithProgress(@Param("email") String email);
}