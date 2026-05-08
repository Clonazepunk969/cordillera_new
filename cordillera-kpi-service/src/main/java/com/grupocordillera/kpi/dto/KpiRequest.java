package com.grupocordillera.kpi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class KpiRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @NotBlank(message = "El tipo es obligatorio")
    private String type;

    @NotNull(message = "El valor de entrada es obligatorio")
    private Double inputValue;

    public KpiRequest() {
    }

    public KpiRequest(String name, String type, Double inputValue) {
        this.name = name;
        this.type = type;
        this.inputValue = inputValue;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public Double getInputValue() {
        return inputValue;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setInputValue(Double inputValue) {
        this.inputValue = inputValue;
    }
}