package microservice.quiz.services;

import microservice.quiz.entities.Question;

import java.util.List;

public interface QuestionService {

    Question addQuestion(Long quizId, Question question);
    List<Question> getAllQuestion ();
    void deleteQuestion (Long id);
    List<Question> getQuestionsByQuiz(Long quizId);
}
