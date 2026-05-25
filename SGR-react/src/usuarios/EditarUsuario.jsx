import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usuarioService from "../services/usuarioService";

function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    documento: "",
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    estado: true,
    tipoBiometria: "NINGUNA",
    datoBiometrico: "",
  });

  useEffect(() => {
    cargarUsuario();
  }, [id]);

  const cargarUsuario = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.obtener(id);
      setFormData({
        documento: data.documento,
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        telefono: data.telefono,
        estado: data.estado,
        tipoBiometria: data.tipoBiometria,
        datoBiometrico: data.datoBiometrico || "",
      });
    } catch (error) {
      console.error(error);
      alert("Error al cargar el usuario");
      navigate("/usuarios");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.documento ||
      !formData.nombre ||
      !formData.apellido ||
      !formData.correo
    ) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    try {
      setSaving(true);
      await usuarioService.actualizar(id, formData);
      alert("Usuario actualizado exitosamente");
      navigate("/usuarios");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el usuario");
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
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Editar Usuario</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/usuarios")}
        >
          ← Volver
        </button>
      </div>

      <div className="card shadow">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Documento *</label>
                <input
                  type="text"
                  className="form-control"
                  name="documento"
                  value={formData.documento}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Apellido *</label>
                <input
                  type="text"
                  className="form-control"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Correo *</label>
                <input
                  type="email"
                  className="form-control"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Tipo Biométrico</label>
                <select
                  className="form-control"
                  name="tipoBiometria"
                  value={formData.tipoBiometria}
                  onChange={handleChange}
                >
                  <option value="NINGUNA">Ninguna</option>
                  <option value="HUELLA">Huella Dactilar</option>
                  <option value="IRIS">Escáner de Iris</option>
                  <option value="ROSTRO">Reconocimiento Facial</option>
                </select>
              </div>

              <div className="col-md-12 mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="estado"
                    checked={formData.estado}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Usuario Activo</label>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Actualizando..." : "Actualizar Usuario"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/usuarios")}
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

export default EditarUsuario;
