package com.grupocordillera.kpi.service;

import com.grupocordillera.kpi.dto.KpiRequest;
import com.grupocordillera.kpi.dto.KpiResponse;
import com.grupocordillera.kpi.exception.ResourceNotFoundException;
import com.grupocordillera.kpi.factory.KpiStrategyFactory;
import com.grupocordillera.kpi.model.Kpi;
import com.grupocordillera.kpi.repository.KpiRepository;
import com.grupocordillera.kpi.strategy.KpiCalculationStrategy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class KpiService {

    private final KpiRepository kpiRepository;
    private final KpiStrategyFactory kpiStrategyFactory;

    public KpiService(KpiRepository kpiRepository, KpiStrategyFactory kpiStrategyFactory) {
        this.kpiRepository = kpiRepository;
        this.kpiStrategyFactory = kpiStrategyFactory;
    }

    public KpiResponse createKpi(KpiRequest request) {
        KpiCalculationStrategy strategy = kpiStrategyFactory.getStrategy(request.getType());
        double result = strategy.calculate(request.getInputValue());

        String status = result >= 100 ? "OK" : "ALERTA";

        Kpi kpi = new Kpi();
        kpi.setName(request.getName());
        kpi.setType(request.getType());
        kpi.setInputValue(request.getInputValue());
        kpi.setResultValue(result);
        kpi.setStatus(status);

        Kpi savedKpi = kpiRepository.save(kpi);

        return mapToResponse(savedKpi);
    }

    public List<KpiResponse> getAllKpis() {
        return kpiRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public KpiResponse getKpiById(Long id) {
        Kpi kpi = kpiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("KPI no encontrado con id: " + id));

        return mapToResponse(kpi);
    }

    private KpiResponse mapToResponse(Kpi kpi) {
        return new KpiResponse(
                kpi.getId(),
                kpi.getName(),
                kpi.getType(),
                kpi.getInputValue(),
                kpi.getResultValue(),
                kpi.getStatus()
        );
    }
}