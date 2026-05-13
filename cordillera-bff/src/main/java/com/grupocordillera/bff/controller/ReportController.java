package com.grupocordillera.bff.controller;

import com.grupocordillera.bff.client.ReportClient;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportClient reportClient;

    public ReportController(ReportClient reportClient) {
        this.reportClient = reportClient;
    }

    @GetMapping
    public Object getAllReports() {
        return reportClient.getAllReports();
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadReportPdf(@PathVariable Long id) {
        ResponseEntity<byte[]> response = reportClient.downloadReportPdf(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(response.getBody());
    }
}