import apiClient from "../config/api";

const eventoService = {
  // Obtener todos los eventos
  listar: async () => {
    const response = await apiClient.get("/eventos/");
    return response.data;
  },

  // Registrar un nuevo evento
  registrar: async (eventoData) => {
    const response = await apiClient.post("/eventos/", eventoData);
    return response.data;
  },
};

export default eventoService;
