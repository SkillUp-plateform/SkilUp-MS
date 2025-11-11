package microservice.quiz.services;

import microservice.quiz.entities.Quiz;

import java.util.List;

public interface QuizService {

    Quiz createQuiz(Long formationId,Quiz quiz);
    Quiz getQuiz(Long id);
    List<Quiz> getAllQuizzesByFormation(Long formationId);
    void deleteQuiz (Long id);
}
