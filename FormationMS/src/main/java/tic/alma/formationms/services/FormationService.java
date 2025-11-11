package tic.alma.formationms.services;

import tic.alma.formationms.entities.Formation;

import java.util.List;

public interface FormationService {
    Formation addFormation(Formation formation, String keycloakFormateurId);
    Formation updateFormation(Long id, Formation updatedFormation, String keycloakFormateurId);
    void deleteFormation(Long id);
    Formation getFormationById(Long id);
    List<Formation> getAllFormations();
    List<Formation> getFormationsByFormateur(String keycloakFormateurId);
}
