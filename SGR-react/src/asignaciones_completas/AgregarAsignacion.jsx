import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import asignacionService from "../services/asignacionService";
import usuarioService from "../services/usuarioService";
import salaService from "../services/salaService";
import horarioService from "../services/horarioService";

function AgregarAsignacion() {
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

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [usuariosData, salasData, horariosData] = await Promise.all([
        usuarioService.listar(),
        salaService.listar(),
        horarioService.listar(),
      ]);

      setUsuarios(usuariosData.filter((u) => u.estado === true));
      setSalas(salasData.filter((s) => s.estado === true));
      setHorarios(horariosData.filter((h) => h.estado === true));

      // Fechas por defecto en formato YYYY-MM-DD
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const todayStr = `${year}-${month}-${day}`;

      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const nextYearStr = `${nextYear.getFullYear()}-${String(nextYear.getMonth() + 1).padStart(2, "0")}-${String(nextYear.getDate()).padStart(2, "0")}`;

      setFormData({
        ...formData,
        fechaInicio: todayStr,
        fechaFin: nextYearStr,
      });
    } catch (err) {
      console.error("Error cargando datos:", err);
      alert("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;

    if (type === "checkbox") {
      newValue = checked;
    } else if (name.includes("id")) {
      newValue = parseInt(value) || "";
    }

    setFormData({
      ...formData,
      [name]: newValue,
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

      const nuevaAsignacion = {
        idUsuario: parseInt(formData.idUsuario),
        idSala: parseInt(formData.idSala),
        idHorario: parseInt(formData.idHorario),
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        estado: formData.estado,
      };

      console.log("Enviando asignación:", nuevaAsignacion);
      await asignacionService.crear(nuevaAsignacion);
      alert("✅ Asignación creada exitosamente");
      navigate("/asignaciones");
    } catch (error) {
      console.error("Error al crear:", error);
      let errorMsg = "Error al crear la asignación";
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
        <p className="mt-2">Cargando datos...</p>
      </div>
    );
  }

  const usuarioSeleccionado = usuarios.find(
    (u) => u.idUsuario === parseInt(formData.idUsuario),
  );
  const salaSeleccionada = salas.find(
    (s) => s.idSala === parseInt(formData.idSala),
  );
  const horarioSeleccionado = horarios.find(
    (h) => h.idHorario === parseInt(formData.idHorario),
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Nueva Asignación</h2>
          <p className="text-muted mb-0">
            Asigna un horario específico a un usuario en una sala
          </p>
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
              {usuarioSeleccionado && (
                <small className="text-muted">
                  📧 {usuarioSeleccionado.correo}
                </small>
              )}
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
              {salaSeleccionada && (
                <small className="text-muted">
                  👥 Capacidad: {salaSeleccionada.capacidad} personas
                </small>
              )}
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
              {horarioSeleccionado && (
                <small className="text-muted">
                  ⏰ {horarioSeleccionado.horaInicio} -{" "}
                  {horarioSeleccionado.horaFin}
                </small>
              )}
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
              <small className="text-muted">
                Las asignaciones inactivas no permitirán acceso
              </small>
            </div>

            <div className="alert alert-info">
              <small>
                💡 <strong>Resumen:</strong> El usuario{" "}
                {usuarioSeleccionado?.nombre || ""}{" "}
                {usuarioSeleccionado?.apellido || ""} podrá acceder a la sala{" "}
                {salaSeleccionada?.nombreSala || ""} en el horario{" "}
                {horarioSeleccionado
                  ? `${diasMap[horarioSeleccionado.diaSemana]} ${horarioSeleccionado.horaInicio}-${horarioSeleccionado.horaFin}`
                  : ""}
                , desde el {formData.fechaInicio} hasta el {formData.fechaFin}.
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
                    Creando Asignación...
                  </>
                ) : (
                  "Crear Asignación"
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

export default AgregarAsignacion;
