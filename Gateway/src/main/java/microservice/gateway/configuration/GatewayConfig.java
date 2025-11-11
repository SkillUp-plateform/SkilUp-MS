package microservice.gateway.configuration;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {
    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()


                .route("Quiz", r -> r.path("/Quiz/**")
                        .filters(f -> f.rewritePath("/Quiz/(?<segment>.*)", "/${segment}"))
                        .uri("lb://Quiz"))

                .route("FormationMS", r -> r.path("/FormationMS/**")
                        .filters(f -> f.rewritePath("/FormationMS/(?<segment>.*)", "/${segment}"))
                        .uri("lb://FormationMS"))

                .route("projetMS", r -> r.path("/projetMS/**")
                        .filters(f -> f.rewritePath("/projetMS/(?<segment>.*)", "/${segment}"))
                        .uri("lb://projetMS"))

                .route("feedbackMS", r -> r.path("/feedbackMS/**")
                        .filters(f -> f.rewritePath("/feedbackMS/(?<segment>.*)", "/${segment}"))
                        .uri("lb://feedbackMS"))

                .route("accesscodeMS", r -> r.path("/accesscodeMS/**")
                        .filters(f -> f.rewritePath("/accesscodeMS/(?<segment>.*)", "/${segment}"))
                        .uri("lb://accesscodeMS"))

                .route("recrutementMS", r -> r.path("/recrutementMS/**")
                        .filters(f -> f.rewritePath("/recrutementMS/(?<segment>.*)", "/${segment}"))
                        .uri("lb://recrutementMS"))

                .route("reclamationMS", r -> r.path("/reclamationMS/**")
                        .filters(f -> f.rewritePath("/reclamationMS/(?<segment>.*)", "/${segment}"))
                        .uri("lb://reclamationMS"))

                .route("USER-MANAGEMENT-SERVICE", r -> r.path("/user-management/**")
                        .filters(f -> f.rewritePath("/user-management/(?<segment>.*)", "/${segment}"))
                        .uri("http://localhost:8089"))
                .build();
    }


}
