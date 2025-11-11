package microservice.quiz.services;

import microservice.quiz.configuration.RabbitMQConfig;
import microservice.quiz.repository.QuizRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class FormationConsumer {

    @Autowired
    QuizRepository quizRepository;
    @Transactional
    @RabbitListener(queues = RabbitMQConfig.QUIZ_FORMATION_QUEUE, containerFactory =
            "rabbitListenerContainerFactory")
    public void receiveFormationEvent(Map<String, Object> event) {
        try {
            String type = (String) event.get("type");
            Long formationId = ((Number) event.get("formationId")).longValue();

            if ("FORMATION_DELETED".equals(type)) {
                System.out.println("Suppression des quiz liés à la formation " + formationId);
                quizRepository.deleteAllByFormationId(formationId);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


}
