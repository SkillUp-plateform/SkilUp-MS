package com.recrutement.recrutement.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "backend", contextId = "backendUserClient")
public interface BackendUserClient {
    @PostMapping("/user/promote-to-trainer/{keycloakId}")
    void promoteToTrainer(@PathVariable("keycloakId") String keycloakId);
}