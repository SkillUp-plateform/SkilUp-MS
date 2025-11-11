package com.esprit.microservice.projet.services;

import com.esprit.microservice.projet.entities.Project;

import java.util.List;

public interface ProjectService {
    Project addProject(Project project);
    void deleteProject(Long id);
    Project getProjectById(Long id);
    List<Project> getAllProjects();
    Project updateProject(Long id, Project project);
}