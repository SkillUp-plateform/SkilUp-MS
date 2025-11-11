package tn.esprit.tic.feedbackservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.tic.feedbackservice.entities.Feedback;
import tn.esprit.tic.feedbackservice.services.FeedbackService;

import java.util.List;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    @Autowired
    FeedbackService feedbackService;

    @PostMapping("/addFeedback/user/{keycloakUserId}")
    public ResponseEntity<Feedback> addFeedback(
            @PathVariable String keycloakUserId,
            @RequestBody Feedback feedback) {
        try {
            Feedback newFeedback = feedbackService.addFeedback(feedback, keycloakUserId);
            return new ResponseEntity<>(newFeedback, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/deleteFeedback/{id}")
    public void deleteFeedback(@PathVariable Long id){
        feedbackService.deleteFeedback(id);
    }

    @GetMapping("/getFeedbackById/{id}")
    public Feedback getFeedbackById(@PathVariable Long id){
        return feedbackService.getFeedbackById(id);
    }

    @GetMapping("/getAllFeedbacks")
    public List<Feedback> getAllFeedbacks(){
        return feedbackService.getAllFeedbacks();
    }

    @GetMapping("/getFeedbacksByUserId/{keycloakUserId}")
    public ResponseEntity<List<Feedback>> getFeedbacksByUserId(@PathVariable String keycloakUserId) {
        List<Feedback> feedbacks = feedbackService.getFeedbacksByUserId(keycloakUserId);
        return new ResponseEntity<>(feedbacks, HttpStatus.OK);
    }
}
