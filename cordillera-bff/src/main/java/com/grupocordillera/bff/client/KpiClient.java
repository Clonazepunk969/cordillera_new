package com.grupocordillera.bff.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

@Component
public class KpiClient {

    private final RestTemplate restTemplate;

    @Value("${kpi.service.url}")
    private String kpiServiceUrl;

    public KpiClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Object getAllKpis() {
        return restTemplate.getForObject(kpiServiceUrl, Object.class);
    }

    public ResponseEntity<String> createKpi(Object request) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Object> entity = new HttpEntity<>(request, headers);

            return restTemplate.exchange(
                    kpiServiceUrl,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

        } catch (HttpStatusCodeException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getResponseBodyAsString());
        }
    }
}