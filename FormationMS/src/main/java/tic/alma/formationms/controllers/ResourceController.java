package tic.alma.formationms.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tic.alma.formationms.entities.Resource;
import tic.alma.formationms.services.ResourceService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/resource")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ResourceController {

    private final ResourceService resourceService;

    @Autowired
    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @PostMapping("/upload/formation/{formationId}")
    public ResponseEntity<Resource> uploadResource(
            @PathVariable Long formationId,
            @RequestParam("file") MultipartFile file) throws IOException {
        Resource newResource = resourceService.addResource(file, formationId);
        return new ResponseEntity<>(newResource, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Resource> updateResource(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        Resource updatedResource = resourceService.updateResource(id, file);
        return new ResponseEntity<>(updatedResource, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<byte[]> getResourceById(@PathVariable Long id) {
        Resource resource = resourceService.getResourceById(id);
        if (resource != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(resource.getContentType()));
            headers.setContentDispositionFormData("attachment", resource.getName());
            headers.setContentLength(resource.getSize());
            return new ResponseEntity<>(resource.getFileData(), headers, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/formation/{formationId}")
    public List<Resource> getResourcesByFormationId(@PathVariable Long formationId) {
        return resourceService.getResourcesByFormationId(formationId);
    }

    @GetMapping("/all")
    public List<Resource> getAllResources() {
        return resourceService.getAllResources();
    }
}