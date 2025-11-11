package com.recrutement.recrutement.controllers;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.recrutement.recrutement.domain.Candidature;
import com.recrutement.recrutement.domain.CandidatureStatus;
import com.recrutement.recrutement.dto.CandidatureCreateRequest;
import com.recrutement.recrutement.dto.CandidatureResponse;
import com.recrutement.recrutement.service.CandidatureService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/candidatures")
public class CandidatureController {
    private final CandidatureService service;

    public CandidatureController(CandidatureService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<CandidatureResponse> submit(@Valid @RequestBody CandidatureCreateRequest request) {
        Candidature c = service.submit(request);
        return ResponseEntity.ok(toResponse(c));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<CandidatureResponse> approve(@PathVariable Long id) {
        Candidature c = service.approve(id);
        return ResponseEntity.ok(toResponse(c));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<CandidatureResponse> reject(@PathVariable Long id) {
        Candidature c = service.reject(id);
        return ResponseEntity.ok(toResponse(c));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CandidatureResponse> submitWithCv(
            @RequestParam String keycloakFormateurId,
            @RequestParam(required = false) String motivation,
            @RequestParam(name = "cv", required = false) MultipartFile cv,
            @RequestParam(name = "cvPath", required = false) MultipartFile cvPathFile
    ) {
        try {
            MultipartFile effectiveFile = (cv != null && !cv.isEmpty()) ? cv : cvPathFile;
            Candidature c = service.submitWithCv(keycloakFormateurId, motivation, effectiveFile);
            return ResponseEntity.ok(toResponse(c));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/cv")
    public ResponseEntity<Resource> downloadCv(@PathVariable Long id) {
        Resource cv = service.loadCv(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(cv);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CandidatureResponse> get(@PathVariable Long id) {
        Candidature c = service.get(id);
        return ResponseEntity.ok(toResponse(c));
    }

    @GetMapping
    public ResponseEntity<List<CandidatureResponse>> list(@RequestParam(required = false) CandidatureStatus status) {
        List<Candidature> list = (status == null) ? service.listAll() : service.listByStatus(status);
        return ResponseEntity.ok(list.stream().map(this::toResponse).toList());
    }

    private CandidatureResponse toResponse(Candidature c) {
        return new CandidatureResponse(
                c.getId(),
                c.getKeycloakFormateurId(),
                c.getStatus(),
                c.getMotivation(),
                c.getCreatedAt(),
                c.getUpdatedAt(),
                c.getCvPath()
        );
    }
}