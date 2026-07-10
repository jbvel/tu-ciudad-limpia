import { problemTypes, reportStatuses } from "../data/constants";

export default function MapFilters({ filters, onChange, regions, communes }) {
  return (
    <div className="panel filters">
      <div className="section-heading">
        <span className="eyebrow">Filtros</span>
        <h3>Explora el mapa</h3>
      </div>

      <label>
        Tipo de problema
        <select
          value={filters.type}
          onChange={(event) => onChange("type", event.target.value)}
        >
          <option value="">Todos</option>
          {problemTypes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Region
        <select
          value={filters.region_id}
          onChange={(event) => onChange("region_id", event.target.value)}
        >
          <option value="">Todas</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Estado
        <select
          value={filters.status}
          onChange={(event) => onChange("status", event.target.value)}
        >
          <option value="">Todos</option>
          {reportStatuses.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Comuna
        <select
          value={filters.commune_id}
          onChange={(event) => onChange("commune_id", event.target.value)}
          disabled={!filters.region_id}
        >
          <option value="">Todas</option>
          {communes.map((commune) => (
            <option key={commune.id} value={commune.id}>
              {commune.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
