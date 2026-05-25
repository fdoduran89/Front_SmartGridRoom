import apiClient from '../config/api'

const rolService = {
  // Obtener todos los roles
  listar: async () => {
    const response = await apiClient.get('/roles/')
    return response.data
  },

  // Obtener un rol por ID
  obtener: async (id) => {
    const response = await apiClient.get(`/roles/${id}/`)
    return response.data
  },

  // Crear nuevo rol
  crear: async (rolData) => {
    const response = await apiClient.post('/roles/', rolData)
    return response.data
  },

  // Actualizar rol existente
  actualizar: async (id, rolData) => {
    const response = await apiClient.put(`/roles/${id}/`, rolData)
    return response.data
  },

  // Eliminar rol
  eliminar: async (id) => {
    const response = await apiClient.delete(`/roles/${id}/`)
    return response.data
  }
}

export default rolService