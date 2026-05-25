import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import rolService from "../services/rolService";

function EditarRol() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombreRol: "",
    descripcion: "",
  });

  useEffect(() => {
    cargarRol();
  }, [id]);

  const cargarRol = async () => {
    try {
      setLoading(true);
      const data = await rolService.obtener(id);
      setFormData({
        nombreRol: data.nombreRol || "",
        descripcion: data.descripcion || "",
      });
    } catch (error) {
      console.error(error);
      alert("❌ Error al cargar los datos del rol");
      navigate("/roles");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombreRol.trim()) {
      alert("❌ El nombre del rol es obligatorio");
      return;
    }

    try {
      setSaving(true);
      await rolService.actualizar(id, {
        nombreRol: formData.nombreRol.toUpperCase().trim(),
        descripcion: formData.descripcion.trim() || "",
      });
      alert("✅ Rol actualizado exitosamente");
      navigate("/roles");
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data || "Error al actualizar el rol";
      alert(`❌ ${JSON.stringify(errorMsg)}`);
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
        <p className="mt-2">Cargando datos del rol...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Editar Rol</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/roles")}
        >
          ← Volver
        </button>
      </div>

      <div className="card shadow">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre del Rol *</label>
              <input
                type="text"
                className="form-control"
                name="nombreRol"
                value={formData.nombreRol}
                onChange={handleChange}
                placeholder="Ej: ADMIN, PROFESOR, ESTUDIANTE"
                required
              />
              <small className="text-muted">
                El nombre se guardará en mayúsculas automáticamente
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                placeholder="Describe las responsabilidades de este rol..."
              />
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
                    Actualizando...
                  </>
                ) : (
                  "Actualizar Rol"
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/roles")}
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

export default EditarRol;
