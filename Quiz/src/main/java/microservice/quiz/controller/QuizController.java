package microservice.quiz.controller;

import lombok.AllArgsConstructor;
import microservice.quiz.entities.Quiz;
import microservice.quiz.services.QuizServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quizzes")
@AllArgsConstructor
public class QuizController {

    @Autowired
    QuizServiceImpl quizService;

    @PostMapping("/create/{formationId}")
    public Quiz createQuiz(@PathVariable("formationId") Long formationId,@RequestBody Quiz quiz) {
        return quizService.createQuiz(formationId,quiz);
    }

    @GetMapping("/getAllQuizzes/{formationId}")
    public List<Quiz> getAllQuizzesByFormation(@PathVariable ("formationId") Long formationId) {
        return quizService.getAllQuizzesByFormation(formationId);
    }

    @GetMapping("/getQuiz/{id}")
    public Quiz getQuiz(@PathVariable("id") Long id) {
        return quizService.getQuiz(id);
    }

    @DeleteMapping("/deleteQuiz/{id}")
    public void deleteQuiz (@PathVariable("id") Long id){
        quizService.deleteQuiz(id);
    }
}
