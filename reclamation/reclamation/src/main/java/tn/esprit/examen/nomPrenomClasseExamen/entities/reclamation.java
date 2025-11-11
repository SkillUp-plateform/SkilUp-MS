package tn.esprit.examen.nomPrenomClasseExamen.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import lombok.Data;

@Entity
@Data
@Getter
@Setter
public class reclamation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Keycloak ID of the user (with 'user' role) who created the reclamation
    private String keycloakUserId;

    private String title;
    private String description;
    private String status; // e.g., "OPEN", "IN_PROGRESS", "CLOSED"
}
