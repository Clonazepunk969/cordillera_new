import { useEffect, useState } from "react";
import api from "../api/api";
import logo from "../assets/logo.png";

export default function KpiList() {
    const [kpis, setKpis] = useState([]);
    const [reports, setReports] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
        try {
            const response = await api.get("/api/dashboard");
            setKpis(response.data.kpis || []);
            setReports(response.data.reports || []);
        } catch (err) {
            console.error(err);
            setError("No se pudo cargar la información del dashboard");
        }
        };

        fetchDashboard();
    }, []);

    return (
        <div style={{ padding: "20px", color: "white" }}>
        <h1>Dashboard Grupo Cordillera</h1>

        {error && <p>{error}</p>}

        <section style={{ marginTop: "20px" }}>
            <h2>KPIs</h2>
            {kpis.length === 0 ? (
            <p>No hay KPIs registrados.</p>
            ) : (
            kpis.map((kpi) => (
                <div
                key={kpi.id}
                style={{
                    border: "1px solid #555",
                    borderRadius: "8px",
                    padding: "12px",
                    marginBottom: "12px",
                }}
                >
                <p><strong>ID:</strong> {kpi.id}</p>
                <p><strong>Nombre:</strong> {kpi.name}</p>
                <p><strong>Tipo:</strong> {kpi.type}</p>
                <p><strong>Valor de entrada:</strong> {kpi.inputValue}</p>
                <p><strong>Resultado:</strong> {kpi.resultValue}</p>
                <p><strong>Estado:</strong> {kpi.status}</p>
                </div>
            ))
            )}
        </section>

        <section style={{ marginTop: "30px" }}>
            <h2>Reportes</h2>
            {reports.length === 0 ? (
            <p>No hay reportes registrados.</p>
            ) : (
            reports.map((report) => (
                <div
                key={report.id}
                style={{
                    border: "1px solid #555",
                    borderRadius: "8px",
                    padding: "12px",
                    marginBottom: "12px",
                }}
                >
                <p><strong>ID:</strong> {report.id}</p>
                <p><strong>Título:</strong> {report.title}</p>
                <p><strong>Descripción:</strong> {report.description}</p>
                <p><strong>Tipo:</strong> {report.type}</p>
                <p><strong>Fecha creación:</strong> {report.createdAt}</p>
                </div>
            ))
            )}
        </section>
        </div>
    );
}