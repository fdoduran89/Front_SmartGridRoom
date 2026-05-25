import apiClient from '../config/api'

const usuarioService = {
  // Obtener todos los usuarios
  listar: async () => {
    try {
      const response = await apiClient.get('/usuarios/')
      return response.data
    } catch (error) {
      console.error('Error en listar:', error.response?.data || error.message)
      throw error
    }
  },

  // Obtener un usuario por ID
  obtener: async (id) => {
    try {
      const response = await apiClient.get(`/usuarios/${id}/`)
      return response.data
    } catch (error) {
      console.error('Error en obtener:', error.response?.data || error.message)
      throw error
    }
  },

  // Crear nuevo usuario
  crear: async (usuarioData) => {
    try {
      const response = await apiClient.post('/usuarios/', usuarioData)
      return response.data
    } catch (error) {
      // Mostrar el error detallado del backend
      const errorMessage = error.response?.data || error.message
      console.error('Error detallado del backend:', errorMessage)
      throw new Error(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage)
    }
  },

  // Actualizar usuario existente
  actualizar: async (id, usuarioData) => {
    try {
      const response = await apiClient.put(`/usuarios/${id}/`, usuarioData)
      return response.data
    } catch (error) {
      console.error('Error en actualizar:', error.response?.data || error.message)
      throw error
    }
  },

  // Eliminar usuario
  eliminar: async (id) => {
    try {
      const response = await apiClient.delete(`/usuarios/${id}/`)
      return response.data
    } catch (error) {
      console.error('Error en eliminar:', error.response?.data || error.message)
      throw error
    }
  }
}

export default usuarioService