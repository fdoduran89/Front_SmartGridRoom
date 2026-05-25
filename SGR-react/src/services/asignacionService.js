import apiClient from "../config/api";

const asignacionService = {
  // Obtener todas las asignaciones
  listar: async () => {
    const response = await apiClient.get("/asignaciones/");
    return response.data;
  },

  // Obtener una asignación por ID
  obtener: async (id) => {
    const response = await apiClient.get(`/asignaciones/${id}/`);
    return response.data;
  },

  // Crear nueva asignación
  crear: async (asignacionData) => {
    const response = await apiClient.post("/asignaciones/", asignacionData);
    return response.data;
  },

  // Actualizar asignación existente
  actualizar: async (id, asignacionData) => {
    const response = await apiClient.put(
      `/asignaciones/${id}/`,
      asignacionData,
    );
    return response.data;
  },

  // Eliminar asignación
  eliminar: async (id) => {
    const response = await apiClient.delete(`/asignaciones/${id}/`);
    return response.data;
  },
};

export default asignacionService;
