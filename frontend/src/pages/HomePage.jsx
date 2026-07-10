import ReportForm from "../components/ReportForm";

export default function HomePage() {
  return (
    <div className="page-stack">
      <section className="hero">
        <div>
          <img
            className="hero__logo"
            src="/logo-tu-ciudad-limpia.png"
            alt="Logo Tu Ciudad Limpia"
          />
          <span className="eyebrow">Tu Ciudad Limpia</span>
          <h1>Reporta focos de basura y levanta evidencia para mejores decisiones.</h1>
          <p>
            Plataforma base para visualizar incidencias, mapear puntos criticos y
            recoger percepciones ciudadanas sobre limpieza urbana y reciclaje.
          </p>
        </div>
      </section>

      <section>
        <ReportForm />
      </section>
    </div>
  );
}
