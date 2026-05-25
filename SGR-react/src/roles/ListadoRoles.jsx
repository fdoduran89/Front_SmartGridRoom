import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import rolService from "../services/rolService";

function ListadoRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarRoles();
  }, []);

  const cargarRoles = async () => {
    try {
      setLoading(true);
      const data = await rolService.listar();
      setRoles(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los roles");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Eliminar el rol "${nombre}"?`)) {
      try {
        await rolService.eliminar(id);
        await cargarRoles();
        alert("✅ Rol eliminado exitosamente");
      } catch (err) {
        console.error(err);
        alert("❌ Error al eliminar el rol");
      }
    }
  };

  const getColorRol = (nombre) => {
    const colores = {
      ADMIN: "danger",
      PROFESOR: "primary",
      ESTUDIANTE: "success",
      PERSONAL: "warning",
    };
    return colores[nombre] || "secondary";
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando roles...</p>
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
        <h2>Gestión de Roles</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/roles/nuevo")}
        >
          + Nuevo Rol
        </button>
      </div>

      <div className="card shadow">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre del Rol</th>
                  <th>Descripción</th>
                  <th width="150">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {roles.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No hay roles registrados
                    </td>
                  </tr>
                ) : (
                  roles.map((rol) => (
                    <tr key={rol.idRol}>
                      <td>{rol.idRol}</td>
                      <td>
                        <span
                          className={`badge bg-${getColorRol(rol.nombreRol)}`}
                        >
                          {rol.nombreRol}
                        </span>
                      </td>
                      <td>{rol.descripcion || "Sin descripción"}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => navigate(`/roles/editar/${rol.idRol}`)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleEliminar(rol.idRol, rol.nombreRol)
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

export default ListadoRoles;
