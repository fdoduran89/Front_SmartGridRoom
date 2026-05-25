import { useState, useEffect } from "react";
import eventoService from "../services/eventoService";
import usuarioService from "../services/usuarioService";
import salaService from "../services/salaService";

function HistorialEventos() {
  const [eventos, setEventos] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [salas, setSalas] = useState({});
  const [loading, setLoading] = useState(true);
  const [filtroEvento, setFiltroEvento] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [fechaLimpiar, setFechaLimpiar] = useState(false);
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
      const [eventosData, usuariosData, salasData] = await Promise.all([
        eventoService.listar(),
        usuarioService.listar(),
        salaService.listar(),
      ]);

      setEventos(eventosData.reverse());

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
      console.error("Error cargando eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("es-ES");
  };

  const getEventoBadge = (evento) => {
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
    setFiltroEvento("");
    setFiltroUsuario("");
    setFechaInicio("");
    setFechaFin("");
    setHoraInicio("");
    setHoraFin("");
  };

  const eventosUnicos = [...new Set(eventos.map((e) => e.evento))];
  const usuariosUnicos = Object.entries(usuarios).map(([id, nombre]) => ({
    id,
    nombre,
  }));

  const eventosFiltrados = eventos.filter((evento) => {
    // Filtro por tipo de evento
    if (filtroEvento && evento.evento !== filtroEvento) return false;

    // Filtro por usuario
    if (filtroUsuario && evento.idUsuario !== parseInt(filtroUsuario))
      return false;

    // Filtro por fecha y hora
    if (fechaInicio || fechaFin || horaInicio || horaFin) {
      const fechaEvento = new Date(evento.fechaHora);
      const fechaEventoStr = fechaEvento.toISOString().split("T")[0];
      const horaEventoStr = `${String(fechaEvento.getHours()).padStart(2, "0")}:${String(fechaEvento.getMinutes()).padStart(2, "0")}`;

      if (fechaInicio && fechaEventoStr < fechaInicio) return false;
      if (fechaFin && fechaEventoStr > fechaFin) return false;
      if (horaInicio && horaEventoStr < horaInicio) return false;
      if (horaFin && horaEventoStr > horaFin) return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando historial de eventos...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h2>Historial de Eventos</h2>
        <p className="text-muted">
          Registro de todas las actividades del sistema
        </p>
      </div>

      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 mb-2">
              <label className="form-label">Tipo de Evento</label>
              <select
                className="form-control"
                value={filtroEvento}
                onChange={(e) => setFiltroEvento(e.target.value)}
              >
                <option value="">Todos los eventos</option>
                {eventosUnicos.map((evento) => (
                  <option key={evento} value={evento}>
                    {evento}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3 mb-2">
              <label className="form-label">Usuario</label>
              <select
                className="form-control"
                value={filtroUsuario}
                onChange={(e) => setFiltroUsuario(e.target.value)}
              >
                <option value="">Todos los usuarios</option>
                {usuariosUnicos.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre}
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
              📊 Mostrando {eventosFiltrados.length} de {eventos.length} eventos
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
                  <th>Evento</th>
                  <th>Usuario</th>
                  <th>Sala</th>
                  <th>Fecha/Hora</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {eventosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No hay registros de eventos con los filtros seleccionados
                    </td>
                  </tr>
                ) : (
                  eventosFiltrados.map((evento) => (
                    <tr key={evento.idEvento}>
                      <td>{evento.idEvento}</td>
                      <td>{getEventoBadge(evento.evento)}</td>
                      <td>{usuarios[evento.idUsuario] || "N/A"}</td>
                      <td>{salas[evento.idSala] || "N/A"}</td>
                      <td>{formatDateTime(evento.fechaHora)}</td>
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

export default HistorialEventos;
