package com.recrutement.recrutement.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CandidatureCreateRequest {
    @NotNull
    private String keycloakFormateurId;

    @Size(max = 2000)
    private String motivation;

    public String getKeycloakFormateurId() { return keycloakFormateurId; }
    public String getMotivation() { return motivation; }
    public void setKeycloakFormateurId(String keycloakFormateurId) { this.keycloakFormateurId = keycloakFormateurId; }
    public void setMotivation(String motivation) { this.motivation = motivation; }
}