import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import salaService from "../services/salaService";

function ListadoSalas() {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarSalas();
  }, []);

  const cargarSalas = async () => {
    try {
      setLoading(true);
      const data = await salaService.listar();
      console.log("Datos recibidos del backend:", data); // Para depuración
      setSalas(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error al cargar las salas");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Eliminar la sala "${nombre}"?`)) {
      try {
        await salaService.eliminar(id);
        await cargarSalas();
        alert("✅ Sala eliminada exitosamente");
      } catch (err) {
        console.error(err);
        alert("❌ Error al eliminar la sala");
      }
    }
  };

  const handleToggleEstado = async (sala) => {
    const nuevoEstado = !sala.estado;
    const accion = nuevoEstado ? "activar" : "desactivar";

    if (
      window.confirm(
        `¿${accion === "activar" ? "Activar" : "Desactivar"} la sala "${sala.nombreSala}"?`,
      )
    ) {
      try {
        await salaService.actualizar(sala.idSala, {
          ...sala,
          estado: nuevoEstado,
        });
        await cargarSalas();
        alert(
          `✅ Sala ${accion === "activar" ? "activada" : "desactivada"} exitosamente`,
        );
      } catch (err) {
        console.error(err);
        alert(`❌ Error al ${accion} la sala`);
      }
    }
  };

  // Función para mostrar capacidad correctamente
  const mostrarCapacidad = (capacidad) => {
    if (capacidad === null || capacidad === undefined) {
      return "No especificada";
    }
    return `${capacidad} personas`;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando salas...</p>
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
          <h2>Gestión de Salas</h2>
          <p className="text-muted mb-0">
            Administra los espacios físicos del sistema
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/salas/nuevo")}
        >
          + Nueva Sala
        </button>
      </div>

      <div className="card shadow">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre de la Sala</th>
                  <th>Ubicación</th>
                  <th>Capacidad</th>
                  <th>Estado</th>
                  <th width="150">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {salas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No hay salas registradas
                    </td>
                  </tr>
                ) : (
                  salas.map((sala) => (
                    <tr key={sala.idSala}>
                      <td>{sala.idSala}</td>
                      <td>
                        <strong>{sala.nombreSala}</strong>
                      </td>
                      <td>📍 {sala.ubicacion}</td>
                      <td>{mostrarCapacidad(sala.capacidad)}</td>
                      <td>
                        {sala.estado ? (
                          <span className="badge bg-success">Activa</span>
                        ) : (
                          <span className="badge bg-danger">Inactiva</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() =>
                            navigate(`/salas/editar/${sala.idSala}`)
                          }
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className={`btn btn-sm me-2 ${sala.estado ? "btn-secondary" : "btn-success"}`}
                          onClick={() => handleToggleEstado(sala)}
                          title={sala.estado ? "Desactivar" : "Activar"}
                        >
                          {sala.estado ? "🔴" : "🟢"}
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleEliminar(sala.idSala, sala.nombreSala)
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

export default ListadoSalas;
