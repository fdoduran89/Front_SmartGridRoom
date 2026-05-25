import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usuarioService from "../services/usuarioService";

function ListadoUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.listar();
      setUsuarios(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar los usuarios");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Eliminar al usuario ${nombre}?`)) {
      try {
        await usuarioService.eliminar(id);
        await cargarUsuarios();
      } catch (err) {
        alert("Error al eliminar el usuario");
      }
    }
  };

  const getEstadoBadge = (estado) => {
    return estado
      ? '<span class="badge bg-success">Activo</span>'
      : '<span class="badge bg-danger">Inactivo</span>';
  };

  const getBiometriaBadge = (tipo) => {
    const colores = {
      HUELLA: "info",
      IRIS: "primary",
      ROSTRO: "success",
      NINGUNA: "secondary",
    };
    const nombres = {
      HUELLA: "👆 Huella",
      IRIS: "👁️ Iris",
      ROSTRO: "😀 Rostro",
      NINGUNA: "❌ Ninguna",
    };
    return `<span class="badge bg-${colores[tipo] || "secondary"}">${nombres[tipo] || tipo}</span>`;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
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
        <h2>Gestión de Usuarios</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/usuarios/nuevo")}
        >
          + Nuevo Usuario
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Documento</th>
              <th>Nombre Completo</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Tipo Biométrico</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.idUsuario}>
                <td>{usuario.idUsuario}</td>
                <td>{usuario.documento}</td>
                <td>
                  {usuario.nombre} {usuario.apellido}
                </td>
                <td>{usuario.correo}</td>
                <td>{usuario.telefono}</td>
                <td
                  dangerouslySetInnerHTML={{
                    __html: getEstadoBadge(usuario.estado),
                  }}
                />
                <td
                  dangerouslySetInnerHTML={{
                    __html: getBiometriaBadge(usuario.tipoBiometria),
                  }}
                />
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() =>
                      navigate(`/usuarios/editar/${usuario.idUsuario}`)
                    }
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      handleEliminar(usuario.idUsuario, usuario.nombre)
                    }
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListadoUsuarios;
