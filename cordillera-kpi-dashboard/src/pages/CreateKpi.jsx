import { useState } from "react";
import { createKpi } from "../service/kpiService";

export default function CreateKpi({ onKpiCreated }) {
    const [name, setName] = useState("");
    const [type, setType] = useState("sales");
    const [inputValue, setInputValue] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        await createKpi({
            name,
            type,
            inputValue: Number(inputValue),
        });

        setMensaje("KPI creado correctamente");
        setTipoMensaje("success");

        setName("");
        setType("sales");
        setInputValue("");

        if (onKpiCreated) {
            onKpiCreated();
        }
        } catch (error) {
        console.error("Error al crear KPI:", error);
        setMensaje(
            error.response?.data?.message ||
            error.response?.data?.error ||
            "No se pudo crear el KPI"
        );
        setTipoMensaje("error");
        }
    };

    return (
        <div className="dashboard-card">
        <h2>Crear KPI</h2>
        <p>Registra un nuevo indicador para el análisis organizacional.</p>

        <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-group">
            <label>Nombre del KPI</label>
            <input
                type="text"
                placeholder="Ej: Ventas Mensuales"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            </div>

            <div className="auth-group">
            <label>Tipo de KPI</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="sales">Ventas</option>
                <option value="inventory">Inventario</option>
                <option value="profitability">Rentabilidad</option>
            </select>
            </div>

            <div className="auth-group">
            <label>Valor base</label>
            <input
                type="number"
                placeholder="Ej: 150"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
            />
            </div>

            <button type="submit" className="auth-primary-btn">
            Crear KPI
            </button>
        </form>

        {mensaje && (
            <div className={`auth-message ${tipoMensaje}`}>
            {mensaje}
            </div>
        )}
        </div>
    );
}