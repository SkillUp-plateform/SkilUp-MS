package microservice.quiz.repository;

import microservice.quiz.entities.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    void deleteAllByFormationId(Long formationId);
    List<Quiz> findAllByFormationId (Long formationId);

}
