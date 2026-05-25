import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import salaService from "../services/salaService";

function EditarSala() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombreSala: "",
    ubicacion: "",
    capacidad: "",
    estado: true,
  });

  useEffect(() => {
    cargarSala();
  }, [id]);

  const cargarSala = async () => {
    try {
      setLoading(true);
      const data = await salaService.obtener(id);
      setFormData({
        nombreSala: data.nombreSala || "",
        ubicacion: data.ubicacion || "",
        capacidad: data.capacidad || "",
        estado:
          data.estado === true || data.estado === 1 || data.estado === "true",
      });
    } catch (error) {
      console.error(error);
      alert("❌ Error al cargar los datos de la sala");
      navigate("/salas");
    } finally {
      setLoading(false);
    }
  };

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
      setSaving(true);
      await salaService.actualizar(id, {
        nombreSala: formData.nombreSala.trim(),
        ubicacion: formData.ubicacion.trim(),
        capacidad: parseInt(formData.capacidad),
        estado: formData.estado,
      });
      alert("✅ Sala actualizada exitosamente");
      navigate("/salas");
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data || "Error al actualizar la sala";
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
        <p className="mt-2">Cargando datos de la sala...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Editar Sala</h2>
          <p className="text-muted mb-0">
            Modifica los datos del espacio físico
          </p>
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
                  "Actualizar Sala"
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

export default EditarSala;
