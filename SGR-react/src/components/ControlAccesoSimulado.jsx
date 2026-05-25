import { useState, useEffect } from "react";
import usuarioService from "../services/usuarioService";
import salaService from "../services/salaService";
import asignacionService from "../services/asignacionService";
import accesoService from "../services/accesoService";
import eventoService from "../services/eventoService";

function ControlAccesoSimulado() {
  const [usuarios, setUsuarios] = useState([]);
  const [salas, setSalas] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedSala, setSelectedSala] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [usuariosData, salasData] = await Promise.all([
        usuarioService.listar(),
        salaService.listar(),
      ]);
      setUsuarios(usuariosData.filter((u) => u.estado === true));
      setSalas(salasData.filter((s) => s.estado === true));
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const obtenerDiaSemana = () => {
    const dias = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
    const hoy = new Date();
    return dias[hoy.getDay()];
  };

  const obtenerHoraActual = () => {
    const ahora = new Date();
    return `${String(ahora.getHours()).padStart(2, "0")}:${String(ahora.getMinutes()).padStart(2, "0")}`;
  };

  const registrarEvento = async (usuarioId, salaId, evento, detalle) => {
    try {
      await eventoService.registrar({
        idUsuario: parseInt(usuarioId),
        idSala: parseInt(salaId),
        evento: evento,
        detalle: detalle,
      });
    } catch (error) {
      console.error("Error registrando evento:", error);
    }
  };

  const handleAcceso = async () => {
    if (!selectedUser || !selectedSala) {
      alert("❌ Debe seleccionar un usuario y una sala");
      return;
    }

    setLoading(true);
    setResultado(null);

    try {
      const usuario = usuarios.find(
        (u) => u.idUsuario === parseInt(selectedUser),
      );
      const sala = salas.find((s) => s.idSala === parseInt(selectedSala));

      const asignaciones = await asignacionService.listar();
      const asignacionValida = asignaciones.find(
        (a) =>
          a.idUsuario === parseInt(selectedUser) &&
          a.idSala === parseInt(selectedSala) &&
          a.estado === true,
      );

      const fechaActual = new Date().toISOString().split("T")[0];

      if (!asignacionValida) {
        setResultado({
          tipo: "denegado",
          mensaje: `❌ ACCESO DENEGADO: ${usuario?.nombre} no tiene asignación para la sala ${sala?.nombreSala}`,
        });
        await registrarEvento(
          selectedUser,
          selectedSala,
          "ACCESO_DENEGADO",
          `Usuario ${usuario?.nombre} intentó acceder a ${sala?.nombreSala} sin asignación`,
        );
        setLoading(false);
        return;
      }

      if (
        fechaActual < asignacionValida.fechaInicio ||
        fechaActual > asignacionValida.fechaFin
      ) {
        setResultado({
          tipo: "denegado",
          mensaje: `❌ ACCESO DENEGADO: La asignación no está vigente (válida del ${asignacionValida.fechaInicio} al ${asignacionValida.fechaFin})`,
        });
        await registrarEvento(
          selectedUser,
          selectedSala,
          "FUERA_VIGENCIA",
          `Intento fuera del período de vigencia de la asignación`,
        );
        setLoading(false);
        return;
      }

      const nuevoAcceso = {
        idUsuario: parseInt(selectedUser),
        idSala: parseInt(selectedSala),
        fechaHoraIngreso: new Date().toISOString(),
        estadoAcceso: "A",
        metodoAcceso: "MANUAL",
      };

      await accesoService.registrarEntrada(nuevoAcceso);

      setResultado({
        tipo: "exitoso",
        mensaje: `✅ ACCESO PERMITIDO: ${usuario?.nombre} ha ingresado a ${sala?.nombreSala}`,
      });

      await registrarEvento(
        selectedUser,
        selectedSala,
        "ACCESO_PERMITIDO",
        `Acceso autorizado a ${sala?.nombreSala}`,
      );
    } catch (error) {
      console.error("Error procesando acceso:", error);
      setResultado({
        tipo: "error",
        mensaje: `❌ ERROR: No se pudo procesar el acceso`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">🎫 Simulador de Control de Acceso</h4>
      </div>
      <div className="card-body">
        <p className="text-muted mb-3">
          Simula la entrada de un usuario a una sala. El sistema verificará
          automáticamente si tiene permiso.
        </p>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Usuario</label>
            <select
              className="form-control"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Seleccione un usuario...</option>
              {usuarios.map((u) => (
                <option key={u.idUsuario} value={u.idUsuario}>
                  {u.nombre} {u.apellido} - {u.documento}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Sala</label>
            <select
              className="form-control"
              value={selectedSala}
              onChange={(e) => setSelectedSala(e.target.value)}
            >
              <option value="">Seleccione una sala...</option>
              {salas.map((s) => (
                <option key={s.idSala} value={s.idSala}>
                  {s.nombreSala} - {s.ubicacion}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          className="btn btn-success btn-lg w-100 mt-2"
          onClick={handleAcceso}
          disabled={loading || !selectedUser || !selectedSala}
        >
          {loading ? "Procesando..." : "🎫 SIMULAR ACCESO"}
        </button>

        {resultado && (
          <div
            className={`alert alert-${resultado.tipo === "exitoso" ? "success" : "danger"} mt-3`}
          >
            {resultado.mensaje}
          </div>
        )}
      </div>
    </div>
  );
}

export default ControlAccesoSimulado;
