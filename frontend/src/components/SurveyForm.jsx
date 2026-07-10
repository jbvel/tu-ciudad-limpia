import { useEffect, useState } from "react";
import { frequencyOptions, problemTypes } from "../data/constants";
import {
  fetchCommunesByRegion,
  fetchRegions,
  submitSurvey,
} from "../services/api";

const initialState = {
  region_id: "",
  commune_id: "",
  sector: "",
  problem_type: "microbasural",
  description: "",
  address_reference: "",
  problem_frequency: "",
  has_nearby_recycling_point: "",
  additional_comment: "",
  name_optional: "",
  latitude: "",
  longitude: "",
};

export default function SurveyForm() {
  const [form, setForm] = useState(initialState);
  const [regions, setRegions] = useState([]);
  const [communes, setCommunes] = useState([]);
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "region_id" ? { commune_id: "" } : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    try {
      await submitSurvey({
        ...form,
        region_id: Number(form.region_id),
        commune_id: Number(form.commune_id),
        has_nearby_recycling_point:
          form.has_nearby_recycling_point === ""
            ? null
            : form.has_nearby_recycling_point === "true",
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      });
      setForm(initialState);
      setStatus({ type: "success", message: "Encuesta enviada correctamente." });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.response?.data?.message ??
          "No fue posible guardar la encuesta.",
      });
    }
  };

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <div className="section-heading">
        <span className="eyebrow">Encuesta</span>
        <h2>Diagnostico ciudadano</h2>
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
        <select name="problem_type" value={form.problem_type} onChange={handleChange}>
          {problemTypes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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
      <label>
        Frecuencia
        <select
          name="problem_frequency"
          value={form.problem_frequency}
          onChange={handleChange}
        >
          <option value="">Selecciona una opcion</option>
          {frequencyOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label>
        Existe punto limpio cercano
        <select
          name="has_nearby_recycling_point"
          value={form.has_nearby_recycling_point}
          onChange={handleChange}
        >
          <option value="">No especifica</option>
          <option value="true">Si</option>
          <option value="false">No</option>
        </select>
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
        Latitud
        <input name="latitude" value={form.latitude} onChange={handleChange} />
      </label>
      <label>
        Longitud
        <input name="longitude" value={form.longitude} onChange={handleChange} />
      </label>
      <label className="full-width">
        Comentario adicional
        <textarea
          name="additional_comment"
          value={form.additional_comment}
          onChange={handleChange}
          rows="3"
        />
      </label>

      <button className="primary-button" type="submit">
        Enviar encuesta
      </button>

      {status.message ? (
        <p className={`feedback ${status.type}`}>{status.message}</p>
      ) : null}
    </form>
  );
}
