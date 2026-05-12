package com.grupocordillera.bff.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

@Component
public class AuthClient {

    private final RestTemplate restTemplate;

    @Value("${auth.service.url}")
    private String authServiceUrl;

    public AuthClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ResponseEntity<String> login(Object request) {
        return post("/login", request);
    }

    public ResponseEntity<String> register(Object request) {
        return post("/register", request);
    }

    public ResponseEntity<String> resetPassword(Object request) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Object> entity = new HttpEntity<>(request, headers);

            return restTemplate.exchange(
                    authServiceUrl + "/reset-password",
                    HttpMethod.PUT,
                    entity,
                    String.class
            );

        } catch (HttpStatusCodeException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getResponseBodyAsString());
        }
    }

    public ResponseEntity<String> validateToken(String authorization) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authorization);

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            return restTemplate.exchange(
                    authServiceUrl + "/validate-token",
                    HttpMethod.GET,
                    entity,
                    String.class
            );

        } catch (HttpStatusCodeException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getResponseBodyAsString());
        }
    }

    private ResponseEntity<String> post(String path, Object request) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Object> entity = new HttpEntity<>(request, headers);

            return restTemplate.exchange(
                    authServiceUrl + path,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

        } catch (HttpStatusCodeException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getResponseBodyAsString());
        }
    }
}