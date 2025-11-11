package microservice.quiz.controller;

import lombok.AllArgsConstructor;
import microservice.quiz.entities.Question;
import microservice.quiz.services.QuestionServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/questions")
@AllArgsConstructor
public class QuestionController {
    @Autowired
    QuestionServiceImpl questionService;

    @PostMapping("/questions/{quizId}")
    public Question addQuestion(@PathVariable("quizId") Long quizId, @RequestBody Question question) {
        return questionService.addQuestion(quizId, question);
    }
    @GetMapping("/allQuestions")
    public List<Question> getAllQuestions (){
        return questionService.getAllQuestion();
    }

    @GetMapping("/questionByQuiz/{quizId}")
    public List<Question> getAllQuestionsByQuiz(@PathVariable("quizId") Long quizId){
        return questionService.getQuestionsByQuiz(quizId);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteQuestion (@PathVariable("id") Long id) {
        questionService.deleteQuestion(id);
    }

}
