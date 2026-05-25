import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import asignacionService from '../services/asignacionService'
import usuarioService from '../services/usuarioService'
import salaService from '../services/salaService'
import horarioService from '../services/horarioService'

function ListadoAsignaciones() {
  const [asignaciones, setAsignaciones] = useState([])
  const [usuarios, setUsuarios] = useState({})
  const [salas, setSalas] = useState({})
  const [horarios, setHorarios] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const diasMap = {
    'LUN': 'Lunes',
    'MAR': 'Martes',
    'MIE': 'Miércoles',
    'JUE': 'Jueves',
    'VIE': 'Viernes',
    'SAB': 'Sábado',
    'DOM': 'Domingo'
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      
      const [asignacionesData, usuariosData, salasData, horariosData] = await Promise.all([
        asignacionService.listar(),
        usuarioService.listar(),
        salaService.listar(),
        horarioService.listar()
      ])
      
      setAsignaciones(asignacionesData)
      
      // Crear mapas para búsqueda rápida
      const usuariosMap = {}
      usuariosData.forEach(u => {
        usuariosMap[u.idUsuario] = `${u.nombre} ${u.apellido} (${u.documento})`
      })
      
      const salasMap = {}
      salasData.forEach(s => {
        salasMap[s.idSala] = `${s.nombreSala} (${s.ubicacion})`
      })
      
      const horariosMap = {}
      horariosData.forEach(h => {
        horariosMap[h.idHorario] = `${diasMap[h.diaSemana]} ${h.horaInicio}-${h.horaFin}`
      })
      
      setUsuarios(usuariosMap)
      setSalas(salasMap)
      setHorarios(horariosMap)
      setError(null)
      
    } catch (err) {
      console.error(err)
      setError('Error al cargar las asignaciones')
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = async (id) => {
    if (window.confirm('¿Eliminar esta asignación?')) {
      try {
        await asignacionService.eliminar(id)
        await cargarDatos()
        alert('✅ Asignación eliminada exitosamente')
      } catch (err) {
        console.error(err)
        alert('❌ Error al eliminar la asignación')
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando asignaciones...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Asignaciones de Horarios</h2>
          <p className="text-muted mb-0">Relaciona usuarios con salas y horarios específicos</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/asignaciones/nuevo')}
        >
          + Nueva Asignación
        </button>
      </div>

      <div className="card shadow">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Sala</th>
                  <th>Horario</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Estado</th>
                  <th width="100">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {asignaciones.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No hay asignaciones registradas
                    </td>
                  </tr>
                ) : (
                  asignaciones.map((asig) => (
                    <tr key={asig.idAsignacion}>
                      <td>{asig.idAsignacion}</td>
                      <td>
                        <strong>{usuarios[asig.idUsuario]?.split(' (')[0] || 'Cargando...'}</strong>
                        <br />
                        <small className="text-muted">ID: {asig.idUsuario}</small>
                      </td>
                      <td>
                        <strong>{salas[asig.idSala]?.split(' (')[0] || 'Cargando...'}</strong>
                        <br />
                        <small className="text-muted">ID: {asig.idSala}</small>
                      </td>
                      <td>
                        <span className="badge bg-info">
                          {horarios[asig.idHorario] || 'Cargando...'}
                        </span>
                      </td>
                      <td>{formatDate(asig.fechaInicio)}</td>
                      <td>{formatDate(asig.fechaFin)}</td>
                      <td>
                        {asig.estado ? (
                          <span className="badge bg-success">Activa</span>
                        ) : (
                          <span className="badge bg-danger">Inactiva</span>
                        )}
                      </td>
                      <td>
                        <button 
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => navigate(`/asignaciones/editar/${asig.idAsignacion}`)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleEliminar(asig.idAsignacion)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListadoAsignaciones