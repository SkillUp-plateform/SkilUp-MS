package com.recrutement.recrutement.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "backend", contextId = "backendHealthClient")
public interface BackendHealthClient {
    @GetMapping("/actuator/health")
    String health();
}