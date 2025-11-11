package tic.alma.formationms.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tic.alma.formationms.entities.Formation;
import tic.alma.formationms.services.FormationService;

import java.util.List;

@RestController
@RequestMapping("/formation")
// @CrossOrigin removed - Gateway handles CORS
public class FormationController {

    private final FormationService formationService;

    @Autowired
    public FormationController(FormationService formationService) {
        this.formationService = formationService;
    }

    @PostMapping("/add/formateur/{keycloakFormateurId}")
    public ResponseEntity<Formation> addFormation(
            @PathVariable String keycloakFormateurId,
            @RequestBody Formation formation) {
        try {
            // Ensure ID is null for new entities (frontend may send -1)
            formation.setId(null);
            Formation newFormation = formationService.addFormation(formation, keycloakFormateurId);
            return new ResponseEntity<>(newFormation, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/update/{id}/formateur/{keycloakFormateurId}")
    public ResponseEntity<Formation> updateFormation(
            @PathVariable Long id,
            @PathVariable String keycloakFormateurId,
            @RequestBody Formation formation) {
        try {
            Formation updatedFormation = formationService.updateFormation(id, formation, keycloakFormateurId);
            if (updatedFormation != null) {
                return new ResponseEntity<>(updatedFormation, HttpStatus.OK);
            }
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete/{id}")
    public void deleteFormation(@PathVariable Long id) {
        formationService.deleteFormation(id);
    }

    @GetMapping("/get/{id}")
    public Formation getFormationById(@PathVariable Long id) {
        return formationService.getFormationById(id);
    }

    @GetMapping("/all")
    public List<Formation> getAllFormations() {
        return formationService.getAllFormations();
    }

    @GetMapping("/formateur/{keycloakFormateurId}")
    public ResponseEntity<List<Formation>> getFormationsByFormateur(
            @PathVariable String keycloakFormateurId) {
        List<Formation> formations = formationService.getFormationsByFormateur(keycloakFormateurId);
        return new ResponseEntity<>(formations, HttpStatus.OK);
    }

    @Value("${welcome.message}")
    private String welcomeMessage;
    @GetMapping("/welcome")
    public String welcome() {
        return welcomeMessage;
    }

}
