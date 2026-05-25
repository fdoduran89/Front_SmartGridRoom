import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";

// Usuarios
import ListadoUsuarios from "./usuarios/ListadoUsuarios";
import AgregarUsuario from "./usuarios/AgregarUsuario";
import EditarUsuario from "./usuarios/EditarUsuario";

// Roles
import ListadoRoles from "./roles/ListadoRoles";
import AgregarRol from "./roles/AgregarRol";
import EditarRol from "./roles/EditarRol";

// Usuario-Rol (Fase 3)
import ListadoAsignaciones from "./asignaciones/ListadoAsignaciones";
import AgregarAsignacion from "./asignaciones/AgregarAsignacion";

// Salas (Fase 4)
import ListadoSalas from "./salas/ListadoSalas";
import AgregarSala from "./salas/AgregarSala";
import EditarSala from "./salas/EditarSala";

// Horarios (Fase 5)
import ListadoHorarios from "./horarios/ListadoHorarios";
import AgregarHorario from "./horarios/AgregarHorario";
import EditarHorario from "./horarios/EditarHorario";

// Asignaciones Completas (Fase 6)
import ListadoAsignacionesCompletas from "./asignaciones_completas/ListadoAsignaciones";
import AgregarAsignacionCompleta from "./asignaciones_completas/AgregarAsignacion";
import EditarAsignacionCompleta from "./asignaciones_completas/EditarAsignacion";

// Reportes (Fase 7)
import ReportesEstadisticos from "./reportes/ReportesEstadisticos";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="usuarios" element={<ListadoUsuarios />} />
          <Route path="usuarios/nuevo" element={<AgregarUsuario />} />
          <Route path="usuarios/editar/:id" element={<EditarUsuario />} />
          <Route path="roles" element={<ListadoRoles />} />
          <Route path="roles/nuevo" element={<AgregarRol />} />
          <Route path="roles/editar/:id" element={<EditarRol />} />
          <Route path="usuarios-roles" element={<ListadoAsignaciones />} />
          <Route path="usuarios-roles/nuevo" element={<AgregarAsignacion />} />
          <Route path="salas" element={<ListadoSalas />} />
          <Route path="salas/nuevo" element={<AgregarSala />} />
          <Route path="salas/editar/:id" element={<EditarSala />} />
          <Route path="horarios" element={<ListadoHorarios />} />
          <Route path="horarios/nuevo" element={<AgregarHorario />} />
          <Route path="horarios/editar/:id" element={<EditarHorario />} />
          <Route
            path="asignaciones"
            element={<ListadoAsignacionesCompletas />}
          />
          <Route
            path="asignaciones/nuevo"
            element={<AgregarAsignacionCompleta />}
          />
          <Route
            path="asignaciones/editar/:id"
            element={<EditarAsignacionCompleta />}
          />
          <Route path="reportes" element={<ReportesEstadisticos />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
