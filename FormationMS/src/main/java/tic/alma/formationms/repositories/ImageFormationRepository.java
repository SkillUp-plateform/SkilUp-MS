package tic.alma.formationms.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tic.alma.formationms.entities.ImageFormation;

import java.util.Optional;

public interface ImageFormationRepository extends JpaRepository<ImageFormation, Long> {
    Optional<ImageFormation> findByFormationId(Long idFormation);
}

