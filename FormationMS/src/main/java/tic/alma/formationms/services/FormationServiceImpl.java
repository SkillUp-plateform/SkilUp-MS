package tic.alma.formationms.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tic.alma.formationms.client.UserServiceClient;
import tic.alma.formationms.entities.Formation;
import tic.alma.formationms.repositories.FormationRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class FormationServiceImpl implements FormationService {

    private final FormationRepository formationRepository;
    private final RabbitTemplate rabbitTemplate;
    private final UserServiceClient userServiceClient;

    @Autowired
    public FormationServiceImpl(FormationRepository formationRepository, 
                                RabbitTemplate rabbitTemplate,
                                UserServiceClient userServiceClient) {
        this.formationRepository = formationRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.userServiceClient = userServiceClient;
    }

    @Override
    public Formation addFormation(Formation formation, String keycloakFormateurId) {
        // Verify that the user is a formateur (lenient - log warning but allow creation)
        try {
            if (!userServiceClient.isFormateur(keycloakFormateurId)) {
                log.warn("Could not verify formateur status for user {}. Proceeding with creation.", keycloakFormateurId);
            }
        } catch (Exception e) {
            log.warn("Error verifying formateur status for user {}: {}. Proceeding with creation.", 
                     keycloakFormateurId, e.getMessage());
        }
        
        formation.setKeycloakFormateurId(keycloakFormateurId);
        Formation saved = formationRepository.save(formation);
        log.info("Formation created with ID {} by formateur {}", saved.getId(), keycloakFormateurId);
        return saved;
    }

    @Override
    public Formation updateFormation(Long id, Formation updatedFormation, String keycloakFormateurId) {
        Formation existing = formationRepository.findById(id).orElse(null);
        if (existing != null) {
            // Verify that the user is a formateur (lenient - log warning but allow update)
            if (keycloakFormateurId != null) {
                try {
                    if (!userServiceClient.isFormateur(keycloakFormateurId)) {
                        log.warn("Could not verify formateur status for user {}. Proceeding with update.", keycloakFormateurId);
                    }
                } catch (Exception e) {
                    log.warn("Error verifying formateur status for user {}: {}. Proceeding with update.", 
                             keycloakFormateurId, e.getMessage());
                }
            }
            
            existing.setTitle(updatedFormation.getTitle());
            existing.setContent(updatedFormation.getContent());
            existing.setMeetingLink(updatedFormation.getMeetingLink());
            existing.setVideoLink(updatedFormation.getVideoLink());
            existing.setDuration(updatedFormation.getDuration());
            existing.setDate(updatedFormation.getDate());
            existing.setPrix(updatedFormation.getPrix());
            if (keycloakFormateurId != null) {
                existing.setKeycloakFormateurId(keycloakFormateurId);
            }
            Formation saved = formationRepository.save(existing);
            log.info("Formation {} updated by formateur {}", id, keycloakFormateurId);
            return saved;
        }
        return null;
    }

    @Override
    public void deleteFormation(Long id) {
        formationRepository.deleteById(id);
        Map<String, Object> event = Map.of(
                "type", "FORMATION_DELETED",
                "formationId", id
        );
        rabbitTemplate.convertAndSend("formationQueue", event);
    }

    @Override
    public Formation getFormationById(Long id) {
        return formationRepository.findById(id).orElse(null);
    }

    @Override
    public List<Formation> getAllFormations() {
        return formationRepository.findAll();
    }

    @Override
    public List<Formation> getFormationsByFormateur(String keycloakFormateurId) {
        return formationRepository.findAll().stream()
                .filter(f -> keycloakFormateurId.equals(f.getKeycloakFormateurId()))
                .collect(Collectors.toList());
    }
}
