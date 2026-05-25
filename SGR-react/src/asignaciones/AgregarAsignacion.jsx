import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usuarioRolService from "../services/usuarioRolService";
import usuarioService from "../services/usuarioService";
import rolService from "../services/rolService";

function AgregarAsignacion() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [asignacionesExistentes, setAsignacionesExistentes] = useState([]);
  const [formData, setFormData] = useState({
    idUsuario: "",
    idRol: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [usuariosData, rolesData, asignacionesData] = await Promise.all([
        usuarioService.listar(),
        rolService.listar(),
        usuarioRolService.listar(),
      ]);

      // Filtrar solo usuarios activos
      setUsuarios(usuariosData.filter((u) => u.estado === true));
      setRoles(rolesData);
      setAsignacionesExistentes(asignacionesData);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value),
    });
    // Limpiar error cuando cambia selección
    setError("");
  };

  const isAsignacionExistente = () => {
    return asignacionesExistentes.some(
      (asig) =>
        asig.idUsuario === formData.idUsuario && asig.idRol === formData.idRol,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.idUsuario || !formData.idRol) {
      setError("❌ Debe seleccionar un usuario y un rol");
      return;
    }

    if (isAsignacionExistente()) {
      setError("❌ Este usuario ya tiene asignado este rol");
      return;
    }

    try {
      setSaving(true);

      const nuevaAsignacion = {
        idUsuario: formData.idUsuario,
        idRol: formData.idRol,
        fechaAsignacion: new Date().toISOString().split("T")[0],
      };

      await usuarioRolService.crear(nuevaAsignacion);
      alert("✅ Rol asignado exitosamente al usuario");
      navigate("/usuarios-roles");
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data || "Error al asignar el rol";
      setError(`❌ ${JSON.stringify(errorMsg)}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando usuarios y roles...</p>
      </div>
    );
  }

  const usuarioSeleccionado = usuarios.find(
    (u) => u.idUsuario === formData.idUsuario,
  );
  const rolSeleccionado = roles.find((r) => r.idRol === formData.idRol);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Asignar Rol a Usuario</h2>
          <p className="text-muted mb-0">
            Selecciona un usuario y asígnale un rol
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/usuarios-roles")}
        >
          ← Volver
        </button>
      </div>

      <div className="card shadow">
        <div className="card-body">
          {error && <div className="alert alert-danger mb-3">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Usuario *</label>
              <select
                className="form-control"
                name="idUsuario"
                value={formData.idUsuario}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un usuario...</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.idUsuario} value={usuario.idUsuario}>
                    {usuario.nombre} {usuario.apellido} - {usuario.documento}
                  </option>
                ))}
              </select>
              {usuarioSeleccionado && (
                <small className="text-muted">
                  📧 {usuarioSeleccionado.correo} | 📞{" "}
                  {usuarioSeleccionado.telefono || "Sin teléfono"}
                </small>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Rol *</label>
              <select
                className="form-control"
                name="idRol"
                value={formData.idRol}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un rol...</option>
                {roles.map((rol) => (
                  <option key={rol.idRol} value={rol.idRol}>
                    {rol.nombreRol} - {rol.descripcion || "Sin descripción"}
                  </option>
                ))}
              </select>
              {rolSeleccionado && (
                <small className="text-muted">
                  📝{" "}
                  {rolSeleccionado.descripcion ||
                    "Este rol no tiene descripción"}
                </small>
              )}
            </div>

            <div className="alert alert-info">
              <small>
                💡 <strong>Nota:</strong> Un usuario puede tener múltiples
                roles. La fecha de asignación se registrará automáticamente.
              </small>
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Asignando...
                  </>
                ) : (
                  "Asignar Rol"
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/usuarios-roles")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AgregarAsignacion;
