package com.grupocordillera.bff.service;

import com.grupocordillera.bff.client.KpiClient;
import com.grupocordillera.bff.client.ReportClient;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final KpiClient kpiClient;
    private final ReportClient reportClient;

    public DashboardService(KpiClient kpiClient, ReportClient reportClient) {
        this.kpiClient = kpiClient;
        this.reportClient = reportClient;
    }

    public Map<String, Object> getDashboard() {

        Map<String, Object> response = new HashMap<>();

        response.put("kpis", kpiClient.getAllKpis());
        response.put("reports", reportClient.getAllReports());

        return response;
    }
}