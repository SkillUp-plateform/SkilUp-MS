package microservice.accesscode.services;

import microservice.accesscode.entities.AccessCode;
import microservice.accesscode.entities.FormationDto;
import microservice.accesscode.repository.AccessCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class AccessCodeServiceImpl  implements AccessCodeService{

    @Autowired
    private AccessCodeRepository accessCodeRepository;
    @Autowired
    FormationClient formationClient;


    @Override
    public AccessCode addAccessCode(AccessCode accessCode, Long idFormation) {

        FormationDto formation = formationClient.getFormationById(idFormation);
        if (formation == null) {
            throw new RuntimeException("Formation not found : " + idFormation);
        }
        accessCode.setFormationId(formation.getId());
        return accessCodeRepository.save(accessCode);
    }

    @Override
    public void deleteAccessCode(Long id) {
        accessCodeRepository.deleteById(id);
    }

    @Override
    public AccessCode getAccessCodeById(Long id) {
        return accessCodeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AccessCode with id " + id + " not found"));
    }

    @Override
    public List<AccessCode> getAllAccessCodes() {
        return accessCodeRepository.findAll();
    }

}
