package com.grupocordillera.kpi.repository;

import com.grupocordillera.kpi.model.Kpi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KpiRepository extends JpaRepository<Kpi, Long> {
}