import apiClient from "../config/api";

const horarioService = {
  // Obtener todos los horarios
  listar: async () => {
    const response = await apiClient.get("/horarios/");
    return response.data;
  },

  // Obtener un horario por ID
  obtener: async (id) => {
    const response = await apiClient.get(`/horarios/${id}/`);
    return response.data;
  },

  // Crear nuevo horario
  crear: async (horarioData) => {
    const response = await apiClient.post("/horarios/", horarioData);
    return response.data;
  },

  // Actualizar horario existente
  actualizar: async (id, horarioData) => {
    const response = await apiClient.put(`/horarios/${id}/`, horarioData);
    return response.data;
  },

  // Eliminar horario
  eliminar: async (id) => {
    const response = await apiClient.delete(`/horarios/${id}/`);
    return response.data;
  },
};

export default horarioService;
