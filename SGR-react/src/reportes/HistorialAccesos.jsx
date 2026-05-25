import { useState, useEffect } from "react";
import accesoService from "../services/accesoService";
import usuarioService from "../services/usuarioService";
import salaService from "../services/salaService";

function HistorialAccesos() {
  const [accesos, setAccesos] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [salas, setSalas] = useState({});
  const [loading, setLoading] = useState(true);
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [filtroSala, setFiltroSala] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [accesosData, usuariosData, salasData] = await Promise.all([
        accesoService.listar(),
        usuarioService.listar(),
        salaService.listar(),
      ]);

      setAccesos(accesosData);

      const usuariosMap = {};
      usuariosData.forEach((u) => {
        usuariosMap[u.idUsuario] = `${u.nombre} ${u.apellido}`;
      });

      const salasMap = {};
      salasData.forEach((s) => {
        salasMap[s.idSala] = s.nombreSala;
      });

      setUsuarios(usuariosMap);
      setSalas(salasMap);
    } catch (error) {
      console.error("Error cargando accesos:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("es-ES");
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "A":
        return <span className="badge bg-success">Autorizado</span>;
      case "D":
        return <span className="badge bg-danger">Denegado</span>;
      default:
        return <span className="badge bg-warning">Pendiente</span>;
    }
  };

  const limpiarFiltros = () => {
    setFiltroUsuario("");
    setFiltroSala("");
    setFechaInicio("");
    setFechaFin("");
    setHoraInicio("");
    setHoraFin("");
  };

  // Filtrar accesos por usuario, sala, fecha y hora
  const accesosFiltrados = accesos.filter((acceso) => {
    // Filtro por usuario
    if (filtroUsuario && acceso.idUsuario !== parseInt(filtroUsuario))
      return false;

    // Filtro por sala
    if (filtroSala && acceso.idSala !== parseInt(filtroSala)) return false;

    // Filtro por fecha y hora
    if (fechaInicio || fechaFin || horaInicio || horaFin) {
      const fechaAcceso = new Date(acceso.fechaHoraIngreso);
      const fechaAccesoStr = fechaAcceso.toISOString().split("T")[0];
      const horaAccesoStr = `${String(fechaAcceso.getHours()).padStart(2, "0")}:${String(fechaAcceso.getMinutes()).padStart(2, "0")}`;

      // Filtro por fecha de inicio
      if (fechaInicio && fechaAccesoStr < fechaInicio) return false;

      // Filtro por fecha de fin
      if (fechaFin && fechaAccesoStr > fechaFin) return false;

      // Filtro por hora de inicio
      if (horaInicio && horaAccesoStr < horaInicio) return false;

      // Filtro por hora de fin
      if (horaFin && horaAccesoStr > horaFin) return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando historial de accesos...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h2>Historial de Accesos</h2>
        <p className="text-muted">
          Registro de todas las entradas y salidas del sistema
        </p>
      </div>

      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 mb-2">
              <label className="form-label">Usuario</label>
              <select
                className="form-control"
                value={filtroUsuario}
                onChange={(e) => setFiltroUsuario(e.target.value)}
              >
                <option value="">Todos los usuarios</option>
                {Object.entries(usuarios).map(([id, nombre]) => (
                  <option key={id} value={id}>
                    {nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3 mb-2">
              <label className="form-label">Sala</label>
              <select
                className="form-control"
                value={filtroSala}
                onChange={(e) => setFiltroSala(e.target.value)}
              >
                <option value="">Todas las salas</option>
                {Object.entries(salas).map(([id, nombre]) => (
                  <option key={id} value={id}>
                    {nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3 mb-2">
              <label className="form-label">Fecha Desde</label>
              <input
                type="date"
                className="form-control"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>

            <div className="col-md-3 mb-2">
              <label className="form-label">Fecha Hasta</label>
              <input
                type="date"
                className="form-control"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>

            <div className="col-md-3 mb-2">
              <label className="form-label">Hora Desde</label>
              <input
                type="time"
                className="form-control"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
              />
            </div>

            <div className="col-md-3 mb-2">
              <label className="form-label">Hora Hasta</label>
              <input
                type="time"
                className="form-control"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-2 d-flex align-items-end">
              <button
                className="btn btn-secondary w-100"
                onClick={limpiarFiltros}
              >
                Limpiar Filtros
              </button>
            </div>
          </div>

          <div className="alert alert-info mt-2 mb-0">
            <small>
              📊 Mostrando {accesosFiltrados.length} de {accesos.length}{" "}
              registros
            </small>
          </div>
        </div>
      </div>

      <div className="card shadow">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Sala</th>
                  <th>Fecha/Hora Ingreso</th>
                  <th>Estado</th>
                  <th>Método</th>
                </tr>
              </thead>
              <tbody>
                {accesosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No hay registros de acceso con los filtros seleccionados
                    </td>
                  </tr>
                ) : (
                  accesosFiltrados.map((acceso) => (
                    <tr key={acceso.idAcceso}>
                      <td>{acceso.idAcceso}</td>
                      <td>{usuarios[acceso.idUsuario] || "N/A"}</td>
                      <td>{salas[acceso.idSala] || "N/A"}</td>
                      <td>{formatDateTime(acceso.fechaHoraIngreso)}</td>
                      <td>{getEstadoBadge(acceso.estadoAcceso)}</td>
                      <td>{acceso.metodoAcceso || "N/A"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistorialAccesos;
