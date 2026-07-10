import { useEffect, useState } from "react";
import LocationPickerMap from "./LocationPickerMap";
import { problemTypes } from "../data/constants";
import {
  fetchCommunesByRegion,
  fetchRegions,
  geocodePlace,
  submitReport,
  uploadReportImages,
} from "../services/api";

const initialState = {
  region_id: "",
  commune_id: "",
  sector: "",
  type: "microbasural",
  title: "",
  description: "",
  address_reference: "",
  latitude: "",
  longitude: "",
  name_optional: "",
};

export default function ReportForm() {
  const [form, setForm] = useState(initialState);
  const [files, setFiles] = useState([]);
  const [regions, setRegions] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [focusTarget, setFocusTarget] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    async function loadRegions() {
      setRegions(await fetchRegions());
    }

    loadRegions();
  }, []);

  useEffect(() => {
    async function loadCommunes() {
      setCommunes(await fetchCommunesByRegion(form.region_id));
    }

    loadCommunes();
  }, [form.region_id]);

  useEffect(() => {
    async function loadFocusTarget() {
      if (form.latitude && form.longitude) {
        setFocusTarget(null);
        return;
      }

      if (!form.region_id) {
        setFocusTarget(null);
        return;
      }

      const selectedRegion = regions.find(
        (region) => region.id === Number(form.region_id)
      );
      const selectedCommune = communes.find(
        (commune) => commune.id === Number(form.commune_id)
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
  }, [communes, form.commune_id, form.latitude, form.longitude, form.region_id, regions]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "region_id" ? { commune_id: "" } : {}),
    }));
  };

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files ?? []).slice(0, 5));
  };

  const handleLocationChange = (latitude, longitude) => {
    setForm((current) => ({
      ...current,
      latitude: latitude.toFixed(7),
      longitude: longitude.toFixed(7),
    }));
  };

  const handleUseLocation = async () => {
    if (!navigator.geolocation) {
      setStatus({ type: "error", message: "Tu navegador no soporta geolocalizacion." });
      return;
    }

    setStatus({ type: "", message: "Obteniendo una lectura nueva de tu ubicacion..." });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const accuracy = Math.round(position.coords.accuracy);
        const capturedAt = new Date(position.timestamp).toLocaleTimeString("es-CL", {
          hour: "2-digit",
          minute: "2-digit",
        });

        setForm((current) => ({
          ...current,
          latitude: position.coords.latitude.toFixed(7),
          longitude: position.coords.longitude.toFixed(7),
        }));

        setStatus({
          type: accuracy > 1000 ? "error" : "success",
          message:
            accuracy > 1000
              ? `Se obtuvo una ubicacion muy imprecisa (±${accuracy} m, ${capturedAt}). Esto suele pasar cuando el navegador usa red/IP en vez de GPS.`
              : `Ubicacion capturada con precision aproximada de ±${accuracy} m a las ${capturedAt}.`,
        });
      },
      (error) => {
        const messages = {
          1: "Permiso de ubicacion denegado. Habilitalo en el navegador.",
          2: "No fue posible determinar tu ubicacion actual.",
          3: "La ubicacion tardo demasiado en responder.",
        };

        setStatus({
          type: "error",
          message: messages[error.code] ?? "No fue posible obtener tu ubicacion.",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    try {
      const created = await submitReport({
        ...form,
        region_id: Number(form.region_id),
        commune_id: Number(form.commune_id),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      });

      if (files.length > 0) {
        await uploadReportImages(created.id, files);
      }

      setForm(initialState);
      setFiles([]);
      setStatus({ type: "success", message: "Reporte enviado correctamente." });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.response?.data?.message ?? "No fue posible registrar el reporte.",
      });
    }
  };

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <div className="section-heading">
        <span className="eyebrow">Reporte</span>
        <h2>Sube una incidencia georreferenciada</h2>
      </div>

      <label>
        Region
        <select name="region_id" value={form.region_id} onChange={handleChange} required>
          <option value="">Selecciona una region</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Comuna
        <select
          name="commune_id"
          value={form.commune_id}
          onChange={handleChange}
          required
          disabled={!form.region_id}
        >
          <option value="">Selecciona una comuna</option>
          {communes.map((commune) => (
            <option key={commune.id} value={commune.id}>
              {commune.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Sector
        <input name="sector" value={form.sector} onChange={handleChange} required />
      </label>
      <label>
        Tipo de problema
        <select name="type" value={form.type} onChange={handleChange}>
          {problemTypes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Titulo
        <input name="title" value={form.title} onChange={handleChange} />
      </label>
      <label className="full-width">
        Descripcion
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          required
        />
      </label>
      <label>
        Direccion o referencia
        <input
          name="address_reference"
          value={form.address_reference}
          onChange={handleChange}
        />
      </label>
      <div className="full-width">
        <LocationPickerMap
          latitude={form.latitude}
          longitude={form.longitude}
          onChange={handleLocationChange}
          focusTarget={focusTarget}
        />
      </div>
      <label>
        Latitud
        <input name="latitude" value={form.latitude} onChange={handleChange} required />
      </label>
      <label>
        Longitud
        <input name="longitude" value={form.longitude} onChange={handleChange} required />
      </label>
      <label>
        Nombre opcional
        <input
          name="name_optional"
          value={form.name_optional}
          onChange={handleChange}
        />
      </label>
      <label>
        Fotos
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileChange}
        />
      </label>

      <button className="secondary-button" type="button" onClick={handleUseLocation}>
        Usar mi ubicacion actual
      </button>
      <button className="primary-button" type="submit">
        Enviar reporte
      </button>

      {status.message ? (
        <p className={`feedback ${status.type}`}>{status.message}</p>
      ) : null}
    </form>
  );
}
