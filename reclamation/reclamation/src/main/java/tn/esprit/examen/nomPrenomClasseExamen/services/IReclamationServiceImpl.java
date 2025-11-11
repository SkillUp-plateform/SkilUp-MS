package tn.esprit.examen.nomPrenomClasseExamen.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.examen.nomPrenomClasseExamen.entities.reclamation;
import tn.esprit.examen.nomPrenomClasseExamen.repositories.IReclamationRepository;

import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class IReclamationServiceImpl implements IReclamationService {
    @Autowired
    private IReclamationRepository reclamationRepository;
    
    @Autowired
    private tn.esprit.examen.nomPrenomClasseExamen.client.UserServiceClient userServiceClient;

    public List<reclamation> getAllReclamations() {
        return reclamationRepository.findAll();
    }

    public Optional<reclamation> getReclamationById(Long id) {
        return reclamationRepository.findById(id);
    }

    public reclamation createReclamation(reclamation reclamation, String keycloakUserId) {
        // Verify that the user exists and has 'user' role
        if (!userServiceClient.isUser(keycloakUserId)) {
            log.error("User {} is not a valid user", keycloakUserId);
            throw new IllegalArgumentException("User is not a valid user");
        }
        
        reclamation.setKeycloakUserId(keycloakUserId);
        log.info("Creating reclamation for user {}", keycloakUserId);
        return reclamationRepository.save(reclamation);
    }

    public reclamation updateReclamation(Long id, reclamation reclamationDetails) {
        reclamation reclamation = reclamationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reclamation not found with id: " + id));

        reclamation.setTitle(reclamationDetails.getTitle());
        reclamation.setDescription(reclamationDetails.getDescription());
        reclamation.setStatus(reclamationDetails.getStatus());

        return reclamationRepository.save(reclamation);

    }

    @Override
    public void deleteReclamation(Long id) {
        log.warn("Deleting reclamation with id: {}", id);
        if (!reclamationRepository.existsById(id)) {
            throw new RuntimeException("Reclamation not found with id: " + id);
        }
        reclamationRepository.deleteById(id);
    }

    @Override
    public List<reclamation> getReclamationsByUserId(String keycloakUserId) {
        log.info("Fetching reclamations for user {}", keycloakUserId);
        return reclamationRepository.findByKeycloakUserId(keycloakUserId);
    }
}
