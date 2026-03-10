"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);

const Polyline = dynamic(
  () => import("react-leaflet").then((m) => m.Polyline),
  { ssr: false }
);

type MapProps = {
  pickup: string;
  drop: string;
  setDistance: (distance: number) => void;
  rideStatus?: string;
};

// Convert place → coordinates
async function geocode(place: string) {

  const url =
    "https://corsproxy.io/?https://nominatim.openstreetmap.org/search?format=json&q=" +
    encodeURIComponent(place + ", Bangalore");

  const res = await fetch(url);
  const data = await res.json();

  if (!data || data.length === 0) return null;

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
  };

}

// Get full driving route
async function getRoute(p: any, d: any) {

  const url =
    `https://router.project-osrm.org/route/v1/driving/${p.lon},${p.lat};${d.lon},${d.lat}?overview=full&geometries=geojson`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.routes || data.routes.length === 0) return null;

  return data.routes[0];

}

export default function Map({
  pickup,
  drop,
  setDistance,
  rideStatus
}: MapProps) {

  const mapRef = useRef<any>(null);

  const [pickupCoords, setPickupCoords] = useState<any>(null);
  const [dropCoords, setDropCoords] = useState<any>(null);
  const [routeCoords, setRouteCoords] = useState<any[]>([]);
  const [driverPos, setDriverPos] = useState<any>(null);

  const [pickupIcon, setPickupIcon] = useState<any>(null);
  const [dropIcon, setDropIcon] = useState<any>(null);
  const [driverIcon, setDriverIcon] = useState<any>(null);

  useEffect(() => {

    if (typeof window !== "undefined") {

      const L = require("leaflet");

      delete L.Icon.Default.prototype._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const pickupMarker = new L.Icon({
        iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
        iconSize: [40, 40],
      });

      const dropMarker = new L.Icon({
        iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        iconSize: [40, 40],
      });

      const driverMarker = new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
        iconSize: [35, 35],
      });

      setPickupIcon(pickupMarker);
      setDropIcon(dropMarker);
      setDriverIcon(driverMarker);
    }

  }, []);

  useEffect(() => {

    if (!pickup || !drop) return;

    async function loadRoute() {

      const p = await geocode(pickup);
      const d = await geocode(drop);

      if (!p || !d) return;

      setPickupCoords([p.lat, p.lon]);
      setDropCoords([d.lat, d.lon]);

      const route = await getRoute(p, d);

      if (!route) return;

      const distanceKm = route.distance / 1000;

      setDistance(distanceKm);

      const coords = route.geometry.coordinates.map((c: any) => [
        c[1],
        c[0],
      ]);

      setRouteCoords(coords);

      if (mapRef.current && coords.length > 0) {
        mapRef.current.fitBounds(coords, { padding: [50, 50] });
      }

      setDriverPos(coords[0]);

      // Move driver only when ride is ongoing
      let i = 0;

      // Start driver at pickup
      setDriverPos(coords[0]);

      // Move driver only when ride is ongoing
      if (rideStatus === "ongoing") {

        const interval = setInterval(() => {

          if (i >= coords.length) {
            clearInterval(interval);
            return;
          }

          setDriverPos(coords[i]);
          i++;

        }, 800);

      }

    }

    loadRoute();

  }, [pickup, drop, rideStatus]);

  return (
    <>
      <style>{`
        .map-shell {
          position: relative;
          width: 100%;
          height: 300px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow:
            0 0 0 1px rgba(124,106,247,0.12),
            0 8px 32px rgba(0,0,0,0.45),
            inset 0 1px 0 rgba(255,255,255,0.05);
        }

        /* Dark map tile filter */
        .map-shell .leaflet-tile-pane {
          filter: brightness(0.82) saturate(0.6) hue-rotate(190deg) contrast(1.1);
        }

        /* Route polyline glow — override inline color via filter */
        .map-shell .leaflet-overlay-pane path {
          stroke: #7c6af7 !important;
          stroke-width: 4px !important;
          stroke-linecap: round !important;
          stroke-linejoin: round !important;
          filter: drop-shadow(0 0 6px rgba(124,106,247,0.7));
        }

        /* Hide leaflet attribution (keeps credits in tile but not the overlay box) */
        .map-shell .leaflet-control-attribution {
          background: rgba(10,10,20,0.65) !important;
          backdrop-filter: blur(6px);
          border-radius: 6px 0 0 0 !important;
          color: rgba(255,255,255,0.3) !important;
          font-size: 9px !important;
          padding: 2px 6px !important;
          border: none !important;
        }
        .map-shell .leaflet-control-attribution a {
          color: rgba(255,255,255,0.35) !important;
        }

        /* Zoom controls */
        .map-shell .leaflet-control-zoom {
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-radius: 10px !important;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.4) !important;
          margin: 12px !important;
        }
        .map-shell .leaflet-control-zoom a {
          background: rgba(13,17,32,0.9) !important;
          backdrop-filter: blur(8px);
          color: rgba(255,255,255,0.7) !important;
          border-bottom: 1px solid rgba(255,255,255,0.07) !important;
          width: 30px !important;
          height: 30px !important;
          line-height: 30px !important;
          font-size: 16px !important;
          transition: background 0.2s, color 0.2s;
        }
        .map-shell .leaflet-control-zoom a:hover {
          background: rgba(124,106,247,0.25) !important;
          color: #fff !important;
        }
        .map-shell .leaflet-control-zoom-out {
          border-bottom: none !important;
        }

        /* Status pill overlay */
        .map-status-pill {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(10,10,20,0.82);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          padding: 5px 14px 5px 10px;
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          white-space: nowrap;
          box-shadow: 0 4px 16px rgba(0,0,0,0.5);
          pointer-events: none;
        }

        .map-status-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .dot-ongoing  { background: #22d3ee; animation: mapPulse 1.4s ease-in-out infinite; }
        .dot-accepted { background: #60a5fa; }
        .dot-requested{ background: #c084fc; animation: mapPulse 1.4s ease-in-out infinite; }
        .dot-completed{ background: #10b981; }

        @keyframes mapPulse {
          0%,100% { opacity:1; transform: scale(1); }
          50%      { opacity:.4; transform: scale(1.6); }
        }

        .map-status-text-ongoing   { color: #22d3ee; }
        .map-status-text-accepted  { color: #60a5fa; }
        .map-status-text-requested { color: #c084fc; }
        .map-status-text-completed { color: #10b981; }

        /* Loading shimmer */
        .map-loading {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            110deg,
            rgba(13,17,32,0.95) 30%,
            rgba(30,24,60,0.6) 50%,
            rgba(13,17,32,0.95) 70%
          );
          background-size: 200% 100%;
          animation: shimmer 1.8s linear infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          border-radius: 16px;
          pointer-events: none;
        }
        @keyframes shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }
        .map-loading-label {
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
        }
      `}</style>

      <div className="map-shell">
        {/* Status pill overlay */}
        {rideStatus && (
          <div className="map-status-pill">
            <span className={`map-status-dot dot-${rideStatus}`} />
            <span className={`map-status-text-${rideStatus}`}>
              {rideStatus === "ongoing"   && "Driver en route"}
              {rideStatus === "accepted"  && "Driver accepted"}
              {rideStatus === "requested" && "Finding driver…"}
              {rideStatus === "completed" && "Ride completed"}
            </span>
          </div>
        )}

        {/* Loading state before coords load */}
        {!pickupCoords && !dropCoords && (
          <div className="map-loading">
            <span className="map-loading-label">Plotting route…</span>
          </div>
        )}

        <MapContainer
          center={[12.9716, 77.5946]}
          zoom={11}
          ref={mapRef}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {pickupCoords && pickupIcon && (
            <Marker position={pickupCoords} icon={pickupIcon} />
          )}

          {dropCoords && dropIcon && (
            <Marker position={dropCoords} icon={dropIcon} />
          )}

          {driverPos && driverIcon && (
            <Marker position={driverPos} icon={driverIcon} />
          )}

          {routeCoords.length > 0 && (
            <Polyline positions={routeCoords} color="blue" />
          )}
        </MapContainer>
      </div>
    </>
  );
}
