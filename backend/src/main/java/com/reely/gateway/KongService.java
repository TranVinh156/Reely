package com.reely.gateway;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class KongService {
    private final WebClient webClient;

    public KongService(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("http://localhost:8001")
                .build();
    }

    public Map<String, Object> createConsumer(String username) {
        return webClient.post()
                .uri("/consumers")
                .bodyValue(Map.of("username", username))
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }

    public Map<String, Object> createJwtCredential(String username, String secretKey) {
        return webClient.post()
                .uri("/consumers/{username}/jwt", username)
                .bodyValue(Map.of("algorithm", "HS256", "secret", secretKey))
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }

    public Map<String, Object> getJwtCredential(String username) {
        return webClient.post()
                .uri("/consumers/{username}/jwt", username)
                .bodyValue(Map.of("algorithm", "HS256"))
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }
}
