import { Outlet, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Layout() {
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(true); // Por defecto abierto
  const [esPantallaPequeña, setEsPantallaPequeña] = useState(
    window.innerWidth < 768,
  );

  // Detectar cambio de tamaño de pantalla y ajustar estado del menú
  useEffect(() => {
    const handleResize = () => {
      const pequeña = window.innerWidth < 768;
      setEsPantallaPequeña(pequeña);

      // En pantallas grandes/medianas, menú abierto por defecto
      // En pantallas pequeñas, menú cerrado por defecto
      if (!pequeña && !menuAbierto) {
        setMenuAbierto(true); // Abrir en desktop si estaba cerrado
      } else if (pequeña && menuAbierto) {
        setMenuAbierto(false); // Cerrar en móvil si estaba abierto
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuAbierto]);

  // Cerrar menú al cambiar de ruta (solo en móvil)
  useEffect(() => {
    if (esPantallaPequeña) {
      setMenuAbierto(false);
    }
  }, [location.pathname, esPantallaPequeña]);

  // Cerrar menú si se hace clic fuera de él (solo en móvil)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (esPantallaPequeña && menuAbierto) {
        const menu = document.querySelector(".menu-lateral");
        const toggler = document.querySelector(".navbar-toggler");
        if (
          menu &&
          !menu.contains(event.target) &&
          toggler &&
          !toggler.contains(event.target)
        ) {
          setMenuAbierto(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuAbierto, esPantallaPequeña]);

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  // Clases para el menú lateral
  const menuClases = `menu-lateral ${menuAbierto ? "abierto" : "cerrado"} ${esPantallaPequeña ? "movil" : "desktop"}`;

  return (
    <div>
      {/* BARRA DE NAVEGACIÓN - Botón hamburguesa SIEMPRE visible */}
      <nav className="navbar navbar-dark bg-dark sticky-top">
        <div className="container-fluid px-3">
          {/* Botón de menú hamburguesa - SIEMPRE visible a la izquierda */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMenu}
            aria-label="Abrir menú"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Logo centrado */}
          <Link className="navbar-brand fw-bold" to="/">
            🏢 SmartGridRoom
          </Link>

          {/* Espacio vacío para equilibrar (opcional) */}
          <div style={{ width: "40px" }}></div>
        </div>
      </nav>

      {/* CONTENEDOR PRINCIPAL CON SIDEBAR */}
      <div className="contenedor-principal">
        {/* Menú lateral desplegable */}
        <div className={menuClases}>
          <div className="menu-header">
            <span className="brand">SmartGridRoom</span>
            <button className="close-btn" onClick={toggleMenu}>
              ✕
            </button>
          </div>
          <ul className="nav-lista">
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/")}`}
                to="/"
                onClick={() => esPantallaPequeña && setMenuAbierto(false)}
              >
                📊 Panel
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/usuarios")}`}
                to="/usuarios"
                onClick={() => esPantallaPequeña && setMenuAbierto(false)}
              >
                👥 Usuarios
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/roles")}`}
                to="/roles"
                onClick={() => esPantallaPequeña && setMenuAbierto(false)}
              >
                🔐 Roles
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/usuarios-roles")}`}
                to="/usuarios-roles"
                onClick={() => esPantallaPequeña && setMenuAbierto(false)}
              >
                🔗 Usuario-Rol
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/salas")}`}
                to="/salas"
                onClick={() => esPantallaPequeña && setMenuAbierto(false)}
              >
                🏛️ Salas
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/horarios")}`}
                to="/horarios"
                onClick={() => esPantallaPequeña && setMenuAbierto(false)}
              >
                ⏰ Horarios
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/asignaciones")}`}
                to="/asignaciones"
                onClick={() => esPantallaPequeña && setMenuAbierto(false)}
              >
                📅 Asignaciones
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/reportes")}`}
                to="/reportes"
                onClick={() => esPantallaPequeña && setMenuAbierto(false)}
              >
                📊 Reportes
              </Link>
            </li>
          </ul>
        </div>

        {/* Overlay (fondo oscuro) - solo visible en móvil cuando el menú está abierto */}
        {esPantallaPequeña && menuAbierto && (
          <div
            className="menu-overlay"
            onClick={() => setMenuAbierto(false)}
          ></div>
        )}

        {/* CONTENIDO PRINCIPAL (se desplaza según el menú) */}
        <div
          className={`contenido-principal ${menuAbierto && !esPantallaPequeña ? "con-menu" : "sin-menu"}`}
        >
          <div className="container mt-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
