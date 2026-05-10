# Grupo Cordillera – Plataforma de Monitoreo Inteligente

## Descripción del Proyecto

Este repositorio contiene el desarrollo del proyecto semestral **Grupo Cordillera**, una plataforma orientada al monitoreo inteligente del desempeño organizacional mediante una arquitectura basada en microservicios.

La solución fue diseñada para permitir la gestión de KPIs, generación de reportes, autenticación de usuarios y visualización de información mediante una arquitectura moderna, escalable y desacoplada utilizando tecnologías actuales de desarrollo backend y frontend.

El proyecto implementa una arquitectura distribuida utilizando:

- Spring Boot
- React
- PostgreSQL
- Docker
- Kubernetes
- API REST
- Maven
- Git/GitHub

---

# Arquitectura General

La solución se encuentra organizada bajo una arquitectura de microservicios, donde cada servicio cumple una responsabilidad específica dentro de la plataforma.

```text
Frontend React
        ↓
Backend For Frontend (BFF)
        ↓
 ┌──────────────────────────────┐
 │          Microservicios      │
 ├──────────────────────────────┤
 │ Auth Service                 │
 │ KPI Service                  │
 │ Report Service               │
 └──────────────────────────────┘
        ↓
 PostgreSQL / Supabase
```

---

# Proyectos incluidos

## 1. cordillera-auth-service

Microservicio encargado de la autenticación y gestión de usuarios.

### Funcionalidades
- Inicio de sesión
- Registro de usuarios
- Gestión de roles
- JWT Authentication
- Seguridad con Spring Security
- Recuperación de contraseña

### Tecnologías
- Spring Boot
- Spring Security
- JWT
- PostgreSQL
- JPA

---

## 2. cordillera-kpi-service

Microservicio encargado de la gestión y cálculo de KPIs empresariales.

### Funcionalidades
- Creación de KPIs
- Cálculo dinámico mediante patrones Strategy
- Gestión de estados de KPIs
- Persistencia de indicadores

### Patrones Implementados
- Strategy Pattern
- Factory Pattern

### Tecnologías
- Spring Boot
- JPA
- PostgreSQL

---

## 3. cordillera-report-service

Microservicio encargado de la generación y administración de reportes.

### Funcionalidades
- Creación de reportes
- Consulta de reportes
- Exportación PDF
- Gestión de historial

### Tecnologías
- Spring Boot
- Apache PDFBox
- PostgreSQL

---

## 4. cordillera-bff

Backend For Frontend encargado de centralizar la comunicación entre el frontend y los microservicios.

### Funcionalidades
- Integración de servicios
- Orquestación de peticiones
- Centralización de endpoints
- Simplificación de consumo para React

### Tecnologías
- Spring Boot
- RestTemplate
- API REST

---

## 5. cordillera-kpi-dashboard

Frontend principal del sistema desarrollado en React.

### Funcionalidades
- Dashboard interactivo
- Visualización de KPIs
- Gestión de reportes
- Consumo de APIs REST
- Interfaz moderna y responsiva

### Tecnologías
- React
- JavaScript
- CSS
- Axios

---

## 6. docker/postgres/init

Configuraciones relacionadas con Docker y scripts de inicialización de base de datos.

### Funcionalidades
- Inicialización de contenedores
- Configuración de PostgreSQL
- Soporte para entornos locales y despliegue

---

# Tecnologías Utilizadas

| Tecnología | Uso |
|---|---|
| Spring Boot | Desarrollo backend |
| React | Frontend |
| PostgreSQL | Base de datos |
| Docker | Contenerización |
| Kubernetes | Orquestación |
| Maven | Gestión de dependencias |
| JWT | Seguridad |
| Git/GitHub | Versionamiento |
| Supabase | Base de datos cloud |

---

# Estructura del Repositorio

```text
cordillera_new/
│
├── cordillera-auth-service
├── cordillera-bff
├── cordillera-kpi-dashboard
├── cordillera-kpi-service
├── cordillera-report-service
├── docker/postgres/init
└── docker-compose.yml
```

---

# Ejecución del Proyecto

## Requisitos

- Java 17
- Maven
- Node.js
- Docker Desktop
- PostgreSQL

---

## Backend

Ejecutar cada microservicio:

```bash
mvn spring-boot:run
```

---

## Frontend React

```bash
npm install
npm run dev
```

---

## Docker

```bash
docker compose up --build
```

---

# Bases de Datos

Cada microservicio posee su propia base de datos independiente para mantener el desacoplamiento de la arquitectura.

| Microservicio | Base de Datos |
|---|---|
| auth-service | cordillera_auth_db |
| kpi-service | cordillera_kpi_db |
| report-service | cordillera_report_db |

La solución soporta PostgreSQL local y Supabase como entorno cloud.

---

# Seguridad Implementada

La autenticación se realiza mediante JWT (JSON Web Token), permitiendo proteger endpoints y validar sesiones de usuario de manera segura.

Además, se implementó:

- Spring Security
- Filtros JWT
- Roles de usuario
- Validación de credenciales
- Protección de endpoints

---

# Patrones de Diseño Aplicados

## Strategy Pattern
Utilizado para el cálculo dinámico de distintos tipos de KPIs.

## Factory Pattern
Utilizado para seleccionar automáticamente la estrategia de cálculo correspondiente.

## Arquitectura BFF
Implementada para desacoplar el frontend de los microservicios backend.

---

# Objetivo del Proyecto

Desarrollar una plataforma empresarial moderna basada en microservicios que permita monitorear indicadores organizacionales, administrar reportes y centralizar información estratégica mediante tecnologías escalables y desacopladas.

---

# Integrantes

- Massimo Navarrete
- Javiera Tapia
- Alexis Perez
- Camila Ibarra
- Fernanda Collinao

---

# Estado del Proyecto

Proyecto en desarrollo académico y tecnológico orientado a arquitectura moderna de software empresarial.
