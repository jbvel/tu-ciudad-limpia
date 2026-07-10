export default function ReportCard({ report }) {
  return (
    <article className="report-card">
      <div className="report-card__header">
        <span className={`badge badge--${report.status}`}>{report.status}</span>
        <strong>{report.title || report.type}</strong>
      </div>
      <p>{report.description}</p>
      <dl>
        <div>
          <dt>Ubicacion</dt>
          <dd>
            {report.commune?.name || "Sin comuna"}, {report.sector}
          </dd>
        </div>
        <div>
          <dt>Referencia</dt>
          <dd>{report.address_reference || "Sin referencia"}</dd>
        </div>
      </dl>
      {report.images?.length ? (
        <div className="report-gallery">
          {report.images.map((image) => (
            <img key={image.id} src={image.url} alt={image.original_name || report.type} />
          ))}
        </div>
      ) : null}
    </article>
  );
}
