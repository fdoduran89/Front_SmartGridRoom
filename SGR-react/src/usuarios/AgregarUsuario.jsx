import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usuarioService from "../services/usuarioService";

function AgregarUsuario() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.documento.trim()) {
      newErrors.documento = "El documento es obligatorio";
    } else if (formData.documento.length < 5) {
      newErrors.documento = "El documento debe tener al menos 5 caracteres";
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es obligatorio";
    }

    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = "Ingrese un correo electrónico válido";
    }

    if (formData.telefono && !/^\d{7,15}$/.test(formData.telefono)) {
      newErrors.telefono = "Ingrese un teléfono válido (7-15 dígitos)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      // Limpiar campos vacíos para evitar errores
      const dataToSend = {
        documento: formData.documento.trim(),
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        correo: formData.correo.trim().toLowerCase(),
        telefono: formData.telefono.trim() || "",
        estado: formData.estado,
        tipoBiometria: formData.tipoBiometria,
        datoBiometrico: formData.datoBiometrico || "",
      };

      console.log("Enviando datos al backend:", dataToSend);
      await usuarioService.crear(dataToSend);
      alert("✅ Usuario creado exitosamente");
      navigate("/usuarios");
    } catch (error) {
      console.error("Error completo:", error);
      let errorMsg = "Error al crear el usuario";

      // Intentar extraer el mensaje de error del backend
      if (error.message) {
        try {
          const parsedError = JSON.parse(error.message);
          if (typeof parsedError === "object") {
            const firstError = Object.values(parsedError)[0];
            errorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
          } else {
            errorMsg = error.message;
          }
        } catch {
          errorMsg = error.message;
        }
      }

      alert(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Agregar Usuario</h2>
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
                  className={`form-control ${errors.documento ? "is-invalid" : ""}`}
                  name="documento"
                  value={formData.documento}
                  onChange={handleChange}
                  placeholder="Ej: 12345678"
                />
                {errors.documento && (
                  <div className="invalid-feedback">{errors.documento}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Juan"
                />
                {errors.nombre && (
                  <div className="invalid-feedback">{errors.nombre}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Apellido *</label>
                <input
                  type="text"
                  className={`form-control ${errors.apellido ? "is-invalid" : ""}`}
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Ej: Pérez"
                />
                {errors.apellido && (
                  <div className="invalid-feedback">{errors.apellido}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Correo Electrónico *</label>
                <input
                  type="email"
                  className={`form-control ${errors.correo ? "is-invalid" : ""}`}
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="ejemplo@dominio.com"
                />
                {errors.correo && (
                  <div className="invalid-feedback">{errors.correo}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Teléfono</label>
                <input
                  type="tel"
                  className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ej: 3001234567"
                />
                {errors.telefono && (
                  <div className="invalid-feedback">{errors.telefono}</div>
                )}
                <small className="text-muted">Solo números, 7-15 dígitos</small>
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
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Guardando...
                  </>
                ) : (
                  "Guardar Usuario"
                )}
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

export default AgregarUsuario;
