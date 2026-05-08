import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import logo from "../assets/logo.png";
import "./dashboard.css";
import { resetPassword } from "../service/authResetService";

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19V5" />
      <path d="M4 19H20" />
      <path d="M8 15l3-4 3 2 4-6" />
    </svg>
  );
}

function IconFile() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}

function IconProfile() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

function IconBox() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-6-3.43a2 2 0 0 0-2 0l-6 3.43A2 2 0 0 0 5 8v8a2 2 0 0 0 1 1.73l6 3.43a2 2 0 0 0 2 0l6-3.43A2 2 0 0 0 21 16z" />
      <path d="M3.3 7l8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function IconDollar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M14.8 9.2a3 3 0 0 0-2.8-1.2c-1.8 0-3 .8-3 2.1 0 1.2.9 1.8 2.8 2.2 2.2.4 3.2 1 3.2 2.5 0 1.3-1.2 2.2-3 2.2a3.7 3.7 0 0 1-3.2-1.5" />
      <path d="M12 6v12" />
    </svg>
  );
}

function IconReport() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16l4-2 4 2 4-2 4 2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [kpis, setKpis] = useState([]);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  const username = localStorage.getItem("username") || "Juan Díaz";
  const profileName = localStorage.getItem("username") || username;
  const profileBio = "Administrador de Cordillera SPA";

  const avatarKey = `profileAvatar_${profileName}`;

  const [profileAvatar, setProfileAvatar] = useState(
    localStorage.getItem(avatarKey) || ""
  );

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordMessageType, setPasswordMessageType] = useState("");

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/api/dashboard");
      setKpis(response.data?.kpis || []);
      setReports(response.data?.reports || []);
      setError("");
    } catch (err) {
      console.error("Error dashboard:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        sessionStorage.removeItem("profileAvatar");
        onLogout();
        return;
      }

      setError("No se pudo cargar la información del dashboard");
    }
  };

  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(() => {
      fetchDashboard();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const salesKpis = useMemo(() => kpis.filter((kpi) => kpi.type === "sales"), [kpis]);
  const inventoryKpis = useMemo(() => kpis.filter((kpi) => kpi.type === "inventory"), [kpis]);
  const profitabilityKpis = useMemo(() => kpis.filter((kpi) => kpi.type === "profitability"), [kpis]);

  const totalSales = useMemo(
    () => salesKpis.reduce((acc, item) => acc + Number(item.resultValue || 0), 0),
    [salesKpis]
  );

  const totalInventory = useMemo(
    () => inventoryKpis.reduce((acc, item) => acc + Number(item.resultValue || 0), 0),
    [inventoryKpis]
  );

  const totalProfitability = useMemo(
    () => profitabilityKpis.reduce((acc, item) => acc + Number(item.resultValue || 0), 0),
    [profitabilityKpis]
  );

  const reportDailyTrend = useMemo(() => {
    const grouped = {};

    reports.forEach((report) => {
      if (!report.createdAt) return;

      const date = report.createdAt.substring(0, 10);
      grouped[date] = (grouped[date] || 0) + 1;
    });

    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
      .slice(-7)
      .map(([date, count]) => ({
        label: date.substring(5),
        count,
      }));
  }, [reports]);

  const maxReportsByDay = Math.max(
    ...reportDailyTrend.map((item) => item.count),
    1
  );

  const activities = [
    {
      color: "green",
      title: "Dashboard actualizado",
      description: "Los datos se refrescan automáticamente cada 5 segundos.",
      time: "Tiempo real",
    },
    {
      color: "purple",
      title: "KPIs sincronizados",
      description: `Actualmente existen ${kpis.length} KPIs registrados.`,
      time: "Ahora",
    },
    {
      color: "blue",
      title: "Reportes sincronizados",
      description: `Actualmente existen ${reports.length} reportes disponibles.`,
      time: "Ahora",
    },
  ];

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

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordMessage("La confirmación no coincide con la nueva contraseña");
      setPasswordMessageType("error");
      return;
    }

    try {
      await resetPassword({
        username: profileName,
        newPassword,
      });

      setPasswordMessage("Contraseña actualizada correctamente");
      setPasswordMessageType("success");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error cambiando contraseña:", err);
      setPasswordMessage(
        err.response?.data?.error || "No se pudo actualizar la contraseña"
      );
      setPasswordMessageType("error");
    }
  };

  const renderDashboard = () => (
    <>
      <section className="mock-stats">
        <article className="mock-card featured">
          <div className="mock-card-icon"><IconChart /></div>
          <div className="mock-card-title">Ventas</div>
          <div className="mock-card-value">{totalSales.toFixed(2)}</div>
          <div className="mock-card-sub">Total KPI ventas</div>
          <div className="mock-pill featured-pill">{salesKpis.length} <span>KPIs ventas</span></div>
        </article>

        <article className="mock-card">
          <div className="mock-card-icon soft"><IconBox /></div>
          <div className="mock-card-title dark">Inventario</div>
          <div className="mock-card-value dark">{totalInventory.toFixed(2)}</div>
          <div className="mock-card-sub dark-sub">Total KPI inventario</div>
          <div className="mock-pill green-pill">{inventoryKpis.length} <span>KPIs inventario</span></div>
        </article>

        <article className="mock-card">
          <div className="mock-card-icon soft"><IconDollar /></div>
          <div className="mock-card-title dark">Rentabilidad</div>
          <div className="mock-card-value dark">{totalProfitability.toFixed(2)}</div>
          <div className="mock-card-sub dark-sub">Total KPI rentabilidad</div>
          <div className="mock-pill green-pill">{profitabilityKpis.length} <span>KPIs rentabilidad</span></div>
        </article>

        <article className="mock-card">
          <div className="mock-card-icon soft"><IconReport /></div>
          <div className="mock-card-title dark">Reportes</div>
          <div className="mock-card-value dark">{reports.length}</div>
          <div className="mock-card-sub dark-sub">Generados</div>
          <div className="mock-pill lilac-pill">Tiempo <span>real</span></div>
        </article>
      </section>

      <section className="mock-grid">
        <div className="mock-panel chart-panel">
          <div className="mock-panel-head">
            <div>
              <h3>Reportes por día</h3>
              <p>Visualización real basada en la fecha de creación de reportes</p>
            </div>
            <div className="mock-filter">Últimos 7 días</div>
          </div>

          <div className="chart-wrapper">
            <div className="chart-y-axis">
              <span>{maxReportsByDay}</span>
              <span>{Math.ceil(maxReportsByDay * 0.8)}</span>
              <span>{Math.ceil(maxReportsByDay * 0.6)}</span>
              <span>{Math.ceil(maxReportsByDay * 0.4)}</span>
              <span>{Math.ceil(maxReportsByDay * 0.2)}</span>
              <span>0</span>
            </div>

            <div className="chart-main">
              <div className="chart-grid-lines">
                <span></span><span></span><span></span><span></span><span></span><span></span>
              </div>

              <div className="chart-bars">
                {reportDailyTrend.length === 0 ? (
                  <div className="empty-box">No hay reportes con fecha para graficar.</div>
                ) : (
                  reportDailyTrend.map((item, index) => (
                    <div className="chart-column" key={item.label}>
                      <div
                        className={`chart-column-bar ${index === reportDailyTrend.length - 1 ? "pink" : ""}`}
                        style={{ height: `${(item.count / maxReportsByDay) * 200}px` }}
                      ></div>
                      <strong className="chart-value">{item.count}</strong>
                      <span>{item.label}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mock-panel summary-panel">
          <div className="mock-panel-head">
            <div>
              <h3>Resumen</h3>
              <p>Estado del monitoreo</p>
            </div>
          </div>

          <div className="summary-line">
            <span>KPIs ventas</span>
            <strong>{salesKpis.length}</strong>
          </div>
          <div className="summary-line">
            <span>KPIs inventario</span>
            <strong>{inventoryKpis.length}</strong>
          </div>
          <div className="summary-line">
            <span>KPIs rentabilidad</span>
            <strong>{profitabilityKpis.length}</strong>
          </div>
          <div className="summary-line">
            <span>Reportes</span>
            <strong>{reports.length}</strong>
          </div>
        </div>

        <div className="mock-panel table-panel">
          <div className="mock-panel-head">
            <div>
              <h3>KPIs registrados</h3>
              <p>Indicadores consolidados del sistema</p>
            </div>
            <div className="mock-badge-count">{kpis.length} items</div>
          </div>

          <div className="mock-table-header">
            <span>Nombre</span>
            <span>Tipo</span>
            <span>Entrada</span>
            <span>Resultado</span>
            <span>Estado</span>
          </div>

          {kpis.length === 0 ? (
            <div className="empty-box">No hay KPIs registrados.</div>
          ) : (
            kpis.map((kpi) => (
              <div className="mock-table-row" key={kpi.id}>
                <div className="mock-table-name">
                  <div className="row-icon">📈</div>
                  <strong>{kpi.name}</strong>
                </div>
                <span>{kpi.type}</span>
                <span>{kpi.inputValue}</span>
                <span>{Number(kpi.resultValue).toFixed(2)}</span>
                <span className="ok-chip">{kpi.status}</span>
              </div>
            ))
          )}
        </div>

        <div className="mock-panel activity-panel">
          <div className="mock-panel-head">
            <div>
              <h3>Actividad reciente</h3>
              <p>Últimas acciones en el sistema</p>
            </div>
          </div>

          <div className="activity-list-clean">
            {activities.map((item, index) => (
              <div className="activity-row-clean" key={index}>
                <div className={`activity-bullet ${item.color}`}></div>
                <div className="activity-copy">
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
                <span>{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );

  const simplePanel = (title, subtitle, content) => (
    <div className="single-view-panel">
      <div className="mock-panel-head">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>
      {content}
    </div>
  );

  const renderContent = () => {
    if (activeTab === "dashboard") return renderDashboard();

    if (activeTab === "kpis") {
      return simplePanel(
        "KPIs",
        "Listado completo de indicadores",
        <div className="mock-list-block">
          {kpis.length === 0 ? (
            <div className="empty-box">No hay KPIs registrados.</div>
          ) : (
            kpis.map((kpi) => (
              <div className="mock-table-row" key={kpi.id}>
                <div className="mock-table-name">
                  <div className="row-icon">📈</div>
                  <strong>{kpi.name}</strong>
                </div>
                <span>{kpi.type}</span>
                <span>{kpi.inputValue}</span>
                <span>{Number(kpi.resultValue).toFixed(2)}</span>
                <span className="ok-chip">{kpi.status}</span>
              </div>
            ))
          )}
        </div>
      );
    }

    if (activeTab === "reports") {
      return simplePanel(
        "Reportes",
        "Documentos y salidas de la plataforma",
        <div className="reports-list-clean">
          {reports.length === 0 ? (
            <div className="empty-box">No hay reportes registrados.</div>
          ) : (
            reports.map((report) => (
              <div className="report-card-clean" key={report.id}>
                <div className="report-type-clean">{report.type}</div>
                <div className="report-copy-clean">
                  <strong>{report.title}</strong>
                  <p>{report.description}</p>
                </div>
                <span>{report.createdAt}</span>
              </div>
            ))
          )}
        </div>
      );
    }

    if (activeTab === "alerts") {
      return simplePanel(
        "Alertas",
        "Notificaciones y eventos relevantes",
        <div className="alerts-clean">
          <div className="alert-clean success">Dashboard actualizado en tiempo real.</div>
          <div className="alert-clean info">BFF operativo correctamente.</div>
          <div className="alert-clean warning">Revisar KPIs sin datos recientes.</div>
        </div>
      );
    }

    if (activeTab === "profile") {
      return (
        <div className="github-profile-layout">
          <div className="github-profile-left">
            <div className="github-avatar-wrap">
              {profileAvatar ? (
                <img src={profileAvatar} alt="avatar" className="github-avatar-img" />
              ) : (
                <div className="github-avatar-fallback">
                  {profileName.charAt(0)}
                </div>
              )}
            </div>

            <label className="upload-avatar-btn">
              Subir imagen
              <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
            </label>

            <h2>{profileName}</h2>
            <span className="username-tag">
              @{profileName.toLowerCase().replace(/\s+/g, "")}
            </span>

            <div className="github-role">Administrador</div>
            <p className="github-bio">{profileBio}</p>
          </div>

          <div className="github-profile-right">
            <div className="github-card">
              <h3>Resumen</h3>

              <div className="info-row">
                <span>Usuario</span>
                <strong>{profileName}</strong>
              </div>

              <div className="info-row">
                <span>Rol</span>
                <strong>Administrador</strong>
              </div>

              <div className="info-row">
                <span>Estado</span>
                <strong>Activo</strong>
              </div>

              <div className="info-row">
                <span>KPIs</span>
                <strong>{kpis.length}</strong>
              </div>

              <div className="info-row">
                <span>Reportes</span>
                <strong>{reports.length}</strong>
              </div>
            </div>

            <div className="github-card">
              <h3>Actividad</h3>

              <div className="github-activity-item">
                <strong>Inicio de sesión reciente</strong>
                <p>Acceso desde panel administrativo.</p>
              </div>

              <div className="github-activity-item">
                <strong>Gestión de KPIs</strong>
                <p>Visualización y seguimiento de indicadores clave.</p>
              </div>

              <div className="github-activity-item">
                <strong>Monitoreo de reportes</strong>
                <p>Revisión de reportes disponibles en la plataforma.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "password") {
      return simplePanel(
        "Cambiar contraseña",
        "Actualiza tu contraseña de acceso",
        <form className="password-form" onSubmit={handleChangePassword}>
          <div className="password-form-group">
            <label>Nueva contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Ingresa tu nueva contraseña"
              required
            />
          </div>

          <div className="password-form-group">
            <label>Confirmar nueva contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirma tu nueva contraseña"
              required
            />
          </div>

          <button type="submit" className="password-save-btn">
            Guardar cambios
          </button>

          {passwordMessage && (
            <div className={`password-message ${passwordMessageType}`}>
              {passwordMessage}
            </div>
          )}
        </form>
      );
    }

    return renderDashboard();
  };

  return (
    <div className="mock-shell">
      <aside className="mock-sidebar">
        <div>
          <div className="mock-user-box">
            <div className="mock-user-avatar">
              {profileAvatar ? (
                <img src={profileAvatar} alt="avatar" className="sidebar-avatar-img" />
              ) : (
                profileName.charAt(0)
              )}
            </div>
            <h3>{profileName}</h3>
            <p>Administrador</p>
            <span className="online-chip">● En línea</span>
          </div>

          <div className="sidebar-group-title">Navegación</div>

          <div className="mock-nav-list">
            <button className={`mock-nav-item ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
              <IconHome /> <span>Dashboard</span>
            </button>
            <button className={`mock-nav-item ${activeTab === "kpis" ? "active" : ""}`} onClick={() => setActiveTab("kpis")}>
              <IconChart /> <span>KPIs</span>
            </button>
            <button className={`mock-nav-item ${activeTab === "reports" ? "active" : ""}`} onClick={() => setActiveTab("reports")}>
              <IconFile /> <span>Reportes</span>
            </button>
            <button className={`mock-nav-item ${activeTab === "alerts" ? "active" : ""}`} onClick={() => setActiveTab("alerts")}>
              <IconBell /> <span>Alertas</span>
            </button>
          </div>

          <div className="sidebar-group-title">Cuenta</div>

          <div className="mock-nav-list">
            <button className={`mock-nav-item ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
              <IconProfile /> <span>Mi perfil</span>
            </button>
            <button className={`mock-nav-item ${activeTab === "password" ? "active" : ""}`} onClick={() => setActiveTab("password")}>
              <IconLock /> <span>Cambiar contraseña</span>
            </button>
            <button className="mock-nav-item danger" onClick={onLogout}>
              <IconLogout /> <span>Cerrar sesión</span>
            </button>
          </div>
        </div>

        <div className="mock-brand-footer">
          <img src={logo} alt="Cordillera SPA" />
          <strong>CORDILLERA SPA</strong>
          <span>Monitoreo inteligente</span>
        </div>
      </aside>

      <main className="mock-main">
        <header className="mock-topbar">
          <div className="mock-topbar-left">
            
            <div>
              <h1><span>Panel de</span> Análisis</h1>
              <p>Plataforma de monitoreo inteligente para el desempeño organizacional</p>
            </div>
          </div>

          <div className="mock-topbar-right">
            <div className="search-wrap">
            </div>

            <button
              className="user-chip-clean clickable-profile"
              onClick={() => setActiveTab("profile")}
              type="button"
            >
              <div className="user-chip-avatar">
                {profileAvatar ? (
                  <img src={profileAvatar} alt="avatar" className="chip-avatar-img" />
                ) : (
                  profileName.charAt(0)
                )}
              </div>
              <span>{profileName}</span>
            </button>
          </div>
        </header>

        {error && <div className="error-banner">{error}</div>}

        {renderContent()}
      </main>
    </div>
  );
}