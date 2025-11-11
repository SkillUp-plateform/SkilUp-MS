package com.recrutement.recrutement.controllers;

import com.recrutement.recrutement.client.BackendHealthClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BackendHealthController {

    private final BackendHealthClient backendHealthClient;

    public BackendHealthController(BackendHealthClient backendHealthClient) {
        this.backendHealthClient = backendHealthClient;
    }

    @GetMapping("/backend/health")
    public ResponseEntity<String> backendHealth() {
        String body = backendHealthClient.health();
        return ResponseEntity.ok(body);
    }
}