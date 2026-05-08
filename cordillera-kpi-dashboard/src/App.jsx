import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AnalystDashboard from "./pages/AnalystDashboard";
import { validateToken } from "./service/authSessionService";

function App() {
  const [view, setView] = useState("login");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [loading, setLoading] = useState(true);

  const goByRole = (userRole) => {
    if (userRole === "ANALISTA") {
      setView("analyst");
    } else {
      setView("dashboard");
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");

      if (!token) {
        setView("login");
        setLoading(false);
        return;
      }

      try {
        await validateToken();
        setRole(storedRole || "ADMIN");
        goByRole(storedRole || "ADMIN");
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        setView("login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLoginSuccess = () => {
    const userRole = localStorage.getItem("role") || "ADMIN";
    setRole(userRole);
    goByRole(userRole);
  };

  const handleGoRegister = () => {
    setView("register");
  };

  const handleBackToLogin = () => {
    setView("login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setView("login");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b1220",
          color: "white",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        Validando sesión...
      </div>
    );
  }

  return (
    <>
      {view === "login" && (
        <Login
          onLogin={handleLoginSuccess}
          goRegister={handleGoRegister}
        />
      )}

      {view === "register" && (
        <Register
          onRegister={handleBackToLogin}
        />
      )}

      {view === "dashboard" && (
        <Dashboard
          onLogout={handleLogout}
        />
      )}

      {view === "analyst" && (
        <AnalystDashboard
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

export default App;