package ru.courseproject.analiticsimulator.user.pogress.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import ru.courseproject.analiticsimulator.user.pogress.model.UserProgress;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class UserProgressRepository implements PanacheRepository<UserProgress> {

    public Optional<UserProgress> findByUserIdAndTaskId(Long userId, Long taskId) {
        return find("user.id = ?1 AND task.id = ?2", userId, taskId).firstResultOptional();
    }

    public List<UserProgress> findByUserId(Long userId) {
        return list("user.id", userId);
    }

    public List<UserProgress> findByUserIdWithDetails(Long userId) {
        return getEntityManager().createQuery(
                        "SELECT up FROM UserProgress up WHERE up.user.id = :userId", UserProgress.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    @Transactional
    public void updateProgress(Long id, String answer, int score) {
        update("userAnswer = ?1, completed = true, score = ?2, completedAt = CURRENT_TIMESTAMP WHERE id = ?3",
                answer, score, id);
    }

    public long countCompletedTasksByUserId(Long userId) {
        return count("user.id = ?1 AND completed = true", userId);
    }

    public int getTotalScoreByUserId(Long userId) {
        Integer total = getEntityManager().createQuery(
                        "SELECT COALESCE(SUM(up.score), 0) FROM UserProgress up WHERE up.user.id = :userId", Integer.class)
                .setParameter("userId", userId)
                .getSingleResult();
        return total == null ? 0 : total;
    }

    @Transactional
    public void save(UserProgress userProgress) {
        if (userProgress.getId() == null) {
            persist(userProgress);
        }
    }
}
