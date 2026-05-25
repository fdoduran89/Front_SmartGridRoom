import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import horarioService from "../services/horarioService";

function ListadoHorarios() {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Mapeo de días de la semana
  const diasMap = {
    LUN: "Lunes",
    MAR: "Martes",
    MIE: "Miércoles",
    JUE: "Jueves",
    VIE: "Viernes",
    SAB: "Sábado",
    DOM: "Domingo",
  };

  useEffect(() => {
    cargarHorarios();
  }, []);

  const cargarHorarios = async () => {
    try {
      setLoading(true);
      const data = await horarioService.listar();
      console.log("Horarios cargados:", data);
      setHorarios(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los horarios");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id, dia, horaInicio, horaFin) => {
    const nombreHorario = `${diasMap[dia] || dia} ${horaInicio}-${horaFin}`;
    if (window.confirm(`¿Eliminar el horario "${nombreHorario}"?`)) {
      try {
        await horarioService.eliminar(id);
        await cargarHorarios();
        alert("✅ Horario eliminado exitosamente");
      } catch (err) {
        console.error(err);
        alert("❌ Error al eliminar el horario");
      }
    }
  };

  const handleToggleEstado = async (horario) => {
    const nuevoEstado = !horario.estado;
    const accion = nuevoEstado ? "activar" : "desactivar";

    if (
      window.confirm(
        `¿${accion === "activar" ? "Activar" : "Desactivar"} el horario de ${diasMap[horario.diaSemana]} ${horario.horaInicio}-${horario.horaFin}?`,
      )
    ) {
      try {
        await horarioService.actualizar(horario.idHorario, {
          ...horario,
          estado: nuevoEstado,
        });
        await cargarHorarios();
        alert(
          `✅ Horario ${accion === "activar" ? "activado" : "desactivado"} exitosamente`,
        );
      } catch (err) {
        console.error(err);
        alert(`❌ Error al ${accion} el horario`);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando horarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Gestión de Horarios</h2>
          <p className="text-muted mb-0">
            Administra los horarios de acceso a las salas
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/horarios/nuevo")}
        >
          + Nuevo Horario
        </button>
      </div>

      <div className="card shadow">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Día</th>
                  <th>Hora Inicio</th>
                  <th>Hora Fin</th>
                  <th>Estado</th>
                  <th width="180">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {horarios.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No hay horarios registrados
                    </td>
                  </tr>
                ) : (
                  horarios.map((horario) => (
                    <tr key={horario.idHorario}>
                      <td>{horario.idHorario}</td>
                      <td>
                        <strong>
                          {diasMap[horario.diaSemana] || horario.diaSemana}
                        </strong>
                      </td>
                      <td>
                        <span className="badge bg-info">
                          🕐 {horario.horaInicio}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-info">
                          🕘 {horario.horaFin}
                        </span>
                      </td>
                      <td>
                        {horario.estado ? (
                          <span className="badge bg-success">Activo</span>
                        ) : (
                          <span className="badge bg-danger">Inactivo</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() =>
                            navigate(`/horarios/editar/${horario.idHorario}`)
                          }
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className={`btn btn-sm me-2 ${horario.estado ? "btn-secondary" : "btn-success"}`}
                          onClick={() => handleToggleEstado(horario)}
                          title={horario.estado ? "Desactivar" : "Activar"}
                        >
                          {horario.estado ? "🔴" : "🟢"}
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleEliminar(
                              horario.idHorario,
                              horario.diaSemana,
                              horario.horaInicio,
                              horario.horaFin,
                            )
                          }
                          title="Eliminar"
                        >
                          🗑️
                        </button>
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

export default ListadoHorarios;
