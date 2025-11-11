package tn.esprit.tic.feedbackservice.services;

import tn.esprit.tic.feedbackservice.entities.Feedback;

import java.util.List;

public interface FeedbackService {
    Feedback addFeedback(Feedback feedback, String keycloakUserId);
    void deleteFeedback(Long id);
    Feedback getFeedbackById(Long id);
    List<Feedback> getAllFeedbacks();
    List<Feedback> getFeedbacksByUserId(String keycloakUserId);
}
