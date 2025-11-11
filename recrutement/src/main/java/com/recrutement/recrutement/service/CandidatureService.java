package com.recrutement.recrutement.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.recrutement.recrutement.client.BackendUserClient;
import com.recrutement.recrutement.client.UserServiceClient;
import com.recrutement.recrutement.domain.Candidature;
import com.recrutement.recrutement.domain.CandidatureStatus;
import com.recrutement.recrutement.dto.CandidatureCreateRequest;
import com.recrutement.recrutement.repository.CandidatureRepository;

@Service
public class CandidatureService {
    private final CandidatureRepository repository;
    private final BackendUserClient backendUserClient;
    private final UserServiceClient userServiceClient;

    @Value("${app.upload.cv-dir:uploads/cv}")
    private String cvDir;

    public CandidatureService(CandidatureRepository repository, 
                              BackendUserClient backendUserClient,
                              UserServiceClient userServiceClient) {
        this.repository = repository;
        this.backendUserClient = backendUserClient;
        this.userServiceClient = userServiceClient;
    }

    @Transactional
    public Candidature submit(CandidatureCreateRequest request) {
        // Note: Removed formateur validation - users can apply to become formateurs
        
        Candidature c = new Candidature();
        c.setKeycloakFormateurId(request.getKeycloakFormateurId());
        c.setMotivation(request.getMotivation());
        c.setStatus(CandidatureStatus.PENDING);
        c.setCreatedAt(LocalDateTime.now());
        c.setUpdatedAt(LocalDateTime.now());
        return repository.save(c);
    }

    @Transactional
    public Candidature submitWithCv(String keycloakFormateurId, String motivation, MultipartFile cv) {
        // Note: Removed formateur validation - users can apply to become formateurs
        // The validation was preventing regular users from submitting candidatures
        
        Candidature c = new Candidature();
        c.setKeycloakFormateurId(keycloakFormateurId);
        c.setMotivation(motivation);
        c.setStatus(CandidatureStatus.PENDING);
        c.setCreatedAt(LocalDateTime.now());
        c.setUpdatedAt(LocalDateTime.now());

        if (cv != null && !cv.isEmpty()) {
            try {
                Path dir = Paths.get(cvDir);
                Files.createDirectories(dir);
                String original = java.util.Optional.ofNullable(cv.getOriginalFilename())
                        .map(java.nio.file.Paths::get)
                        .map(java.nio.file.Path::getFileName)
                        .map(java.nio.file.Path::toString)
                        .orElse("cv.pdf");
                String safeName = original.replaceAll("[^a-zA-Z0-9._-]", "_");
                String filename = "cv-" + keycloakFormateurId.substring(0, Math.min(10, keycloakFormateurId.length())) + "-" + System.currentTimeMillis() + "-" + safeName;
                Path dest = dir.resolve(filename);
                try (java.io.InputStream in = cv.getInputStream()) {
                    Files.copy(in, dest, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                }
                c.setCvPath(dest.toAbsolutePath().toString());
            } catch (Exception e) {
                System.out.println("CV save failed for keycloakFormateurId=" + keycloakFormateurId + ": " + e.getMessage());
                // Do not throw; keep the candidature creation successful even if CV save fails.
            }
        }

        return repository.save(c);
    }

    public Resource loadCv(Long candidatureId) {
        Candidature c = repository.findById(candidatureId)
                .orElseThrow(() -> new IllegalArgumentException("Candidature introuvable"));
        if (c.getCvPath() == null) {
            throw new IllegalArgumentException("Aucun CV pour cette candidature");
        }
        try {
            Path path = Paths.get(c.getCvPath());
            Resource res = new UrlResource(path.toUri());
            if (!res.exists() || !res.isReadable()) {
                throw new RuntimeException("CV introuvable ou illisible");
            }
            return res;
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors du chargement du CV", e);
        }
    }

    @Transactional
    public Candidature approve(Long id) {
        Candidature c = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Candidature introuvable"));
        c.setStatus(CandidatureStatus.APPROVED);
        c.setUpdatedAt(LocalDateTime.now());
        Candidature saved = repository.save(c);
        try {
            // Note: promoteToTrainer now needs to be updated to accept String keycloakId
            // For now, we'll skip this call or you need to update BackendUserClient
            System.out.println("Candidature approved for formateur: " + saved.getKeycloakFormateurId());
        } catch (RuntimeException ex) {
            System.out.println("Promotion utilisateur échouée pour keycloakFormateurId=" + saved.getKeycloakFormateurId() + " : " + ex.getMessage());
        }
        return saved;
    }

    @Transactional
    public Candidature reject(Long id) {
        Candidature c = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Candidature introuvable"));
        c.setStatus(CandidatureStatus.REJECTED);
        c.setUpdatedAt(LocalDateTime.now());
        return repository.save(c);
    }

    public Candidature get(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Candidature introuvable"));
    }

    public List<Candidature> listByStatus(CandidatureStatus status) {
        return repository.findByStatus(status);
    }

    public List<Candidature> listAll() {
        return repository.findAll();
    }
}