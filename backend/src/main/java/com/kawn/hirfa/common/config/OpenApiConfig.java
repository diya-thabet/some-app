package com.kawn.hirfa.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI hirfaOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Hirfa API")
                        .description(
                                "The Decentralized Service Network for Tunisia - Connecting skilled workers with customers through a fair, zero-fee platform.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Hirfa Team")
                                .email("support@hirfa.tn")
                                .url("https://hirfa.tn"))
                        .license(new License()
                                .name("Proprietary")
                                .url("https://hirfa.tn/terms")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Development Server"),
                        new Server().url("https://api.hirfa.tn").description("Production Server")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter your JWT token")));
    }
}
