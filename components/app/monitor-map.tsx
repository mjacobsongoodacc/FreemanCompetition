"use client";

import { useEffect, useMemo, useState } from "react";
import {
  GoogleMap,
  Marker,
  Polygon,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { motion, useReducedMotion } from "framer-motion";
import { HurricaneCone } from "@/components/hurricane-cone";
import { evacRoutePath, mapConePath, storm } from "@/lib/mock-data";

const mapDarkStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#162231" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0e1821" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#A8B5C2" }] },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0a1520" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2a3a4f" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#2f4158" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#243041" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#2a3a4f" }],
  },
  {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [{ color: "#243041" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#1c2a3b" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#15202b" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#334155" }],
  },
];

const libraries = ["geometry"] as "geometry"[];

function homePinDataUri() {
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48"><path fill="#E8A76F" stroke="#334155" d="M18 2C11 2 6 7 6 14c0 10 12 30 12 30s12-20 12-30c0-7-5-12-12-12z"/><circle cx="18" cy="14" r="4" fill="#0e1821"/></svg>`
  );
  return `data:image/svg+xml;charset=UTF-8,${svg}`;
}

function stormIconDataUri() {
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="10" fill="#D05A3D" stroke="rgba(208,90,61,0.4)" stroke-width="4"/></svg>`
  );
  return `data:image/svg+xml;charset=UTF-8,${svg}`;
}

type MonitorMapProps = {
  isMobile: boolean;
};

export function MonitorMap({ isMobile }: MonitorMapProps) {
  const reduce = useReducedMotion();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const { isLoaded, loadError } = useJsApiLoader({
    id: "shepherd-map",
    googleMapsApiKey: apiKey.length > 0 ? apiKey : "__missing__",
    libraries,
  });

  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!apiKey) return;
    const t = window.setTimeout(() => {
      if (!(window as unknown as { google?: { maps?: unknown } }).google?.maps) {
        setTimedOut(true);
      }
    }, 2000);
    return () => window.clearTimeout(t);
  }, [apiKey]);

  useEffect(() => {
    if (isLoaded) {
      setTimedOut(false);
    }
  }, [isLoaded]);

  const center = storm.mapCenter;
  const zoom = isMobile ? 6 : 7;

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      styles: mapDarkStyles,
      gestureHandling: isMobile ? "greedy" : "auto",
      backgroundColor: "#0e1821",
    }),
    [isMobile]
  );

  const offline = !apiKey || Boolean(loadError) || timedOut;
  const loading = Boolean(apiKey) && !isLoaded && !loadError;
  const ready = Boolean(apiKey) && isLoaded && !loadError && !timedOut;

  const aspect = isMobile ? "4 / 3" : "16 / 10";

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg border border-border bg-surface-2"
      style={{ aspectRatio: aspect }}
    >
      {offline ? (
        <div className="relative flex h-full w-full flex-col items-center justify-center p-2">
          <div className="absolute left-3 top-3 z-10 rounded bg-[color-mix(in_oklab,var(--amber)_14%,transparent)] px-2 py-1 font-mono text-[10px] font-medium uppercase text-amber">
            Offline map view
          </div>
          <div className="h-full w-full min-h-0">
            <HurricaneCone />
          </div>
        </div>
      ) : loading ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          <motion.div
            className="h-6 w-6 rounded-full border-2 border-amber border-t-transparent"
            animate={reduce ? { rotate: 0 } : { rotate: 360 }}
            transition={
              reduce
                ? { duration: 0 }
                : { repeat: Infinity, duration: 1.2, ease: "linear" }
            }
            aria-hidden
          />
          <p className="font-mono text-[11px] font-medium uppercase text-text-3">
            Loading map…
          </p>
        </div>
      ) : ready ? (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={zoom}
          options={mapOptions}
        >
          <Polygon
            paths={mapConePath}
            options={{
              fillColor: "#E8A76F",
              fillOpacity: 0.24,
              strokeColor: "#E8A76F",
              strokeOpacity: 0.6,
              strokeWeight: 2,
            }}
          />
          <Polyline
            path={evacRoutePath}
            options={{
              strokeColor: "#E8A76F",
              strokeOpacity: 0,
              strokeWeight: 3,
              icons: [
                {
                  icon: {
                    path: "M 0,-1 0,1",
                    strokeOpacity: 1,
                    scale: 4,
                  },
                  offset: "0",
                  repeat: "16px",
                },
              ],
            }}
          />
          <Marker
            position={storm.homePosition}
            title="Home · Gentilly"
            icon={{
              url: homePinDataUri(),
              scaledSize: new google.maps.Size(36, 48),
              anchor: new google.maps.Point(18, 46),
            }}
          />
          <Marker
            position={storm.position}
            icon={{
              url: stormIconDataUri(),
              scaledSize: new google.maps.Size(28, 28),
              anchor: new google.maps.Point(14, 14),
            }}
          />
        </GoogleMap>
      ) : null}
    </div>
  );
}
