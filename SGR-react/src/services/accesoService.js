import apiClient from "../config/api";

const accesoService = {
  // Obtener todos los accesos
  listar: async () => {
    const response = await apiClient.get("/accesos/");
    return response.data;
  },

  // Obtener un acceso por ID
  obtener: async (id) => {
    const response = await apiClient.get(`/accesos/${id}/`);
    return response.data;
  },

  // Registrar un nuevo acceso (entrada)
  registrarEntrada: async (accesoData) => {
    const response = await apiClient.post("/accesos/", accesoData);
    return response.data;
  },

  // Actualizar acceso (registrar salida)
  actualizarSalida: async (id, accesoData) => {
    const response = await apiClient.put(`/accesos/${id}/`, accesoData);
    return response.data;
  },
};

export default accesoService;
