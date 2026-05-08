package com.grupocordillera.bff.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ReportClient {

    private final RestTemplate restTemplate;

    @Value("${report.service.url}")
    private String reportUrl;

    public ReportClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Object getAllReports() {
        return restTemplate.getForObject(reportUrl, Object.class);
    }
}