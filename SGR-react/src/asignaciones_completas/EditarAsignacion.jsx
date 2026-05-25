import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import asignacionService from "../services/asignacionService";
import usuarioService from "../services/usuarioService";
import salaService from "../services/salaService";
import horarioService from "../services/horarioService";

function EditarAsignacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [salas, setSalas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [formData, setFormData] = useState({
    idUsuario: "",
    idSala: "",
    idHorario: "",
    fechaInicio: "",
    fechaFin: "",
    estado: true,
  });

  const diasMap = {
    LUN: "Lunes",
    MAR: "Martes",
    MIE: "Miércoles",
    JUE: "Jueves",
    VIE: "Viernes",
    SAB: "Sábado",
    DOM: "Domingo",
  };

  // Función para formatear fecha a YYYY-MM-DD para input date
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    // Si ya está en formato YYYY-MM-DD, devolverlo
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) return dateString;
    // Intentar convertir otros formatos
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const [asignacion, usuariosData, salasData, horariosData] =
        await Promise.all([
          asignacionService.obtener(id),
          usuarioService.listar(),
          salaService.listar(),
          horarioService.listar(),
        ]);

      console.log("Asignación cargada:", asignacion);

      setUsuarios(usuariosData);
      setSalas(salasData);
      setHorarios(horariosData);

      setFormData({
        idUsuario: asignacion.idUsuario,
        idSala: asignacion.idSala,
        idHorario: asignacion.idHorario,
        fechaInicio: formatDateForInput(asignacion.fechaInicio),
        fechaFin: formatDateForInput(asignacion.fechaFin),
        estado: asignacion.estado,
      });
    } catch (err) {
      console.error(err);
      alert("❌ Error al cargar la asignación");
      navigate("/asignaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : name.includes("id")
            ? parseInt(value)
            : value,
    });
  };

  const validateForm = () => {
    if (!formData.idUsuario) {
      alert("❌ Debe seleccionar un usuario");
      return false;
    }
    if (!formData.idSala) {
      alert("❌ Debe seleccionar una sala");
      return false;
    }
    if (!formData.idHorario) {
      alert("❌ Debe seleccionar un horario");
      return false;
    }
    if (!formData.fechaInicio || !formData.fechaFin) {
      alert("❌ Las fechas de inicio y fin son obligatorias");
      return false;
    }
    if (formData.fechaInicio > formData.fechaFin) {
      alert("❌ La fecha de inicio debe ser anterior a la fecha de fin");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      await asignacionService.actualizar(id, {
        idUsuario: parseInt(formData.idUsuario),
        idSala: parseInt(formData.idSala),
        idHorario: parseInt(formData.idHorario),
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        estado: formData.estado,
      });

      alert("✅ Asignación actualizada exitosamente");
      navigate("/asignaciones");
    } catch (error) {
      console.error(error);
      let errorMsg = "Error al actualizar la asignación";
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
        <p className="mt-2">Cargando asignación...</p>
      </div>
    );
  }

  const usuarioSeleccionado = usuarios.find(
    (u) => u.idUsuario === formData.idUsuario,
  );
  const salaSeleccionada = salas.find((s) => s.idSala === formData.idSala);
  const horarioSeleccionado = horarios.find(
    (h) => h.idHorario === formData.idHorario,
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Editar Asignación</h2>
          <p className="text-muted mb-0">Modifica la asignación de horario</p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/asignaciones")}
        >
          ← Volver
        </button>
      </div>

      <div className="card shadow">
        <div className="card-body">
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
            </div>

            <div className="mb-3">
              <label className="form-label">Sala *</label>
              <select
                className="form-control"
                name="idSala"
                value={formData.idSala}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una sala...</option>
                {salas.map((sala) => (
                  <option key={sala.idSala} value={sala.idSala}>
                    {sala.nombreSala} - {sala.ubicacion}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Horario *</label>
              <select
                className="form-control"
                name="idHorario"
                value={formData.idHorario}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un horario...</option>
                {horarios.map((horario) => (
                  <option key={horario.idHorario} value={horario.idHorario}>
                    {diasMap[horario.diaSemana]} - {horario.horaInicio} a{" "}
                    {horario.horaFin}
                  </option>
                ))}
              </select>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Fecha de Inicio *</label>
                <input
                  type="date"
                  className="form-control"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Fecha de Fin *</label>
                <input
                  type="date"
                  className="form-control"
                  name="fechaFin"
                  value={formData.fechaFin}
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
                <label className="form-check-label">Asignación Activa</label>
              </div>
            </div>

            <div className="alert alert-info">
              <small>
                💡 <strong>Resumen:</strong> {usuarioSeleccionado?.nombre}{" "}
                {usuarioSeleccionado?.apellido} podrá acceder a{" "}
                {salaSeleccionada?.nombreSala} en el horario{" "}
                {horarioSeleccionado
                  ? `${diasMap[horarioSeleccionado.diaSemana]} ${horarioSeleccionado.horaInicio}-${horarioSeleccionado.horaFin}`
                  : "..."}
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
                    Actualizando...
                  </>
                ) : (
                  "Actualizar Asignación"
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/asignaciones")}
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

export default EditarAsignacion;
