package com.grupocordillera.kpi.factory;

import com.grupocordillera.kpi.strategy.InventoryKpiStrategy;
import com.grupocordillera.kpi.strategy.KpiCalculationStrategy;
import com.grupocordillera.kpi.strategy.ProfitabilityKpiStrategy;
import com.grupocordillera.kpi.strategy.SalesKpiStrategy;
import org.springframework.stereotype.Component;

@Component
public class KpiStrategyFactory {

    private final SalesKpiStrategy salesKpiStrategy;
    private final InventoryKpiStrategy inventoryKpiStrategy;
    private final ProfitabilityKpiStrategy profitabilityKpiStrategy;

    public KpiStrategyFactory(SalesKpiStrategy salesKpiStrategy,
                            InventoryKpiStrategy inventoryKpiStrategy,
                            ProfitabilityKpiStrategy profitabilityKpiStrategy) {
        this.salesKpiStrategy = salesKpiStrategy;
        this.inventoryKpiStrategy = inventoryKpiStrategy;
        this.profitabilityKpiStrategy = profitabilityKpiStrategy;
    }

    public KpiCalculationStrategy getStrategy(String type) {
        switch (type.toLowerCase()) {
            case "sales":
                return salesKpiStrategy;
            case "inventory":
                return inventoryKpiStrategy;
            case "profitability":
                return profitabilityKpiStrategy;
            default:
                throw new IllegalArgumentException("Tipo de KPI no soportado: " + type);
        }
    }
}