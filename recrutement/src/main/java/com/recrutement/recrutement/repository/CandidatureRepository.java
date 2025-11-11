package com.recrutement.recrutement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.recrutement.recrutement.domain.Candidature;
import com.recrutement.recrutement.domain.CandidatureStatus;

public interface CandidatureRepository extends JpaRepository<Candidature, Long> {
    List<Candidature> findByStatus(CandidatureStatus status);
}