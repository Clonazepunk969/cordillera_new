package com.grupocordillera.report.service;

import com.grupocordillera.report.dto.ReportRequest;
import com.grupocordillera.report.dto.ReportResponse;
import com.grupocordillera.report.model.Report;
import com.grupocordillera.report.repository.ReportRepository;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

@Service
public class ReportService {

    private final ReportRepository reportRepository;

    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public ReportResponse createReport(ReportRequest request) {
        Report report = new Report();
        report.setTitle(request.getTitle());
        report.setDescription(request.getDescription());
        report.setType(request.getType());
        report.setCreatedBy(request.getCreatedBy());
        report.setCreatedAt(LocalDateTime.now());

        Report saved = reportRepository.save(report);
        return mapToResponse(saved);
    }

    public List<ReportResponse> getAll() {
        return reportRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ReportResponse getById(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report no encontrado"));

        return mapToResponse(report);
    }

    public byte[] generatePdf(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado"));

        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream output = new ByteArrayOutputStream()) {

            PDPage page = new PDPage();
            document.addPage(page);

            PDPageContentStream content = new PDPageContentStream(document, page);

            content.setNonStrokingColor(6, 19, 58);
            content.addRect(0, 735, 612, 57);
            content.fill();

            content.beginText();
            content.setNonStrokingColor(255, 255, 255);
            content.setFont(PDType1Font.HELVETICA_BOLD, 18);
            content.newLineAtOffset(50, 758);
            content.showText("Cordillera SPA - Reporte Ejecutivo");
            content.endText();

            content.beginText();
            content.setNonStrokingColor(17, 24, 39);
            content.setFont(PDType1Font.HELVETICA_BOLD, 20);
            content.newLineAtOffset(50, 690);
            content.showText(safe(report.getTitle()));
            content.endText();

            content.setStrokingColor(139, 92, 246);
            content.setLineWidth(2);
            content.moveTo(50, 675);
            content.lineTo(560, 675);
            content.stroke();

            drawLabelValue(content, "Tipo de reporte:", safe(report.getType()), 50, 635);
            drawLabelValue(content, "Creado por:", safe(report.getCreatedBy()), 50, 610);
            drawLabelValue(content, "Fecha:", report.getCreatedAt() != null ? report.getCreatedAt().toString() : "Sin fecha", 50, 585);

            content.setNonStrokingColor(248, 250, 252);
            content.addRect(50, 360, 510, 180);
            content.fill();

            content.beginText();
            content.setNonStrokingColor(17, 24, 39);
            content.setFont(PDType1Font.HELVETICA_BOLD, 14);
            content.newLineAtOffset(70, 510);
            content.showText("Descripción del reporte");
            content.endText();

            content.beginText();
            content.setNonStrokingColor(31, 41, 55);
            content.setFont(PDType1Font.HELVETICA, 12);
            content.newLineAtOffset(70, 480);
            content.showText(safe(report.getDescription()));
            content.endText();

            content.setStrokingColor(226, 232, 240);
            content.setLineWidth(1);
            content.moveTo(50, 80);
            content.lineTo(560, 80);
            content.stroke();

            content.beginText();
            content.setNonStrokingColor(100, 116, 139);
            content.setFont(PDType1Font.HELVETICA, 10);
            content.newLineAtOffset(50, 55);
            content.showText("Documento generado automáticamente por Plataforma Cordillera SPA.");
            content.endText();

            content.close();

            document.save(output);
            return output.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generando PDF", e);
        }
    }

    private void drawLabelValue(PDPageContentStream content, String label, String value, int x, int y) throws Exception {
        content.beginText();
        content.setNonStrokingColor(31, 41, 55);
        content.setFont(PDType1Font.HELVETICA_BOLD, 12);
        content.newLineAtOffset(x, y);
        content.showText(label);
        content.endText();

        content.beginText();
        content.setNonStrokingColor(31, 41, 55);
        content.setFont(PDType1Font.HELVETICA, 12);
        content.newLineAtOffset(x + 120, y);
        content.showText(value);
        content.endText();
    }

    private String safe(String value) {
        return value != null && !value.trim().isEmpty() ? value : "Sin información";
    }

    private ReportResponse mapToResponse(Report r) {
        return new ReportResponse(
                r.getId(),
                r.getTitle(),
                r.getDescription(),
                r.getType(),
                r.getCreatedBy(),
                r.getCreatedAt()
        );
    }
}