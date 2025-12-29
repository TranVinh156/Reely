package com.gateway.reely;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.config.EnableWebFlux;

@SpringBootApplication
@EnableWebFlux
public class ReelyApplication {
	private final String backendUrl = "http://localhost:8080";

	public static void main(String[] args) {
		SpringApplication.run(ReelyApplication.class, args);
	}

	@Bean
	public RouteLocator routeLocator(RouteLocatorBuilder builder) {
		return builder.routes()
				.route("auth-service", p -> p
						.path("/api/v1/auth/**")
						.uri(backendUrl))
				.route("user-service", p -> p
						.path("/api/v1/users/**")
						.uri(backendUrl))
				.route("api-service", p -> p
						.path("/hello")
						.uri(backendUrl))
				.route("api-service", p -> p
						.path("/api/v1/notifications/**")
						.uri(backendUrl))
				.route("api-service", p -> p
						.path("/api/v1/comments/**")
						.uri(backendUrl))
				.route("api-service", p -> p
						.path("/api/v1/videos/**")
						.uri(backendUrl))
				.route("api-service", p -> p
						.path("/api/v1/reports/**")
						.uri(backendUrl))
				.route("upload-service", p -> p
						.path("/api/v1/upload/**")
						.uri(backendUrl))
                .route("api-service", p -> p
                        .path("/api/v1/likes/**")
                        .uri(backendUrl))				
				.route("search-service", p -> p
						.path("/api/v1/search/**")
						.uri(backendUrl))
				.route("tags-service", p -> p
						.path("/api/v1/tags/**")
						.uri(backendUrl))
				.route("feed-service", p -> p
						.path("/api/v1/feed/**")
						.uri(backendUrl))
				.build();
	}
}
