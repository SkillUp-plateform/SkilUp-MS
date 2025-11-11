package microservice.accesscode.services;

import microservice.accesscode.entities.AccessCode;

import java.util.List;

public interface AccessCodeService {

    AccessCode addAccessCode(AccessCode accessCode, Long idFormation);
    void deleteAccessCode(Long id);
    AccessCode getAccessCodeById(Long id);
    List<AccessCode> getAllAccessCodes();
}
