package tn.esprit.tic.feedbackservice.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.tic.feedbackservice.client.UserServiceClient;
import tn.esprit.tic.feedbackservice.entities.Feedback;
import tn.esprit.tic.feedbackservice.repository.FeedbackRepository;

import java.util.List;

@Service
@Slf4j
public class FeedbackServiceImpl implements FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @Autowired
    private UserServiceClient userServiceClient;

    @Override
    public Feedback addFeedback(Feedback feedback, String keycloakUserId) {
        // Verify that the user exists and has 'user' role
        if (!userServiceClient.isUser(keycloakUserId)) {
            log.error("User {} is not a valid user", keycloakUserId);
            throw new IllegalArgumentException("User is not a valid user");
        }
        
        feedback.setKeycloakUserId(keycloakUserId);
        Feedback saved = feedbackRepository.save(feedback);
        log.info("Feedback created with ID {} by user {}", saved.getId(), keycloakUserId);
        return saved;
    }

    @Override
    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }

    @Override
    public Feedback getFeedbackById(Long id) {
        return feedbackRepository.findById(id).orElse(null);
    }

    @Override
    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    @Override
    public List<Feedback> getFeedbacksByUserId(String keycloakUserId) {
        return feedbackRepository.findByKeycloakUserId(keycloakUserId);
    }
}

