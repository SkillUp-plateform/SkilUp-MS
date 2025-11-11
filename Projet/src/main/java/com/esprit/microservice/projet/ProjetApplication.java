package com.esprit.microservice.projet;

import com.esprit.microservice.projet.entities.Project;
import com.esprit.microservice.projet.repositories.ProjectRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
@EnableDiscoveryClient
@SpringBootApplication
public class ProjetApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjetApplication.class, args);
    }

    // Le Bean doit être à l'intérieur de la classe
    @Bean
    ApplicationRunner init(ProjectRepository repository) {
        return args -> {
            repository.save(new Project("AI Assistant", "An intelligent assistant for business tasks"));
            repository.save(new Project("E-Learning Platform", "Web platform for online education"));
            repository.findAll().forEach(System.out::println);
        };
    }
}
