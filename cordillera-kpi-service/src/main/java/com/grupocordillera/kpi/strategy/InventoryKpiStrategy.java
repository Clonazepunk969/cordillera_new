package com.grupocordillera.kpi.strategy;

import org.springframework.stereotype.Component;

@Component
public class InventoryKpiStrategy implements KpiCalculationStrategy {

    @Override
    public double calculate(double inputValue) {
        return inputValue * 0.95;
    }
}