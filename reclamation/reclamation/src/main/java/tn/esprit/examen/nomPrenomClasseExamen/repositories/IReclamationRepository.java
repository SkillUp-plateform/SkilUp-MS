package tn.esprit.examen.nomPrenomClasseExamen.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.examen.nomPrenomClasseExamen.entities.reclamation;

import java.util.List;

public interface IReclamationRepository  extends JpaRepository<reclamation, Long> {
    List<reclamation> findByKeycloakUserId(String keycloakUserId);
}
