package microservice.quiz.services;

import microservice.quiz.entities.Quiz;

import java.util.Map;

public interface EvaluationService {

    boolean checkAnswer(Long questionId, String userAnswer);
    int evaluateQuiz(Quiz quiz, Map<Long, String> userAnswers);

}
