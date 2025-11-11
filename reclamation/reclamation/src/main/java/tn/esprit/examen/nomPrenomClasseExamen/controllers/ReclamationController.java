package tn.esprit.examen.nomPrenomClasseExamen.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.examen.nomPrenomClasseExamen.entities.reclamation;
import tn.esprit.examen.nomPrenomClasseExamen.services.IReclamationService;

import java.util.List;

@RestController // Combines @Controller and @ResponseBody, objects returned are automatically serialized into JSON.
@RequestMapping("/api/reclamations") // Maps all handler methods in this controller to the '/api/reclamations' path.
@RequiredArgsConstructor
public class ReclamationController {

    private final IReclamationService reclamationService;


    @GetMapping
    public ResponseEntity<List<reclamation>> getAllReclamations() {
        List<reclamation> reclamations = reclamationService.getAllReclamations();
        return ResponseEntity.ok(reclamations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<reclamation> getReclamationById(@PathVariable Long id) {
        return reclamationService.getReclamationById(id)
                .map(reclamation -> ResponseEntity.ok(reclamation))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/user/{keycloakUserId}")
    public ResponseEntity<reclamation> createReclamation(
            @PathVariable String keycloakUserId,
            @RequestBody reclamation reclamation) {
        try {
            reclamation createdReclamation = reclamationService.createReclamation(reclamation, keycloakUserId);
            return new ResponseEntity<>(createdReclamation, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<reclamation> updateReclamation(@PathVariable Long id, @RequestBody reclamation reclamationDetails) {
        try {
            reclamation updatedReclamation = reclamationService.updateReclamation(id, reclamationDetails);
            return ResponseEntity.ok(updatedReclamation);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReclamation(@PathVariable Long id) {
        try {
            reclamationService.deleteReclamation(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{keycloakUserId}")
    public ResponseEntity<List<reclamation>> getReclamationsByUserId(@PathVariable String keycloakUserId) {
        List<reclamation> reclamations = reclamationService.getReclamationsByUserId(keycloakUserId);
        return ResponseEntity.ok(reclamations);
    }

}
