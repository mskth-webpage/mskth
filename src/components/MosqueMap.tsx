"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type MapMarker = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

/** Adjusts the map viewport to fit all mosque markers with padding whenever the list changes. */
function FitBounds({ mosques }: { mosques: MapMarker[] }) {
  const map = useMap();
  useEffect(() => {
    if (mosques.length === 0) return;
    const bounds = L.latLngBounds(mosques.map((m) => [m.latitude, m.longitude]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [mosques, map]);
  return null;
}

type Props = { mosques: MapMarker[] };

/** Interactive Leaflet map that renders a pin for every mosque fetched from the database. */
export default function MosqueMap({ mosques }: Props) {
  const center: [number, number] =
    mosques.length > 0
      ? [mosques[0].latitude, mosques[0].longitude]
      : [59.3158, 18.0747];

  /** Created inside the component so L.divIcon() only runs after the DOM is available. */
  const pinIcon = useMemo(
    () =>
      L.divIcon({
        className: "",
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z" fill="#16a34a"/>
    <circle cx="14" cy="14" r="6" fill="white"/>
  </svg>`,
        iconSize: [28, 36],
        iconAnchor: [14, 36],
        popupAnchor: [0, -38],
      }),
    []
  );

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds mosques={mosques} />
      {mosques.map((mosque) => (
        <Marker key={mosque.id} position={[mosque.latitude, mosque.longitude]} icon={pinIcon}>
          <Popup>
            <strong>{mosque.name}</strong>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
