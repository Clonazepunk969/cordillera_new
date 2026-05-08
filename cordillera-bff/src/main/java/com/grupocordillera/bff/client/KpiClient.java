package com.grupocordillera.bff.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class KpiClient {

    private final RestTemplate restTemplate;

    @Value("${kpi.service.url}")
    private String kpiUrl;

    public KpiClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Object getAllKpis() {
        return restTemplate.getForObject(kpiUrl, Object.class);
    }
}