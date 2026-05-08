package com.grupocordillera.kpi.strategy;

import org.springframework.stereotype.Component;

@Component
public class SalesKpiStrategy implements KpiCalculationStrategy {

    @Override
    public double calculate(double inputValue) {
        return inputValue * 1.10;
    }
}