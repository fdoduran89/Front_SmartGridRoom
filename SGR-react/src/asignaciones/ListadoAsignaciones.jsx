import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usuarioRolService from "../services/usuarioRolService";
import usuarioService from "../services/usuarioService";
import rolService from "../services/rolService";

function ListadoAsignaciones() {
  const [asignaciones, setAsignaciones] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [roles, setRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Cargar asignaciones, usuarios y roles en paralelo
      const [asignacionesData, usuariosData, rolesData] = await Promise.all([
        usuarioRolService.listar(),
        usuarioService.listar(),
        rolService.listar(),
      ]);

      setAsignaciones(asignacionesData);

      // Crear mapas para búsqueda rápida por ID
      const usuariosMap = {};
      usuariosData.forEach((u) => {
        usuariosMap[u.idUsuario] = `${u.nombre} ${u.apellido} (${u.documento})`;
      });

      const rolesMap = {};
      rolesData.forEach((r) => {
        rolesMap[r.idRol] = r.nombreRol;
      });

      setUsuarios(usuariosMap);
      setRoles(rolesMap);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error al cargar las asignaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id, usuarioId, rolId) => {
    const nombreUsuario = usuarios[usuarioId] || "Usuario";
    const nombreRol = roles[rolId] || "Rol";

    if (
      window.confirm(
        `¿Eliminar la asignación de "${nombreRol}" para ${nombreUsuario}?`,
      )
    ) {
      try {
        await usuarioRolService.eliminar(id);
        await cargarDatos();
        alert("✅ Asignación eliminada exitosamente");
      } catch (err) {
        console.error(err);
        alert("❌ Error al eliminar la asignación");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando asignaciones...</p>
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
          <h2>Asignación de Roles a Usuarios</h2>
          <p className="text-muted mb-0">
            Administra qué roles tiene cada usuario
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/usuarios-roles/nuevo")}
        >
          + Nueva Asignación
        </button>
      </div>

      <div className="card shadow">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Rol Asignado</th>
                  <th>Fecha de Asignación</th>
                  <th width="100">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {asignaciones.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No hay asignaciones registradas
                    </td>
                  </tr>
                ) : (
                  asignaciones.map((asig) => (
                    <tr key={asig.idUsuarioRol}>
                      <td>{asig.idUsuarioRol}</td>
                      <td>
                        <strong>
                          {usuarios[asig.idUsuario]?.split(" (")[0] ||
                            "Cargando..."}
                        </strong>
                        <br />
                        <small className="text-muted">
                          ID: {asig.idUsuario}
                        </small>
                      </td>
                      <td>
                        <span
                          className={`badge bg-${asig.idRol === 1 ? "danger" : asig.idRol === 2 ? "primary" : "success"}`}
                        >
                          {roles[asig.idRol] || "Cargando..."}
                        </span>
                      </td>
                      <td>{formatDate(asig.fechaAsignacion)}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleEliminar(
                              asig.idUsuarioRol,
                              asig.idUsuario,
                              asig.idRol,
                            )
                          }
                          title="Eliminar asignación"
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

export default ListadoAsignaciones;
