import { useState } from "react";
import { useNavigate } from "react-router-dom";
import rolService from "../services/rolService";

function AgregarRol() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombreRol: "",
    descripcion: "",
  });

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
      setLoading(true);
      await rolService.crear({
        nombreRol: formData.nombreRol.toUpperCase().trim(),
        descripcion: formData.descripcion.trim() || "",
      });
      alert("✅ Rol creado exitosamente");
      navigate("/roles");
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data || "Error al crear el rol";
      alert(`❌ ${JSON.stringify(errorMsg)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Agregar Rol</h2>
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
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Guardando...
                  </>
                ) : (
                  "Guardar Rol"
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

export default AgregarRol;
