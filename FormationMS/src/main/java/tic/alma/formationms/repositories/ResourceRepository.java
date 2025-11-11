package tic.alma.formationms.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tic.alma.formationms.entities.Resource;

import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByFormationId(Long formationId);
}