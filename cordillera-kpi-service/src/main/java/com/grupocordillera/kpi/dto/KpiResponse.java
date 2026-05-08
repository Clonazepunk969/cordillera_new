package com.grupocordillera.kpi.dto;

public class KpiResponse {

    private Long id;
    private String name;
    private String type;
    private Double inputValue;
    private Double resultValue;
    private String status;

    public KpiResponse() {
    }

    public KpiResponse(Long id, String name, String type, Double inputValue, Double resultValue, String status) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.inputValue = inputValue;
        this.resultValue = resultValue;
        this.status = status;
    }

    public Long getId() {
        return id;
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

    public Double getResultValue() {
        return resultValue;
    }

    public String getStatus() {
        return status;
    }

    public void setId(Long id) {
        this.id = id;
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

    public void setResultValue(Double resultValue) {
        this.resultValue = resultValue;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}