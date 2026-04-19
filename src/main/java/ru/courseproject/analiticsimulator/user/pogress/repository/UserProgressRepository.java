package ru.courseproject.analiticsimulator.user.pogress.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.courseproject.analiticsimulator.user.pogress.model.UserProgress;

import java.util.List;
import java.util.Optional;

/**
 * Репозиторий для отслеживания прогресса пользователя
 */
@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {

    /**
     * Найти прогресс пользователя по конкретной задаче
     */
    Optional<UserProgress> findByUserIdAndTaskId(Long userId, Long taskId);

    /**
     * Найти весь прогресс пользователя
     */
    List<UserProgress> findByUserId(Long userId);

    /**
     * Найти прогресс пользователя с загрузкой связанных сущностей
     */
    @Query("""
        SELECT up FROM UserProgress up 
        WHERE up.user.id = :userId
        """)
    List<UserProgress> findByUserIdWithDetails(@Param("userId") Long userId);

    /**
     * Обновить прогресс: ответ, статус, баллы
     */
    @Modifying
    @Query("""
        UPDATE UserProgress up 
        SET up.userAnswer = :answer, 
            up.completed = true, 
            up.score = :score, 
            up.completedAt = CURRENT_TIMESTAMP 
        WHERE up.id = :id
        """)
    void updateProgress(@Param("id") Long id,
                        @Param("answer") String answer,
                        @Param("score") int score);

    /**
     * Посчитать общее количество выполненных заданий пользователем
     */
    @Query("SELECT COUNT(up) FROM UserProgress up WHERE up.user.id = :userId AND up.completed = true")
    long countCompletedTasksByUserId(@Param("userId") Long userId);

    /**
     * Посчитать суммарный балл пользователя
     */
    @Query("SELECT COALESCE(SUM(up.score), 0) FROM UserProgress up WHERE up.user.id = :userId")
    int getTotalScoreByUserId(@Param("userId") Long userId);
}