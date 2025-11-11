package microservice.quiz.repository;

import microservice.quiz.entities.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findAllByQuizId (Long quizId);
}
