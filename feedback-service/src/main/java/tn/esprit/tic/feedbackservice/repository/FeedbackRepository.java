package tn.esprit.tic.feedbackservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.tic.feedbackservice.entities.Feedback;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback,Long> {
    List<Feedback> findByKeycloakUserId(String keycloakUserId);
}
