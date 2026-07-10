import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import ReportMarker from "./ReportMarker";

const defaultCenter = [-53.1638, -70.9171];
const defaultZoom = 12;

function MapViewport({ focusReports, focusTarget }) {
  const map = useMap();

  useEffect(() => {
    if (focusTarget?.center) {
      map.setView(focusTarget.center, focusTarget.zoom ?? defaultZoom);
      return;
    }

    const validPoints = focusReports
      .map((report) => [Number(report.latitude), Number(report.longitude)])
      .filter(
        ([latitude, longitude]) =>
          Number.isFinite(latitude) && Number.isFinite(longitude)
      );

    if (validPoints.length === 0) {
      map.setView(defaultCenter, defaultZoom);
      return;
    }

    if (validPoints.length === 1) {
      map.setView(validPoints[0], 15);
      return;
    }

    map.fitBounds(validPoints, {
      padding: [40, 40],
    });
  }, [focusReports, focusTarget, map]);

  return null;
}

export default function OSMMap({
  reports,
  focusReports = reports,
  focusTarget = null,
}) {
  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      scrollWheelZoom
      className="map-shell"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapViewport focusReports={focusReports} focusTarget={focusTarget} />
      {reports.map((report) => (
        <ReportMarker key={report.id} report={report} />
      ))}
    </MapContainer>
  );
}
