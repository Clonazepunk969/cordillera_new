package com.grupocordillera.bff.controller;

import com.grupocordillera.bff.client.KpiClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/kpis")
public class KpiController {

    private final KpiClient kpiClient;

    public KpiController(KpiClient kpiClient) {
        this.kpiClient = kpiClient;
    }

    @GetMapping
    public Object getAllKpis() {
        return kpiClient.getAllKpis();
    }

    @PostMapping
    public ResponseEntity<String> createKpi(@RequestBody Object request) {
        return kpiClient.createKpi(request);
    }
}