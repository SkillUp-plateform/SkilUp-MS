package microservice.quiz.services;

import microservice.quiz.entities.Question;
import microservice.quiz.entities.Quiz;
import microservice.quiz.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EvaluationServiceImpl implements EvaluationService{

    @Autowired
    QuestionRepository questionRepository;
    @Override
    public boolean checkAnswer(Long questionId, String userAnswer) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        return question.getCorrectAnswer().equalsIgnoreCase(userAnswer);
    }

    // Évaluation complète d'un quiz (retourne le score)
    @Override
    public int evaluateQuiz(Quiz quiz, Map<Long, String> userAnswers) {
        int score = 0;
        for (Question q : quiz.getQuestions()) {
            String answer = userAnswers.get(q.getId());
            if (answer != null && q.getCorrectAnswer().equalsIgnoreCase(answer)) {
                score++;
            }
        }
        return score;
    }
}


