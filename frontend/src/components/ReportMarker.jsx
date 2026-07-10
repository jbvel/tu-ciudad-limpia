import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import ReportCard from "./ReportCard";

const colorByType = {
  microbasural: "#0B4F9C",
  basura_domiciliaria: "#1DA1F2",
  falta_punto_limpio: "#43B02A",
  reciclaje: "#66C61C",
  retiro_voluminosos: "#f59e0b",
  escombros: "#8b5e34",
  otro: "#475569",
};

function createIcon(type) {
  const color = colorByType[type] ?? colorByType.otro;
  const isMicrodump = type === "microbasural";
  const markerClass = isMicrodump
    ? "custom-marker custom-marker--trash"
    : "custom-marker";
  const markerHtml = isMicrodump
    ? `<span class="trash-icon"><i class="trash-icon__lid"></i><i class="trash-icon__body"></i></span>`
    : `<span style="background:${color}"></span>`;

  return L.divIcon({
    className: markerClass,
    html: markerHtml,
    iconSize: isMicrodump ? [28, 28] : [24, 24],
    iconAnchor: isMicrodump ? [14, 28] : [12, 24],
    popupAnchor: [0, -24],
  });
}

export default function ReportMarker({ report }) {
  return (
    <Marker
      position={[report.latitude, report.longitude]}
      icon={createIcon(report.type)}
    >
      <Popup minWidth={280}>
        <ReportCard report={report} />
      </Popup>
    </Marker>
  );
}
