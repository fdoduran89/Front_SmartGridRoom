import apiClient from "../config/api";

const usuarioRolService = {
  // Obtener todas las asignaciones usuario-rol
  listar: async () => {
    const response = await apiClient.get("/usuarios-roles/");
    return response.data;
  },

  // Obtener una asignación por ID
  obtener: async (id) => {
    const response = await apiClient.get(`/usuarios-roles/${id}/`);
    return response.data;
  },

  // Crear nueva asignación
  crear: async (asignacionData) => {
    const response = await apiClient.post("/usuarios-roles/", asignacionData);
    return response.data;
  },

  // Eliminar asignación
  eliminar: async (id) => {
    const response = await apiClient.delete(`/usuarios-roles/${id}/`);
    return response.data;
  },
};

export default usuarioRolService;
