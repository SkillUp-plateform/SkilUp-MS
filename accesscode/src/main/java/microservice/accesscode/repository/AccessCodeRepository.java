package microservice.accesscode.repository;

import microservice.accesscode.entities.AccessCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccessCodeRepository extends JpaRepository<AccessCode, Long> {

}
