import { useState, useEffect } from "react";
import accesoService from "../services/accesoService";
import eventoService from "../services/eventoService";
import usuarioService from "../services/usuarioService";
import salaService from "../services/salaService";

function ReportesEstadisticos() {
  const [accesos, setAccesos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [usuariosMap, setUsuariosMap] = useState({});
  const [salasMap, setSalasMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [filtroSala, setFiltroSala] = useState("");
  const [filtroEvento, setFiltroEvento] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [accesosData, eventosData, usuariosData, salasData] =
        await Promise.all([
          accesoService.listar(),
          eventoService.listar(),
          usuarioService.listar(),
          salaService.listar(),
        ]);

      setAccesos(accesosData.reverse());
      setEventos(eventosData.reverse());

      const usuariosMapTemp = {};
      usuariosData.forEach((u) => {
        usuariosMapTemp[u.idUsuario] = `${u.nombre} ${u.apellido}`;
      });

      const salasMapTemp = {};
      salasData.forEach((s) => {
        salasMapTemp[s.idSala] = s.nombreSala;
      });

      setUsuariosMap(usuariosMapTemp);
      setSalasMap(salasMapTemp);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatearFechaHora = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const obtenerInsigniaEstado = (estado) => {
    switch (estado) {
      case "A":
        return <span className="badge bg-success">Autorizado</span>;
      case "D":
        return <span className="badge bg-danger">Denegado</span>;
      default:
        return <span className="badge bg-warning">Pendiente</span>;
    }
  };

  const obtenerInsigniaEvento = (evento) => {
    switch (evento) {
      case "ACCESO_PERMITIDO":
        return <span className="badge bg-success">✅ Acceso Permitido</span>;
      case "ACCESO_DENEGADO":
        return <span className="badge bg-danger">❌ Acceso Denegado</span>;
      case "FUERA_VIGENCIA":
        return <span className="badge bg-warning">⚠️ Fuera de Vigencia</span>;
      case "REQUEST_CLASSROOM":
        return <span className="badge bg-info">📋 Solicitud de Aula</span>;
      default:
        return <span className="badge bg-secondary">{evento}</span>;
    }
  };

  const limpiarFiltros = () => {
    setFechaInicio("");
    setFechaFin("");
    setFiltroUsuario("");
    setFiltroSala("");
    setFiltroEvento("");
  };

  const accesosFiltrados = accesos.filter((acceso) => {
    const fechaAcceso = new Date(acceso.fechaHoraIngreso)
      .toISOString()
      .split("T")[0];
    if (fechaInicio && fechaAcceso < fechaInicio) return false;
    if (fechaFin && fechaAcceso > fechaFin) return false;
    if (filtroUsuario && acceso.idUsuario !== parseInt(filtroUsuario))
      return false;
    if (filtroSala && acceso.idSala !== parseInt(filtroSala)) return false;
    return true;
  });

  const eventosFiltrados = eventos.filter((evento) => {
    const fechaEvento = new Date(evento.fechaHora).toISOString().split("T")[0];
    if (fechaInicio && fechaEvento < fechaInicio) return false;
    if (fechaFin && fechaEvento > fechaFin) return false;
    if (filtroEvento && evento.evento !== filtroEvento) return false;
    return true;
  });

  const usuariosUnicos = [...new Set(accesos.map((a) => a.idUsuario))]
    .map((id) => ({ id, nombre: usuariosMap[id] || `ID: ${id}` }))
    .filter((u) => u.nombre);

  const salasUnicas = [...new Set(accesos.map((a) => a.idSala))]
    .map((id) => ({ id, nombre: salasMap[id] || `ID: ${id}` }))
    .filter((s) => s.nombre);

  const eventosUnicos = [...new Set(eventos.map((e) => e.evento))];

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando reportes...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h2>Reportes de Accesos y Eventos</h2>
        <p className="text-muted">
          Historial detallado con fecha y hora de cada registro
        </p>
      </div>

      {/* Panel de Filtros */}
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">🔍 Filtros de Búsqueda</h5>
        </div>
        <div className="card-body">
          <div className="row">
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
              <label className="form-label">Usuario</label>
              <select
                className="form-control"
                value={filtroUsuario}
                onChange={(e) => setFiltroUsuario(e.target.value)}
              >
                <option value="">Todos los usuarios</option>
                {usuariosUnicos.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre}
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
                {salasUnicas.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 mb-2">
              <label className="form-label">Tipo de Evento</label>
              <select
                className="form-control"
                value={filtroEvento}
                onChange={(e) => setFiltroEvento(e.target.value)}
              >
                <option value="">Todos los eventos</option>
                {eventosUnicos.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 mb-2 d-flex align-items-end">
              <button
                className="btn btn-secondary w-100"
                onClick={limpiarFiltros}
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white shadow">
            <div className="card-body text-center">
              <h2 className="display-4">{accesosFiltrados.length}</h2>
              <p className="mb-0">Total de Accesos</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white shadow">
            <div className="card-body text-center">
              <h2 className="display-4">{eventosFiltrados.length}</h2>
              <p className="mb-0">Total de Eventos</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white shadow">
            <div className="card-body text-center">
              <h2 className="display-4">
                {accesosFiltrados.filter((a) => a.estadoAcceso === "A").length}
              </h2>
              <p className="mb-0">Accesos Autorizados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Accesos por Usuario */}
      <div className="card shadow mb-4">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">👥 ACCESOS POR USUARIO (con fecha y hora)</h5>
        </div>
        <div className="card-body">
          <div
            className="table-responsive"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <table className="table table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Usuario</th>
                  <th>Sala</th>
                  <th>Fecha y Hora de Ingreso</th>
                  <th>Estado</th>
                  <th>Método</th>
                </tr>
              </thead>
              <tbody>
                {accesosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No hay registros de acceso con los filtros seleccionados
                    </td>
                  </tr>
                ) : (
                  accesosFiltrados.map((acceso) => (
                    <tr key={acceso.idAcceso}>
                      <td>
                        <strong>
                          {usuariosMap[acceso.idUsuario] || "N/A"}
                        </strong>
                      </td>
                      <td>{salasMap[acceso.idSala] || "N/A"}</td>
                      <td>{formatearFechaHora(acceso.fechaHoraIngreso)}</td>
                      <td>{obtenerInsigniaEstado(acceso.estadoAcceso)}</td>
                      <td>{acceso.metodoAcceso || "N/A"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tabla de Accesos por Sala */}
      <div className="card shadow mb-4">
        <div className="card-header bg-warning text-dark">
          <h5 className="mb-0">🏛️ ACCESOS POR SALA (con fecha y hora)</h5>
        </div>
        <div className="card-body">
          <div
            className="table-responsive"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <table className="table table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Sala</th>
                  <th>Usuario</th>
                  <th>Fecha y Hora de Ingreso</th>
                  <th>Estado</th>
                  <th>Método</th>
                </tr>
              </thead>
              <tbody>
                {accesosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No hay registros de acceso con los filtros seleccionados
                    </td>
                  </tr>
                ) : (
                  accesosFiltrados.map((acceso) => (
                    <tr key={acceso.idAcceso}>
                      <td>
                        <strong>{salasMap[acceso.idSala] || "N/A"}</strong>
                      </td>
                      <td>{usuariosMap[acceso.idUsuario] || "N/A"}</td>
                      <td>{formatearFechaHora(acceso.fechaHoraIngreso)}</td>
                      <td>{obtenerInsigniaEstado(acceso.estadoAcceso)}</td>
                      <td>{acceso.metodoAcceso || "N/A"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tabla de Eventos por Tipo */}
      <div className="card shadow mb-4">
        <div className="card-header bg-danger text-white">
          <h5 className="mb-0">⚠️ EVENTOS POR TIPO (con fecha y hora)</h5>
        </div>
        <div className="card-body">
          <div
            className="table-responsive"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <table className="table table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Tipo de Evento</th>
                  <th>Usuario</th>
                  <th>Sala</th>
                  <th>Fecha y Hora</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {eventosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No hay registros de eventos con los filtros seleccionados
                    </td>
                  </tr>
                ) : (
                  eventosFiltrados.map((evento) => (
                    <tr key={evento.idEvento}>
                      <td>{obtenerInsigniaEvento(evento.evento)}</td>
                      <td>{usuariosMap[evento.idUsuario] || "N/A"}</td>
                      <td>{salasMap[evento.idSala] || "N/A"}</td>
                      <td>{formatearFechaHora(evento.fechaHora)}</td>
                      <td>
                        <small>{evento.detalle || "Sin detalle"}</small>
                      </td>
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

export default ReportesEstadisticos;
