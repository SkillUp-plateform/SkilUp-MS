package tic.alma.formationms.services;

import org.springframework.web.multipart.MultipartFile;
import tic.alma.formationms.entities.Resource;

import java.io.IOException;
import java.util.List;

public interface ResourceService {
    Resource addResource(MultipartFile file, Long formationId) throws IOException;
    Resource updateResource(Long id, MultipartFile file) throws IOException;
    void deleteResource(Long id);
    Resource getResourceById(Long id);
    List<Resource> getResourcesByFormationId(Long formationId);
    List<Resource> getAllResources();
}