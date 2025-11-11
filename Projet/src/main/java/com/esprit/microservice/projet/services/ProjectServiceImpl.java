package com.esprit.microservice.projet.services;

import com.esprit.microservice.projet.entities.Project;
import com.esprit.microservice.projet.repositories.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public Project addProject(Project project) {
        return projectRepository.save(project);
    }

    @Override
    public void deleteProject(Long id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
        } else {
            throw new RuntimeException("Projet avec ID " + id + " non trouvé");
        }
    }

    @Override
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet avec ID " + id + " non trouvé"));
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Project updateProject(Long id, Project project) {
        return projectRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(project.getTitle());
                    existing.setDescription(project.getDescription());
                    return projectRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Projet avec ID " + id + " non trouvé"));
    }
}