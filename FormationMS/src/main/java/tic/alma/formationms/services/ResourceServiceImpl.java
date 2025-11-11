package tic.alma.formationms.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tic.alma.formationms.entities.Formation;
import tic.alma.formationms.entities.Resource;
import tic.alma.formationms.repositories.FormationRepository;
import tic.alma.formationms.repositories.ResourceRepository;

import java.io.IOException;
import java.util.List;

@Service
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;
    private final FormationRepository formationRepository;

    @Autowired
    public ResourceServiceImpl(ResourceRepository resourceRepository, FormationRepository formationRepository) {
        this.resourceRepository = resourceRepository;
        this.formationRepository = formationRepository;
    }

    @Override
    public Resource addResource(MultipartFile file, Long formationId) throws IOException {
        Formation formation = formationRepository.findById(formationId).orElse(null);
        if (formation != null && file != null) {
            Resource resource = new Resource();
            resource.setName(file.getOriginalFilename());

            resource.setContentType(file.getContentType());
            resource.setSize(file.getSize());
            resource.setFileData(file.getBytes());
            resource.setFormation(formation);
            return resourceRepository.save(resource);
        }
        return null;
    }

    @Override
    public Resource updateResource(Long id, MultipartFile file) throws IOException {
        Resource existing = resourceRepository.findById(id).orElse(null);
        if (existing != null && file != null) {
            existing.setName(file.getOriginalFilename());

            existing.setContentType(file.getContentType());
            existing.setSize(file.getSize());
            existing.setFileData(file.getBytes());
            return resourceRepository.save(existing);
        }
        return null;
    }

    @Override
    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }

    @Override
    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id).orElse(null);
    }

    @Override
    public List<Resource> getResourcesByFormationId(Long formationId) {
        return resourceRepository.findByFormationId(formationId);
    }

    @Override
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }
}