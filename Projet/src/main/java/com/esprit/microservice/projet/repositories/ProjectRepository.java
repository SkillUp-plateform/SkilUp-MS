package com.esprit.microservice.projet.repositories;
import com.esprit.microservice.projet.entities.Project;

import com.esprit.microservice.projet.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("SELECT p FROM Project p WHERE p.title LIKE %:title%")
    List<Project> findByTitle(@Param("title") String title);
}