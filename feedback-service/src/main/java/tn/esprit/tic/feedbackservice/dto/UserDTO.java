package tn.esprit.tic.feedbackservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO representing a User from Keycloak
 */
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String id;              // Keycloak ID
    private String username;
    private String email;
    private String firstName;
    private String lastName;
}
