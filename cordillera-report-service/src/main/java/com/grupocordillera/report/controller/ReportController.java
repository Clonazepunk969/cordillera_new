package com.grupocordillera.report.controller;

import com.grupocordillera.report.dto.ReportRequest;
import com.grupocordillera.report.dto.ReportResponse;
import com.grupocordillera.report.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// IMPORTANTE
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ReportResponse create(@Valid @RequestBody ReportRequest request) {
        return reportService.createReport(request);
    }

    @GetMapping
    public List<ReportResponse> getAll() {
        return reportService.getAll();
    }

    @GetMapping("/{id}")
    public ReportResponse getById(@PathVariable Long id) {
        return reportService.getById(id);
    }

    // NUEVO ENDPOINT PDF
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Long id) {

        byte[] pdf = reportService.generatePdf(id);

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=reporte_" + id + ".pdf")
                .header("Content-Type", "application/pdf")
                .body(pdf);
    }
}