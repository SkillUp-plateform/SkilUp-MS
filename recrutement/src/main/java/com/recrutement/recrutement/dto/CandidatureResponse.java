package com.recrutement.recrutement.dto;

import java.time.LocalDateTime;

import com.recrutement.recrutement.domain.CandidatureStatus;

public class CandidatureResponse {
    private Long id;
    private String keycloakFormateurId;
    private CandidatureStatus status;
    private String motivation;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String cvPath;

    public CandidatureResponse(Long id, String keycloakFormateurId, CandidatureStatus status, String motivation,
                               LocalDateTime createdAt, LocalDateTime updatedAt, String cvPath) {
        this.id = id;
        this.keycloakFormateurId = keycloakFormateurId;
        this.status = status;
        this.motivation = motivation;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.cvPath = cvPath;
    }
    public String getCvPath() { return cvPath; }
    public Long getId() { return id; }
    public String getKeycloakFormateurId() { return keycloakFormateurId; }
    public CandidatureStatus getStatus() { return status; }
    public String getMotivation() { return motivation; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}