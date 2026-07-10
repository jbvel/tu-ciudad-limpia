import { useEffect, useMemo, useState } from "react";
import MapFilters from "../components/MapFilters";
import OSMMap from "../components/OSMMap";
import {
  fetchCommunesByRegion,
  geocodePlace,
  fetchRegions,
  fetchReports,
} from "../services/api";

const initialFilters = {
  type: "",
  status: "",
  region_id: "",
  commune_id: "",
};

export default function MapPage() {
  const [reports, setReports] = useState([]);
  const [regions, setRegions] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [focusTarget, setFocusTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [regionsData, reportsData] = await Promise.all([
          fetchRegions(),
          fetchReports(),
        ]);
        setRegions(regionsData);
        setReports(reportsData);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  useEffect(() => {
    async function loadCommunes() {
      setCommunes(await fetchCommunesByRegion(filters.region_id));
    }

    loadCommunes();
  }, [filters.region_id]);

  useEffect(() => {
    async function loadFocusTarget() {
      if (!filters.region_id) {
        setFocusTarget(null);
        return;
      }

      const selectedRegion = regions.find(
        (region) => region.id === Number(filters.region_id)
      );
      const selectedCommune = communes.find(
        (commune) => commune.id === Number(filters.commune_id)
      );

      if (!selectedRegion) {
        setFocusTarget(null);
        return;
      }

      const query = selectedCommune
        ? `${selectedCommune.name}, ${selectedRegion.name}, Chile`
        : `${selectedRegion.name}, Chile`;

      try {
        const result = await geocodePlace(query);
        if (!result) {
          setFocusTarget(null);
          return;
        }

        setFocusTarget({
          center: [result.latitude, result.longitude],
          zoom: selectedCommune ? 12 : 8,
        });
      } catch {
        setFocusTarget(null);
      }
    }

    loadFocusTarget();
  }, [communes, filters.commune_id, filters.region_id, regions]);

  const visibleReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesType = !filters.type || report.type === filters.type;
      const matchesStatus = !filters.status || report.status === filters.status;
      const matchesRegion =
        !filters.region_id || report.region_id === Number(filters.region_id);
      const matchesCommune =
        !filters.commune_id || report.commune_id === Number(filters.commune_id);

      return matchesType && matchesStatus && matchesRegion && matchesCommune;
    });
  }, [filters, reports]);

  const mapFocusReports = useMemo(() => {
    if (!filters.region_id && !filters.commune_id) {
      return reports;
    }

    return reports.filter((report) => {
      const matchesRegion =
        !filters.region_id || report.region_id === Number(filters.region_id);
      const matchesCommune =
        !filters.commune_id || report.commune_id === Number(filters.commune_id);

      return matchesRegion && matchesCommune;
    });
  }, [filters.commune_id, filters.region_id, reports]);

  const handleChange = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
      ...(key === "region_id" ? { commune_id: "" } : {}),
    }));
  };

  return (
    <div className="map-layout">
      <MapFilters
        filters={filters}
        onChange={handleChange}
        regions={regions}
        communes={communes}
      />
      <section className="panel map-panel">
        <div className="section-heading">
          <span className="eyebrow">Mapa</span>
          <h2>{loading ? "Cargando reportes..." : `${visibleReports.length} reportes visibles`}</h2>
        </div>
        <OSMMap
          reports={visibleReports}
          focusReports={mapFocusReports}
          focusTarget={focusTarget}
        />
      </section>
    </div>
  );
}
