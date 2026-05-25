import { useState, useEffect } from "react";
import ControlAccesoSimulado from "./ControlAccesoSimulado";
import salaService from "../services/salaService";
import accesoService from "../services/accesoService";

function Dashboard() {
  const [totalSalas, setTotalSalas] = useState(0);
  const [salasActivas, setSalasActivas] = useState(0);
  const [totalAccesos, setTotalAccesos] = useState(0);
  const [alertas, setAlertas] = useState(0);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const [salasData, accesosData] = await Promise.all([
        salaService.listar(),
        accesoService.listar(),
      ]);

      setTotalSalas(salasData.length);
      setSalasActivas(salasData.filter((s) => s.estado === true).length);
      setTotalAccesos(accesosData.length);
      setAlertas(accesosData.filter((a) => a.estadoAcceso !== "A").length);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    }
  };

  return (
    <div>
      {/* SECCIÓN HERO */}
      <section className="py-4">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold">
                Aula Inteligente <br />
                <span className="text-primary">Gestión</span> y <br />
                Plataforma de Automatización
              </h1>
              <p className="lead text-secondary mt-3">
                Optimiza la eficiencia institucional con nuestra solución
                centralizada de solicitud de aulas inteligentes y automatización
                en tiempo real.
              </p>
              <div className="d-flex gap-3 mt-4">
                <button className="btn btn-primary btn-lg">
                  Solicitar Aula
                </button>
                <button className="btn btn-outline-secondary btn-lg">
                  Ver Demo
                </button>
              </div>
            </div>
            <div className="col-lg-6 text-center position-relative">
              <div className="p-3 bg-white shadow rounded-4">
                <div className="mockup"></div>
              </div>
              <div className="badge-custom">
                <p className="mb-0">Energía Ahorrada</p>
                <h5 className="fw-bold">24.5% Mensual</h5>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MÓDULO DE CONTROL */}
      <section className="py-4 bg-light rounded-3">
        <div className="container">
          <h2 className="fw-bold">Módulo de Control de Automatización</h2>
          <p className="text-secondary">Panel de monitoreo en tiempo real</p>

          <div className="row g-4 mt-2">
            <div className="col-lg-8">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="card p-3 shadow-sm">
                    <h6>Salas Activas</h6>
                    <h3>
                      {salasActivas}{" "}
                      <small className="text-muted">/ {totalSalas}</small>
                    </h3>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card p-3 shadow-sm">
                    <h6>Total de Accesos</h6>
                    <h3 className="text-primary">{totalAccesos}</h3>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card p-3 shadow-sm">
                    <h6>Alertas</h6>
                    <h3 className="text-danger">
                      {alertas} <small>Sin resolver</small>
                    </h3>
                  </div>
                </div>
              </div>

              <div className="card p-4 mt-4 shadow-sm">
                <h6>Tendencias de Consumo Energético</h6>
                <div className="d-flex align-items-end gap-2 mt-3 chart">
                  {[40, 55, 45, 70, 60, 50, 65, 75, 68].map((height, idx) => (
                    <div
                      key={idx}
                      className={`bar ${idx === 3 || idx === 7 || idx === 8 ? "active" : ""}`}
                      style={{ height: `${height}px` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card p-3 shadow-sm">
                <h5>Controles Remotos</h5>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span>Luces Principales</span>
                  <div className="switch on"></div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span>Sistema HVAC</span>
                  <div className="switch"></div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span>Proyectores</span>
                  <div className="switch"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="py-5 text-center">
        <div className="container">
          <h2 className="fw-bold mb-5">¿Por qué elegir SmartClass?</h2>
          <div className="row g-4 justify-content-center">
            <div className="col-md-5">
              <div className="benefit-card">
                <h4>Optimización Energética</h4>
                <p>Reduce costos hasta un 30% con automatización.</p>
              </div>
            </div>
            <div className="col-md-5">
              <div className="benefit-card">
                <h4>Eficiencia</h4>
                <p>Reservas y aprobaciones de aulas más rápidas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEGURIDAD */}
      <section className="py-5 security-section rounded-3">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <h2>Seguridad Empresarial</h2>
              <div className="mt-4">
                <h5>API RESTful</h5>
                <p>Integración con sistemas SIS.</p>
                <h5>Autenticación Segura</h5>
                <p>Soporte para MFA y SSO.</p>
                <h5>Cifrado</h5>
                <p>AES-256 y TLS 1.3.</p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="security-box"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTROL DE ACCESO SIMULADO */}
      <div className="mt-4">
        <ControlAccesoSimulado />
      </div>
    </div>
  );
}

export default Dashboard;
