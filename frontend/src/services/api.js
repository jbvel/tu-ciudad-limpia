import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8081/api",
});

export async function fetchReports() {
  const response = await api.get("/reports");
  return response.data.data ?? [];
}

export async function fetchRegions() {
  const response = await api.get("/regions");
  return response.data.data ?? [];
}

export async function fetchCommunesByRegion(regionId) {
  if (!regionId) {
    return [];
  }

  const response = await api.get(`/regions/${regionId}/communes`);
  return response.data.data ?? [];
}

export async function submitSurvey(payload) {
  const response = await api.post("/survey-responses", payload);
  return response.data;
}

export async function submitReport(payload) {
  const response = await api.post("/reports", payload);
  return response.data;
}

export async function uploadReportImages(reportId, files) {
  const formData = new FormData();
  files.forEach((file) => formData.append("images[]", file));

  const response = await api.post(`/reports/${reportId}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data ?? [];
}

const geocodeCache = new Map();

export async function geocodePlace(query) {
  if (!query) {
    return null;
  }

  if (geocodeCache.has(query)) {
    return geocodeCache.get(query);
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Geocoding request failed with status ${response.status}`);
  }

  const results = await response.json();
  const firstMatch = results[0];
  const parsed = firstMatch
    ? {
        latitude: Number(firstMatch.lat),
        longitude: Number(firstMatch.lon),
      }
    : null;

  geocodeCache.set(query, parsed);
  return parsed;
}

export default api;
