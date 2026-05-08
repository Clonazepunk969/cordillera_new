import { useEffect, useMemo, useState } from "react";
import { createReport, getReports, downloadReportPdf } from "../service/reportService";
import { resetPassword } from "../service/authResetService";
import "./analyst.css";
import logo from "../assets/logo.png";

function IconHome() { return <span>⌂</span>; }
function IconReport() { return <span>▣</span>; }
function IconChart() { return <span>◔</span>; }
function IconBell() { return <span>♡</span>; }
function IconProfile() { return <span>♙</span>; }
function IconLock() { return <span>▢</span>; }
function IconLogout() { return <span>↪</span>; }

export default function AnalystDashboard({ onLogout }) {
    const username = localStorage.getItem("username") || "Analista";
    const avatarKey = `profileAvatar_${username}`;

    const [activeTab, setActiveTab] = useState("dashboard");
    const [reports, setReports] = useState([]);
    const [profileAvatar, setProfileAvatar] = useState(localStorage.getItem(avatarKey) || "");

    const [form, setForm] = useState({
        title: "",
        description: "",
        type: "VENTAS",
    });

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordMessageType, setPasswordMessageType] = useState("");

    const fetchReports = async () => {
        try {
        const data = await getReports();
        setReports(data || []);
        } catch (error) {
        console.error("Error cargando reportes:", error);
        }
    };

    useEffect(() => {
        fetchReports();

        const interval = setInterval(() => {
        fetchReports();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const myReports = useMemo(() => {
        return reports.filter((report) => report.createdBy === username);
    }, [reports, username]);

    const reportsByType = useMemo(() => {
        const grouped = {};

        myReports.forEach((report) => {
        const type = report.type || "SIN TIPO";
        grouped[type] = (grouped[type] || 0) + 1;
        });

        const total = myReports.length || 1;

        return Object.entries(grouped).map(([type, count]) => ({
        type,
        count,
        percent: Math.round((count / total) * 100),
        }));
    }, [myReports]);

    const donutBackground = useMemo(() => {
        if (reportsByType.length === 0) {
        return "conic-gradient(#e5e7eb 0deg 360deg)";
        }

        const colors = ["#8b5cf6", "#f59e0b", "#22c55e", "#3b82f6", "#ec4899"];
        let start = 0;

        const parts = reportsByType.map((item, index) => {
        const degrees = (item.percent / 100) * 360;
        const end = start + degrees;
        const part = `${colors[index % colors.length]} ${start}deg ${end}deg`;
        start = end;
        return part;
        });

        return `conic-gradient(${parts.join(", ")})`;
    }, [reportsByType]);

    const latestReports = useMemo(() => {
        return [...myReports]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);
    }, [myReports]);

    const totalTypes = reportsByType.length;
    const today = new Date().toLocaleDateString("es-CL");

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {
        localStorage.setItem(avatarKey, reader.result);
        setProfileAvatar(reader.result);
        };

        reader.readAsDataURL(file);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleCreateReport = async (e) => {
        e.preventDefault();

        try {
        await createReport({
            ...form,
            createdBy: username,
        });

        setMessage("Reporte creado correctamente");
        setMessageType("success");

        setForm({
            title: "",
            description: "",
            type: "VENTAS",
        });

        await fetchReports();
        setActiveTab("dashboard");
        } catch (err) {
        console.error("ERROR CREANDO REPORTE:", err);
        setMessage("No se pudo crear el reporte");
        setMessageType("error");
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
        setPasswordMessage("La confirmación no coincide con la nueva contraseña");
        setPasswordMessageType("error");
        return;
        }

        try {
        await resetPassword({
            username,
            newPassword,
        });

        setPasswordMessage("Contraseña actualizada correctamente");
        setPasswordMessageType("success");
        setNewPassword("");
        setConfirmPassword("");
        } catch (err) {
        console.error("Error cambiando contraseña:", err);
        setPasswordMessage("No se pudo actualizar la contraseña");
        setPasswordMessageType("error");
        }
    };

    const renderDashboard = () => (
        <>
        <section className="analyst-stats">
            <article className="analyst-stat-card">
            <div className="stat-icon purple">▣</div>
            <div>
                <span>Reportes Generados</span>
                <strong>{myReports.length}</strong>
                <p>Total de reportes creados</p>
                <small>↑ En tiempo real</small>
            </div>
            </article>

            <article className="analyst-stat-card">
            <div className="stat-icon green">◔</div>
            <div>
                <span>Tipos de Reportes</span>
                <strong>{totalTypes}</strong>
                <p>Categorías utilizadas</p>
                <small>↑ Clasificación activa</small>
            </div>
            </article>

            <article className="analyst-stat-card">
            <div className="stat-icon blue">▤</div>
            <div>
                <span>Este Mes</span>
                <strong>{myReports.length}</strong>
                <p>Reportes generados</p>
                <small>↑ Mes actual</small>
            </div>
            </article>

            <article className="analyst-stat-card">
            <div className="stat-icon orange">◷</div>
            <div>
                <span>Última Actividad</span>
                <strong>Hoy</strong>
                <p>{today}</p>
                <small>En tiempo real</small>
            </div>
            </article>
        </section>

        <section className="analyst-main-grid">
            <article className="analyst-card analysis-card">
            <div className="card-title-row">
                <div>
                <h3>Análisis por tipo de reporte</h3>
                <p>Distribución porcentual de reportes generados</p>
                </div>
                <button className="dots-btn">⋮</button>
            </div>

            <div className="donut-area">
                <div className="donut-chart" style={{ background: donutBackground }}>
                <div className="donut-center"></div>
                </div>

                <div className="donut-legend">
                {reportsByType.length === 0 ? (
                    <div className="empty-analysis">No hay reportes para analizar.</div>
                ) : (
                    reportsByType.map((item, index) => (
                    <div className="legend-row" key={item.type}>
                        <div>
                        <span className={`legend-dot dot-${index}`}></span>
                        <strong>{item.type}</strong>
                        <p>{item.count} reportes</p>
                        </div>
                        <b>{item.percent}%</b>
                    </div>
                    ))
                )}
                </div>
            </div>
            </article>

            <article className="analyst-card recent-card">
            <div className="card-title-row">
                <div>
                <h3>Actividad Reciente</h3>
                <p>Tus últimas acciones en la plataforma</p>
                </div>
            </div>

            <div className="recent-list">
                {latestReports.length === 0 ? (
                <div className="empty-analysis">Aún no tienes actividad reciente.</div>
                ) : (
                latestReports.map((report) => (
                    <div className="recent-item" key={report.id}>
                    <div className="recent-icon">▣</div>
                    <div>
                        <strong>Reporte creado</strong>
                        <p>{report.title}</p>
                    </div>
                    <span>{formatDate(report.createdAt)}</span>
                    </div>
                ))
                )}
            </div>
            </article>
        </section>

        <section className="analyst-card">
            <div className="card-title-row">
            <div>
                <h3>Mis Reportes Generados</h3>
                <p>Historial de todos tus reportes</p>
            </div>

            <button className="primary-action" onClick={() => setActiveTab("reports")}>
                Crear reporte
            </button>
            </div>

            <ReportTable reports={myReports} showPdf={true} />
        </section>
        </>
    );

    const renderReports = () => (
        <section className="report-workspace">
        <article className="analyst-card">
            <h3>Crear reporte</h3>
            <p className="section-subtitle">
            Completa la información para registrar un nuevo reporte.
            </p>

            <form className="analyst-form" onSubmit={handleCreateReport}>
            <div>
                <label>Título</label>
                <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ej: Reporte ventas zona norte"
                required
                />
            </div>

            <div>
                <label>Tipo</label>
                <select name="type" value={form.type} onChange={handleChange}>
                <option value="VENTAS">VENTAS</option>
                <option value="MERCADO">MERCADO</option>
                <option value="DATOS">DATOS</option>
                <option value="INVENTARIO">INVENTARIO</option>
                <option value="RENTABILIDAD">RENTABILIDAD</option>
                <option value="PDF">PDF</option>
                </select>
            </div>

            <div>
                <label>Descripción</label>
                <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe el contenido del reporte"
                rows="6"
                />
            </div>

            <button type="submit">Crear reporte</button>

            {message && (
                <span className={`analyst-message ${messageType}`}>
                {message}
                </span>
            )}
            </form>
        </article>

        <article className="analyst-card">
            <h3>Mis reportes</h3>
            <p className="section-subtitle">
            Reportes registrados por el usuario actual.
            </p>

            <ReportTable reports={myReports} showPdf={true} />
        </article>
        </section>
    );

    const renderAnalysis = () => (
        <section className="analysis-full">
        <div className="analyst-card">
            <h3>Análisis de reportes</h3>
            <p className="section-subtitle">
            Resumen visual de tus reportes generados por categoría.
            </p>

            <div className="donut-area large">
            <div className="donut-chart large" style={{ background: donutBackground }}>
                <div className="donut-center"></div>
            </div>

            <div className="donut-legend">
                {reportsByType.length === 0 ? (
                <div className="empty-analysis">No hay reportes para analizar.</div>
                ) : (
                reportsByType.map((item, index) => (
                    <div className="legend-row" key={item.type}>
                    <div>
                        <span className={`legend-dot dot-${index}`}></span>
                        <strong>{item.type}</strong>
                        <p>{item.count} reportes</p>
                    </div>
                    <b>{item.percent}%</b>
                    </div>
                ))
                )}
            </div>
            </div>
        </div>

        <div className="analyst-card">
            <h3>Historial de reportes</h3>
            <p className="section-subtitle">
            Registro completo de reportes generados por este analista.
            </p>

            <ReportTable reports={myReports} showPdf={false} />
        </div>
        </section>
    );

    const renderAlerts = () => (
        <section className="analyst-card">
        <h3>Alertas</h3>
        <p className="section-subtitle">Estado general del módulo analista.</p>

        <div className="alert-list">
            <div className="alert-box success">Reportes sincronizados con administración.</div>
            <div className="alert-box info">La vista se actualiza automáticamente cada 5 segundos.</div>
            <div className="alert-box warning">Los reportes PDF reales están disponibles en Mis Reportes.</div>
        </div>
        </section>
    );

    const renderProfile = () => (
        <div className="profile-layout">
        <article className="analyst-card profile-card">
            <div className="profile-avatar-wrap">
            {profileAvatar ? (
                <img src={profileAvatar} alt="avatar" />
            ) : (
                <div className="profile-avatar-fallback">{username.charAt(0)}</div>
            )}
            </div>

            <label className="upload-avatar-btn">
            Subir imagen
            <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
            </label>

            <h2>{username}</h2>
            <span>@{username.toLowerCase().replace(/\s+/g, "")}</span>

            <div className="analyst-role">Analista</div>

            <p>Generación y análisis de reportes operacionales.</p>
        </article>

        <article className="analyst-card profile-summary">
            <h3>Resumen</h3>

            <div className="profile-row">
            <span>Usuario</span>
            <strong>{username}</strong>
            </div>
            <div className="profile-row">
            <span>Rol</span>
            <strong>Analista</strong>
            </div>
            <div className="profile-row">
            <span>Estado</span>
            <strong>Activo</strong>
            </div>
            <div className="profile-row">
            <span>Reportes</span>
            <strong>{myReports.length}</strong>
            </div>
            <div className="profile-row">
            <span>Categorías</span>
            <strong>{totalTypes}</strong>
            </div>
        </article>
        </div>
    );

    const renderPassword = () => (
        <section className="analyst-card password-card">
        <h3>Cambiar contraseña</h3>
        <p className="section-subtitle">Actualiza tu contraseña de acceso.</p>

        <form className="analyst-form" onSubmit={handleChangePassword}>
            <div>
            <label>Nueva contraseña</label>
            <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                required
            />
            </div>

            <div>
            <label>Confirmar nueva contraseña</label>
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu nueva contraseña"
                required
            />
            </div>

            <button type="submit">Guardar cambios</button>

            {passwordMessage && (
            <span className={`analyst-message ${passwordMessageType}`}>
                {passwordMessage}
            </span>
            )}
        </form>
        </section>
    );

    const renderContent = () => {
        if (activeTab === "dashboard") return renderDashboard();
        if (activeTab === "reports") return renderReports();
        if (activeTab === "analysis") return renderAnalysis();
        if (activeTab === "alerts") return renderAlerts();
        if (activeTab === "profile") return renderProfile();
        if (activeTab === "password") return renderPassword();

        return renderDashboard();
    };

    return (
        <div className="analyst-shell">
        <aside className="analyst-sidebar">
            <div>
            <div className="analyst-user-box">
                <div className="analyst-avatar">
                {profileAvatar ? (
                    <img src={profileAvatar} alt="avatar" />
                ) : (
                    username.charAt(0)
                )}
                </div>

                <h2>{username}</h2>
                <p>@{username.toLowerCase().replace(/\s+/g, "")}</p>
                <span>Analista</span>
                <small>● En línea</small>
            </div>

            <div className="analyst-group-title">Navegación</div>

            <nav className="analyst-nav">
                <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
                <IconHome /> Dashboard
                </button>
                <button className={activeTab === "reports" ? "active" : ""} onClick={() => setActiveTab("reports")}>
                <IconReport /> Mis Reportes
                </button>
                <button className={activeTab === "analysis" ? "active" : ""} onClick={() => setActiveTab("analysis")}>
                <IconChart /> Análisis
                </button>
                <button className={activeTab === "alerts" ? "active" : ""} onClick={() => setActiveTab("alerts")}>
                <IconBell /> Alertas
                </button>
            </nav>

            <div className="analyst-group-title">Cuenta</div>

            <nav className="analyst-nav">
                <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
                <IconProfile /> Mi perfil
                </button>
                <button className={activeTab === "password" ? "active" : ""} onClick={() => setActiveTab("password")}>
                <IconLock /> Cambiar contraseña
                </button>
                <button className="danger" onClick={onLogout}>
                <IconLogout /> Cerrar sesión
                </button>
            </nav>
            </div>

            <div className="analyst-brand-card">
            <img src={logo} alt="Cordillera SPA" />
            <strong>Cordillera SPA</strong>
            <p>Inteligencia que transforma decisiones en resultados.</p>
            </div>
        </aside>

        <main className="analyst-main">
            <header className="analyst-topbar">
            <div className="topbar-left">
                <div>
                <h1>
                    Panel de <span>Analista</span>
                </h1>
                <p>Genera reportes y analiza información en tiempo real</p>
                </div>
            </div>

            <div className="topbar-right">
                <button
                className="analyst-user-chip"
                onClick={() => setActiveTab("profile")}
                type="button"
                >
                <div className="analyst-user-chip-avatar">
                    {profileAvatar ? (
                    <img src={profileAvatar} alt="avatar" />
                    ) : (
                    username.charAt(0)
                    )}
                </div>
                <span>{username}</span>
                </button>
            </div>
            </header>

            {renderContent()}
        </main>
        </div>
    );
    }

    function ReportTable({ reports, showPdf }) {
    if (reports.length === 0) {
        return <div className="empty-analysis">No hay reportes generados.</div>;
    }

    return (
        <div className="analyst-table">
        <div className="analyst-table-head">
            <span>Título</span>
            <span>Tipo</span>
            <span>Descripción</span>
            <span>Fecha de creación</span>
            {showPdf && <span>Acciones</span>}
        </div>

        {reports.map((report) => (
            <div className={`analyst-table-row ${!showPdf ? "no-actions" : ""}`} key={report.id}>
            <div className="table-title">
                <span className="table-icon">▣</span>
                <strong>{report.title}</strong>
            </div>

            <span className="type-chip">{report.type}</span>
            <p>{report.description || "Sin descripción"}</p>
            <span>{formatDate(report.createdAt)}</span>

            {showPdf && (
                <button
                type="button"
                className="pdf-btn"
                onClick={async () => {
                    try {
                    const blob = await downloadReportPdf(report.id);

                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");

                    link.href = url;
                    link.download = `reporte_${report.id}.pdf`;
                    document.body.appendChild(link);
                    link.click();

                    link.remove();
                    window.URL.revokeObjectURL(url);
                    } catch (error) {
                    console.error("Error descargando PDF:", error);
                    alert("No se pudo descargar el PDF");
                    }
                }}
                >
                Descargar PDF ↗
                </button>
            )}
            </div>
        ))}
        </div>
    );
    }

    function formatDate(value) {
    if (!value) return "Sin fecha";

    try {
        return new Date(value).toLocaleString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        });
    } catch {
        return value;
    }
    }