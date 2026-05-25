import apiClient from "../config/api";

const salaService = {
  // Obtener todas las salas
  listar: async () => {
    const response = await apiClient.get("/salas/");
    return response.data;
  },

  // Obtener una sala por ID
  obtener: async (id) => {
    const response = await apiClient.get(`/salas/${id}/`);
    return response.data;
  },

  // Crear nueva sala
  crear: async (salaData) => {
    const response = await apiClient.post("/salas/", salaData);
    return response.data;
  },

  // Actualizar sala existente
  actualizar: async (id, salaData) => {
    const response = await apiClient.put(`/salas/${id}/`, salaData);
    return response.data;
  },

  // Eliminar sala
  eliminar: async (id) => {
    const response = await apiClient.delete(`/salas/${id}/`);
    return response.data;
  },
};

export default salaService;
