package tic.alma.formationms.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tic.alma.formationms.entities.Formation;

public interface FormationRepository extends JpaRepository<Formation, Long> {}