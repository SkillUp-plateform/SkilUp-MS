package microservice.accesscode.services;

import microservice.accesscode.entities.FormationDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "FormationMS")
public interface FormationClient {

    @GetMapping("/formation/get/{id}")
    FormationDto getFormationById(@PathVariable("id") Long id);
}
