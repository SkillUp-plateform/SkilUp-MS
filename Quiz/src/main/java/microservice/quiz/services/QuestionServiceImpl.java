package microservice.quiz.services;

import microservice.quiz.entities.Question;
import microservice.quiz.entities.Quiz;
import microservice.quiz.repository.QuestionRepository;
import microservice.quiz.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionServiceImpl implements QuestionService{
    @Autowired
    QuestionRepository questionRepository;
    @Autowired
    QuizRepository quizRepository;
    @Override
    public Question addQuestion(Long quizId, Question question) {
        Quiz quiz = quizRepository.findById(quizId).get();
        quiz.getQuestions().add(question);
        quizRepository.save(quiz);
        question.setQuiz(quiz);
        return questionRepository.save(question);
    }

    @Override
    public List<Question> getAllQuestion() {
        return questionRepository.findAll();
    }

    @Override
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);

    }
    @Override
    public List<Question> getQuestionsByQuiz(Long quizId) {
        return questionRepository.findAllByQuizId(quizId);
    }
}
