package com.recrutement.recrutement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "com.recrutement.recrutement.client")
@EntityScan(basePackages = "com.recrutement.recrutement.domain")
@EnableJpaRepositories(basePackages = "com.recrutement.recrutement.repository")
public class RecrutementApplication {

    public static void main(String[] args) {
        SpringApplication.run(RecrutementApplication.class, args);
    }

}
