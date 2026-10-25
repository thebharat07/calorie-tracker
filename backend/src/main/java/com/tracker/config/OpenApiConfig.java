package com.tracker.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Calorie Tracker REST API")
                        .version("1.0.0")
                        .description("Backend REST API for Calorie & Macronutrient Tracking, Time-Range Reports, and Google Gemini Vision Photo Extraction backed by Supabase PostgreSQL")
                        .contact(new Contact().name("CalorieTrack Team")));
    }
}
