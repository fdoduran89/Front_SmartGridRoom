import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import horarioService from "../services/horarioService";

function EditarHorario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    diaSemana: "LUN",
    horaInicio: "",
    horaFin: "",
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

  useEffect(() => {
    cargarHorario();
  }, [id]);

  const cargarHorario = async () => {
    try {
      setLoading(true);
      const data = await horarioService.obtener(id);
      setFormData({
        diaSemana: data.diaSemana || "LUN",
        horaInicio: data.horaInicio || "",
        horaFin: data.horaFin || "",
        estado:
          data.estado === true || data.estado === 1 || data.estado === "true",
      });
    } catch (error) {
      console.error(error);
      alert("❌ Error al cargar los datos del horario");
      navigate("/horarios");
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
      setSaving(true);
      await horarioService.actualizar(id, {
        diaSemana: formData.diaSemana,
        horaInicio: formData.horaInicio,
        horaFin: formData.horaFin,
        estado: formData.estado,
      });
      alert("✅ Horario actualizado exitosamente");
      navigate("/horarios");
    } catch (error) {
      console.error(error);
      let errorMsg = "Error al actualizar el horario";
      if (error.response?.data) {
        errorMsg = JSON.stringify(error.response.data);
      }
      alert(`❌ ${errorMsg}`);
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
        <p className="mt-2">Cargando datos del horario...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Editar Horario</h2>
          <p className="text-muted mb-0">Modifica los datos del horario</p>
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
                  "Actualizar Horario"
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

export default EditarHorario;
