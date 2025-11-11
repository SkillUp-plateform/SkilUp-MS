package microservice.accesscode.controller;

import lombok.AllArgsConstructor;
import microservice.accesscode.entities.AccessCode;
import microservice.accesscode.services.AccessCodeService;
import microservice.accesscode.services.AccessCodeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/accesscode")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@AllArgsConstructor
public class AccessCodeController {

    @Autowired
    AccessCodeServiceImpl accessCodeService;




    @PostMapping("/add/formation/{idFormation}")
    public ResponseEntity<AccessCode> addAccessCode(
            @RequestBody AccessCode accessCode,
            @PathVariable Long idFormation) {

        AccessCode createdAccessCode = accessCodeService.addAccessCode(accessCode, idFormation);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAccessCode);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteAccessCode(@PathVariable Long id) {
        accessCodeService.deleteAccessCode(id);
    }

    @GetMapping("/get/{id}")
    public AccessCode getAccessCodeById(@PathVariable Long id) {
        return accessCodeService.getAccessCodeById(id);
    }

    @GetMapping("/all")
    public List<AccessCode> getAllAccessCodes() {
        return accessCodeService.getAllAccessCodes();
    }
}
