import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

const defaultCenter = [-53.1638, -70.9171];
const defaultZoom = 12;

const selectedLocationIcon = L.divIcon({
  className: "custom-marker custom-marker--selected",
  html: '<span class="selected-marker__pin"></span>',
  iconSize: [26, 26],
  iconAnchor: [13, 26],
});

function MapClickHandler({ onChange }) {
  useMapEvents({
    click(event) {
      onChange(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function MapViewport({ position, focusTarget }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, Math.max(map.getZoom(), 15));
      return;
    }

    if (focusTarget?.center) {
      map.setView(focusTarget.center, focusTarget.zoom ?? defaultZoom);
    }
  }, [focusTarget, map, position]);

  return null;
}

export default function LocationPickerMap({
  latitude,
  longitude,
  onChange,
  focusTarget = null,
}) {
  const hasPosition = latitude !== "" && longitude !== "";
  const parsedLatitude = hasPosition ? Number(latitude) : null;
  const parsedLongitude = hasPosition ? Number(longitude) : null;
  const position =
    hasPosition && Number.isFinite(parsedLatitude) && Number.isFinite(parsedLongitude)
      ? [parsedLatitude, parsedLongitude]
      : null;

  return (
    <div className="location-picker">
      <div className="location-picker__hint">
        Haz clic en el mapa o arrastra el marcador para fijar el punto exacto.
      </div>

      <MapContainer
        center={position ?? focusTarget?.center ?? defaultCenter}
        zoom={position ? 15 : focusTarget?.zoom ?? defaultZoom}
        scrollWheelZoom
        className="location-picker__map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onChange={onChange} />
        <MapViewport position={position} focusTarget={focusTarget} />
        {position ? (
          <Marker
            position={position}
            icon={selectedLocationIcon}
            draggable
            eventHandlers={{
              dragend: (event) => {
                const markerPosition = event.target.getLatLng();
                onChange(markerPosition.lat, markerPosition.lng);
              },
            }}
          />
        ) : null}
      </MapContainer>
    </div>
  );
}
