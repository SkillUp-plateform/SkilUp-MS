package tic.alma.formationms.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import tic.alma.formationms.dto.FormateurDTO;

import java.util.List;

/**
 * Client to communicate with the Python User Management Service
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class UserServiceClient {

    private final WebClient webClient;

    /**
     * Get all users with 'formateur' role from Keycloak via Python service
     * @return List of formateurs
     */
    public List<FormateurDTO> getAllFormateurs() {
        try {
            return webClient.get()
                    .uri("/api/admin/keycloak/users?role=formateur")
                    .retrieve()
                    .bodyToFlux(FormateurDTO.class)
                    .collectList()
                    .block();
        } catch (Exception e) {
            log.error("Error fetching formateurs from user service: {}", e.getMessage());
            return List.of();
        }
    }

    /**
     * Verify if a Keycloak user ID belongs to a formateur
     * @param keycloakId Keycloak user ID
     * @return true if user has formateur role
     */
    public boolean isFormateur(String keycloakId) {
        try {
            List<FormateurDTO> formateurs = getAllFormateurs();
            return formateurs.stream()
                    .anyMatch(f -> f.getId().equals(keycloakId));
        } catch (Exception e) {
            log.error("Error verifying formateur status: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Get formateur details by Keycloak ID
     * @param keycloakId Keycloak user ID
     * @return FormateurDTO or null if not found
     */
    public FormateurDTO getFormateurById(String keycloakId) {
        try {
            List<FormateurDTO> formateurs = getAllFormateurs();
            return formateurs.stream()
                    .filter(f -> f.getId().equals(keycloakId))
                    .findFirst()
                    .orElse(null);
        } catch (Exception e) {
            log.error("Error fetching formateur by ID: {}", e.getMessage());
            return null;
        }
    }
}
