package microservice.quiz.controller;

import lombok.AllArgsConstructor;
import microservice.quiz.entities.Quiz;
import microservice.quiz.services.EvaluationServiceImpl;
import microservice.quiz.services.QuizServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/evaluations")
@AllArgsConstructor
public class EvaluationController {

    @Autowired
    EvaluationServiceImpl evaluationService;
    @Autowired
    QuizServiceImpl quizService;

    // Vérifier une réponse et donner le résultat directement
    @PostMapping("/questions/{questionId}/answer")
    public Map<String, Object> checkAnswer(@PathVariable Long questionId,
                                           @RequestParam String answer) {
        boolean isCorrect = evaluationService.checkAnswer(questionId, answer);
        return Map.of(
                "questionId", questionId,
                "userAnswer", answer,
                "isCorrect", isCorrect
        );
    }

    // Évaluer tout un quiz
    @PostMapping("/quiz/{quizId}/submit")
    public Map<String, Object> submitQuiz(@PathVariable Long quizId,
                                          @RequestBody Map<Long, String> answers) {
        Quiz quiz = quizService.getQuiz(quizId);
        int score = evaluationService.evaluateQuiz(quiz, answers);
        return Map.of(
                "quizId", quizId,
                "totalQuestions", quiz.getQuestions().size(),
                "score", score
        );
    }
}
