import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          🏢 SmartGridRoom
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/")}`} to="/">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/usuarios")}`}
                to="/usuarios"
              >
                👥 Usuarios
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/roles")}`} to="/roles">
                🔐 Roles
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/usuarios-roles")}`}
                to="/usuarios-roles"
              >
                🔗 Usuario-Rol
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/salas")}`} to="/salas">
                🏛️ Salas
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/horarios")}`}
                to="/horarios"
              >
                ⏰ Horarios
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/asignaciones")}`}
                to="/asignaciones"
              >
                📅 Asignaciones
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/reportes")}`}
                to="/reportes"
              >
                📊 Reportes
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
