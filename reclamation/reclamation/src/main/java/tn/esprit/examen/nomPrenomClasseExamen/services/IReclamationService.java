package tn.esprit.examen.nomPrenomClasseExamen.services;

import tn.esprit.examen.nomPrenomClasseExamen.entities.reclamation;

import java.util.List;
import java.util.Optional;

public interface IReclamationService {

    List<reclamation> getAllReclamations();

    Optional<reclamation> getReclamationById(Long id);

    reclamation createReclamation(reclamation reclamation, String keycloakUserId);

    reclamation updateReclamation(Long id, reclamation reclamationDetails);

    void deleteReclamation(Long id);

    List<reclamation> getReclamationsByUserId(String keycloakUserId);

}
