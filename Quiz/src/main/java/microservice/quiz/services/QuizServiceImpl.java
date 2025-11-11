package microservice.quiz.services;

import microservice.quiz.entities.FormationDto;
import microservice.quiz.entities.Quiz;
import microservice.quiz.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizServiceImpl implements QuizService {
    @Autowired
    QuizRepository quizRepository;
    @Autowired
    FormationClient formationClient;


    @Override
    public Quiz createQuiz(Long formationId,Quiz quiz) {
        FormationDto formation = formationClient.getFormationById(formationId);
        if (formation == null) {
            throw new RuntimeException("Formation not found : " + formationId);
        }
        quiz.setFormationId(formation.getId());
        return quizRepository.save(quiz);
    }
    @Override
    public Quiz getQuiz(Long id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
    }


    @Override
    public List<Quiz> getAllQuizzesByFormation(Long formationId) {

        return quizRepository.findAllByFormationId(formationId);
    }

    @Override
    public void deleteQuiz(Long id) {
        quizRepository.deleteById(id);
    }
}
