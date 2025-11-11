package tn.esprit.tic.feedbackservice.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import tn.esprit.tic.feedbackservice.dto.UserDTO;

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
     * Get all users with 'user' role from Keycloak via Python service
     * @return List of users
     */
    public List<UserDTO> getAllUsers() {
        try {
            return webClient.get()
                    .uri("/api/admin/keycloak/users?role=user")
                    .retrieve()
                    .bodyToFlux(UserDTO.class)
                    .collectList()
                    .block();
        } catch (Exception e) {
            log.error("Error fetching users from user service: {}", e.getMessage());
            return List.of();
        }
    }

    /**
     * Verify if a Keycloak user ID belongs to a user with 'user' role
     * @param keycloakId Keycloak user ID
     * @return true if user has user role
     */
    public boolean isUser(String keycloakId) {
        try {
            List<UserDTO> users = getAllUsers();
            return users.stream()
                    .anyMatch(u -> u.getId().equals(keycloakId));
        } catch (Exception e) {
            log.error("Error verifying user status: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Get user details by Keycloak ID
     * @param keycloakId Keycloak user ID
     * @return UserDTO or null if not found
     */
    public UserDTO getUserById(String keycloakId) {
        try {
            List<UserDTO> users = getAllUsers();
            return users.stream()
                    .filter(u -> u.getId().equals(keycloakId))
                    .findFirst()
                    .orElse(null);
        } catch (Exception e) {
            log.error("Error fetching user by ID: {}", e.getMessage());
            return null;
        }
    }
}
