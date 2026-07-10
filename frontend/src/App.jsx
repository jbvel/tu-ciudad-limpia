import { NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";

function App() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/">
          <img
            className="brand__logo"
            src="/logo-tu-ciudad-limpia.png"
            alt="Logo Tu Ciudad Limpia"
          />
          <span>Tu Ciudad Limpia</span>
        </NavLink>
        <nav>
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/mapa">Mapa</NavLink>
        </nav>
      </header>

      <main className="content-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mapa" element={<MapPage />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <img
              className="site-footer__logo"
              src="/logo-blanco.png"
              alt="Logo Tu Ciudad Limpia"
            />
            <div>
              <strong>Tu Ciudad Limpia</strong>
              <p>
                Plataforma ciudadana para reportar microbasurales, visualizar
                incidencias y apoyar decisiones de limpieza urbana.
              </p>
            </div>
          </div>

          <nav className="site-footer__links" aria-label="Navegacion del pie de pagina">
            <span className="site-footer__heading">Explorar</span>
            <NavLink to="/">Inicio</NavLink>
            <NavLink to="/mapa">Mapa de reportes</NavLink>
          </nav>

          <div className="site-footer__meta">
            <span className="site-footer__heading">Enfoque</span>
            <p>Reportes geolocalizados, evidencia visual y datos para seguimiento comunitario.</p>
            <small>{currentYear} Tu Ciudad Limpia. Hecho para municipios y comunidades.</small>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
