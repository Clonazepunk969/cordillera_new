package com.grupocordillera.report.dto;

import jakarta.validation.constraints.NotBlank;

public class ReportRequest {

    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String type;

    private String createdBy;

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getType() {
        return type;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}