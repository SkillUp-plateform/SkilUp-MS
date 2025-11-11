package com.recrutement.recrutement.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "candidatures")
public class Candidature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Keycloak ID of the formateur applying for the position
    @Column(nullable = false)
    private String keycloakFormateurId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CandidatureStatus status = CandidatureStatus.PENDING;

    @Column(length = 2000)
    private String motivation;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @jakarta.persistence.Column(length = 1024)
    private String cvPath;

    public String getCvPath() { return cvPath; }
    public void setCvPath(String cvPath) { this.cvPath = cvPath; }

    public Long getId() { return id; }
    public String getKeycloakFormateurId() { return keycloakFormateurId; }
    public CandidatureStatus getStatus() { return status; }
    public String getMotivation() { return motivation; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setId(Long id) { this.id = id; }
    public void setKeycloakFormateurId(String keycloakFormateurId) { this.keycloakFormateurId = keycloakFormateurId; }
    public void setStatus(CandidatureStatus status) { this.status = status; }
    public void setMotivation(String motivation) { this.motivation = motivation; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}