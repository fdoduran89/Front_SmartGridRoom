import { useState } from "react";
import { useNavigate } from "react-router-dom";
import horarioService from "../services/horarioService";

function AgregarHorario() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    diaSemana: "LUN",
    horaInicio: "08:00",
    horaFin: "17:00",
    estado: true,
  });

  const diasSemana = [
    { value: "LUN", label: "Lunes" },
    { value: "MAR", label: "Martes" },
    { value: "MIE", label: "Miércoles" },
    { value: "JUE", label: "Jueves" },
    { value: "VIE", label: "Viernes" },
    { value: "SAB", label: "Sábado" },
    { value: "DOM", label: "Domingo" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    if (!formData.horaInicio || !formData.horaFin) {
      alert("❌ Las horas de inicio y fin son obligatorias");
      return false;
    }

    if (formData.horaInicio >= formData.horaFin) {
      alert("❌ La hora de inicio debe ser menor que la hora de fin");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      await horarioService.crear({
        diaSemana: formData.diaSemana,
        horaInicio: formData.horaInicio,
        horaFin: formData.horaFin,
        estado: formData.estado,
      });
      alert("✅ Horario creado exitosamente");
      navigate("/horarios");
    } catch (error) {
      console.error(error);
      let errorMsg = "Error al crear el horario";
      if (error.response?.data) {
        errorMsg = JSON.stringify(error.response.data);
      }
      alert(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Agregar Horario</h2>
          <p className="text-muted mb-0">Registra un nuevo horario de acceso</p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/horarios")}
        >
          ← Volver
        </button>
      </div>

      <div className="card shadow">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Día de la Semana *</label>
              <select
                className="form-control"
                name="diaSemana"
                value={formData.diaSemana}
                onChange={handleChange}
                required
              >
                {diasSemana.map((dia) => (
                  <option key={dia.value} value={dia.value}>
                    {dia.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Hora de Inicio *</label>
                <input
                  type="time"
                  className="form-control"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleChange}
                  required
                />
                <small className="text-muted">Formato 24 horas (HH:MM)</small>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Hora de Fin *</label>
                <input
                  type="time"
                  className="form-control"
                  name="horaFin"
                  value={formData.horaFin}
                  onChange={handleChange}
                  required
                />
                <small className="text-muted">
                  Debe ser mayor a la hora de inicio
                </small>
              </div>
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
                <label className="form-check-label">Horario Activo</label>
              </div>
              <small className="text-muted">
                Los horarios inactivos no estarán disponibles para reservas
              </small>
            </div>

            <div className="alert alert-info">
              <small>
                💡 <strong>Ejemplo:</strong> Lunes de 08:00 a 17:00 es un
                horario laboral típico. Puedes crear múltiples horarios para el
                mismo día si es necesario.
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
                  "Guardar Horario"
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/horarios")}
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

export default AgregarHorario;
