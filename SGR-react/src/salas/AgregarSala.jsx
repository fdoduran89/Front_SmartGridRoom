import { useState } from "react";
import { useNavigate } from "react-router-dom";
import salaService from "../services/salaService";

function AgregarSala() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombreSala: "",
    ubicacion: "",
    capacidad: "",
    estado: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    if (!formData.nombreSala.trim()) {
      alert("❌ El nombre de la sala es obligatorio");
      return false;
    }
    if (!formData.ubicacion.trim()) {
      alert("❌ La ubicación es obligatoria");
      return false;
    }
    if (!formData.capacidad || formData.capacidad <= 0) {
      alert("❌ La capacidad debe ser un número mayor a 0");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      await salaService.crear({
        nombreSala: formData.nombreSala.trim(),
        ubicacion: formData.ubicacion.trim(),
        capacidad: parseInt(formData.capacidad),
        estado: formData.estado,
      });
      alert("✅ Sala creada exitosamente");
      navigate("/salas");
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data || "Error al crear la sala";
      alert(`❌ ${JSON.stringify(errorMsg)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Agregar Sala</h2>
          <p className="text-muted mb-0">Registra un nuevo espacio físico</p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/salas")}
        >
          ← Volver
        </button>
      </div>

      <div className="card shadow">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre de la Sala *</label>
              <input
                type="text"
                className="form-control"
                name="nombreSala"
                value={formData.nombreSala}
                onChange={handleChange}
                placeholder="Ej: Laboratorio A-101, Auditorio Principal"
                required
              />
              <small className="text-muted">
                Nombre descriptivo que identifique la sala
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label">Ubicación *</label>
              <input
                type="text"
                className="form-control"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                placeholder="Ej: Piso 1, Edificio Norte, Bloque B"
                required
              />
              <small className="text-muted">
                Ubicación física dentro de la institución
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label">Capacidad *</label>
              <input
                type="number"
                className="form-control"
                name="capacidad"
                value={formData.capacidad}
                onChange={handleChange}
                placeholder="Ej: 30"
                min="1"
                required
              />
              <small className="text-muted">
                Número máximo de personas que puede albergar la sala
              </small>
            </div>

            <div className="mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="estado"
                  checked={formData.estado}
                  onChange={handleChange}
                />
                <label className="form-check-label">Sala Activa</label>
              </div>
              <small className="text-muted">
                Las salas inactivas no estarán disponibles para reservas
              </small>
            </div>

            <div className="alert alert-info">
              <small>
                💡 <strong>Consejo:</strong> Las salas pueden ser aulas,
                laboratorios, auditorios, salas de reuniones, etc.
              </small>
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
                  "Guardar Sala"
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/salas")}
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

export default AgregarSala;
