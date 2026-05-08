package com.grupocordillera.kpi.controller;

import com.grupocordillera.kpi.dto.KpiRequest;
import com.grupocordillera.kpi.dto.KpiResponse;
import com.grupocordillera.kpi.service.KpiService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kpis")
public class KpiController {

    private final KpiService kpiService;

    public KpiController(KpiService kpiService) {
        this.kpiService = kpiService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public KpiResponse createKpi(@Valid @RequestBody KpiRequest request) {
        return kpiService.createKpi(request);
    }

    @GetMapping
    public List<KpiResponse> getAllKpis() {
        return kpiService.getAllKpis();
    }

    @GetMapping("/{id}")
    public KpiResponse getKpiById(@PathVariable Long id) {
        return kpiService.getKpiById(id);
    }
}