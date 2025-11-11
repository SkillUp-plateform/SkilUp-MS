package tic.alma.forminims;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class ForminiMsApplication {

    public static void main(String[] args) {
        SpringApplication.run(ForminiMsApplication.class, args);
    }

}
