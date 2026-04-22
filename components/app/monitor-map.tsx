"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  OverlayView,
  Polygon,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { motion, useReducedMotion } from "framer-motion";
import { HurricaneCone } from "@/components/hurricane-cone";
import { mapConePath, storm } from "@/lib/mock-data";
import { useCurrentStreams } from "@/lib/hooks/use-current-streams";
import { useStorm } from "@/lib/storm-context";

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

type MapType = "dark" | "satellite" | "hybrid";

function homePinDataUri() {
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48"><path fill="#E8A76F" stroke="#334155" d="M18 2C11 2 6 7 6 14c0 10 12 30 12 30s12-20 12-30c0-7-5-12-12-12z"/><circle cx="18" cy="14" r="4" fill="#0e1821"/></svg>`
  );
  return `data:image/svg+xml;charset=UTF-8,${svg}`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- retained for external/icon URL references
function stormIconDataUri() {
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="10" fill="#D05A3D" stroke="rgba(208,90,61,0.4)" stroke-width="4"/></svg>`
  );
  return `data:image/svg+xml;charset=UTF-8,${svg}`;
}

function destinationPinDataUri() {
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48"><path fill="#E8A76F" stroke="#334155" d="M18 2C11 2 6 7 6 14c0 10 12 30 12 30s12-20 12-30c0-7-5-12-12-12z"/></svg>`
  );
  return `data:image/svg+xml;charset=UTF-8,${svg}`;
}

function coneColors(category: number | undefined): {
  fill: string;
  stroke: string;
  fillOpacity: number;
} {
  if (!category || category <= 2)
    return { fill: "#E8A76F", stroke: "#E8A76F", fillOpacity: 0.18 };
  if (category === 3)
    return { fill: "#E8A76F", stroke: "#E8A76F", fillOpacity: 0.24 };
  if (category === 4)
    return { fill: "#C78251", stroke: "#C78251", fillOpacity: 0.28 };
  return { fill: "#D05A3D", stroke: "#D05A3D", fillOpacity: 0.32 };
}

const getPixelPositionOffset = (width: number, height: number) => ({
  x: -(width / 2),
  y: -(height / 2),
});

type MonitorMapProps = {
  isMobile: boolean;
};

export function MonitorMap({ isMobile }: MonitorMapProps) {
  const reduce = useReducedMotion();
  const { stormActive } = useStorm();
  const { streams, meta } = useCurrentStreams(stormActive);
  const disaster = streams.disaster;
  const world = streams.world;
  const location = streams.location;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const { isLoaded, loadError } = useJsApiLoader({
    id: "shepherd-map",
    googleMapsApiKey: apiKey.length > 0 ? apiKey : "__missing__",
    libraries,
  });

  const [timedOut, setTimedOut] = useState(false);
  const [mapType, setMapType] = useState<MapType>("dark");
  const [routePath, setRoutePath] = useState<google.maps.LatLngLiteral[] | null>(
    null
  );
  const [directionsResult, setDirectionsResult] =
    useState<google.maps.DirectionsResult | null>(null);
  const [conePulse, setConePulse] = useState(false);
  const prevCategoryRef = useRef<number | undefined>(undefined);

  const stormPosition = useMemo(
    () => ({
      lat: disaster?.position?.lat ?? storm.position.lat,
      lng: disaster?.position?.lng ?? storm.position.lng,
    }),
    [disaster?.position?.lat, disaster?.position?.lng]
  );

  const [animatedStormPos, setAnimatedStormPos] = useState<{
    lat: number;
    lng: number;
  }>(() => ({
    lat: disaster?.position?.lat ?? storm.position.lat,
    lng: disaster?.position?.lng ?? storm.position.lng,
  }));
  const prevStormPosRef = useRef<{ lat: number; lng: number } | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);

  const routeColor =
    meta?.urgency === "high" ? "#D05A3D" : "#E8A76F";

  const coneBase = coneColors(disaster?.category);
  const fillOpacity =
    coneBase.fillOpacity + (conePulse && !reduce ? 0.15 : 0);

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

  useEffect(() => {
    const c = disaster?.category;
    const prev = prevCategoryRef.current;
    if (
      prev !== undefined &&
      c !== undefined &&
      c !== prev &&
      !reduce
    ) {
      setConePulse(true);
      const id = window.setTimeout(() => setConePulse(false), 1200);
      prevCategoryRef.current = c;
      return () => clearTimeout(id);
    }
    if (c !== undefined) prevCategoryRef.current = c;
  }, [disaster?.category, reduce]);

  useEffect(() => {
    if (reduce) {
      setAnimatedStormPos(stormPosition);
      prevStormPosRef.current = stormPosition;
      return;
    }
    const to = stormPosition;
    const from = prevStormPosRef.current;
    if (from === null) {
      prevStormPosRef.current = to;
      setAnimatedStormPos(to);
      return;
    }
    if (from.lat === to.lat && from.lng === to.lng) return;
    const start = performance.now();
    const duration = 1500;
    let rafId: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedStormPos({
        lat: from.lat + (to.lat - from.lat) * eased,
        lng: from.lng + (to.lng - from.lng) * eased,
      });
      if (t < 1) rafId = requestAnimationFrame(tick);
      else prevStormPosRef.current = to;
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [stormPosition, reduce]);

  const routeSpec = useMemo(() => {
    const loc = location;
    if (!loc || !loc.current?.address || !loc.target?.address) return null;
    return {
      origin: loc.current.address,
      destination: loc.target.lodging
        ? `${loc.target.lodging}, ${loc.target.address}`
        : loc.target.address,
    };
  }, [location]);

  const detourWaypoints = useMemo(() => {
    if (!world?.items) return [];
    return world.items
      .filter((item) => item.detour_via)
      .map((item) => ({
        location: item.detour_via as google.maps.LatLngLiteral,
        stopover: false,
      }));
  }, [world]);

  useEffect(() => {
    if (!routeSpec) {
      setRoutePath(null);
      setDirectionsResult(null);
      return;
    }
    if (!isLoaded || typeof google === "undefined" || !google.maps) {
      return;
    }
    let cancelled = false;
    const service = new google.maps.DirectionsService();
    service
      .route({
        origin: routeSpec.origin,
        destination: routeSpec.destination,
        waypoints:
          detourWaypoints.length > 0 ? detourWaypoints : undefined,
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: google.maps.TrafficModel.PESSIMISTIC,
        },
      })
      .then((result) => {
        if (cancelled) return;
        setDirectionsResult(result);
        const path = result.routes[0]?.overview_path?.map((p) => ({
          lat: p.lat(),
          lng: p.lng(),
        }));
        if (path && path.length > 0) setRoutePath(path);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("Directions API failed:", err);
        setDirectionsResult(null);
        setRoutePath(null);
      });
    return () => {
      cancelled = true;
    };
  }, [isLoaded, routeSpec, detourWaypoints]);

  const center = storm.mapCenter;
  const zoom = isMobile ? 6 : 7;

  const mapOptions = useMemo((): google.maps.MapOptions => {
    const base: google.maps.MapOptions = {
      disableDefaultUI: true,
      gestureHandling: isMobile ? "greedy" : "auto",
      backgroundColor: "#0a0d10",
    };
    if (typeof google === "undefined" || !google.maps) {
      return { ...base, styles: mapDarkStyles };
    }
    const mapTypeId =
      mapType === "satellite"
        ? google.maps.MapTypeId.SATELLITE
        : mapType === "hybrid"
          ? google.maps.MapTypeId.HYBRID
          : google.maps.MapTypeId.ROADMAP;
    return {
      ...base,
      mapTypeId,
      ...(mapType === "dark" ? { styles: mapDarkStyles } : {}),
    };
  }, [isMobile, mapType]);

  const [animatedRoutePath, setAnimatedRoutePath] = useState<
    google.maps.LatLngLiteral[]
  >([]);

  useEffect(() => {
    const path = routePath;
    if (!path || path.length === 0) {
      setAnimatedRoutePath([]);
      return;
    }
    if (reduce) {
      setAnimatedRoutePath(path);
      return;
    }
    let rafId: number;
    const start = performance.now();
    const duration = 1400;
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const endIndex = Math.max(1, Math.floor(path.length * eased));
      setAnimatedRoutePath(path.slice(0, endIndex + 1));
      if (t < 1) rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [routePath, reduce]);

  useEffect(() => {
    if (!routePath || !mapRef.current) return;
    const bounds = new google.maps.LatLngBounds();
    routePath.forEach((p) => bounds.extend(p));
    mapRef.current.fitBounds(bounds, 80);
  }, [routePath]);

  const leg = directionsResult?.routes?.[0]?.legs?.[0];

  const destinationCity = location?.target?.address
    ? location.target.address.split(",")[0]?.trim().toUpperCase() ?? ""
    : "";

  let distanceText = "";
  let durationText = "";
  let arrivalText: string | null = null;
  if (leg) {
    distanceText = leg.distance?.text ?? "";
    durationText =
      leg.duration_in_traffic?.text ?? leg.duration?.text ?? "";
    const secs =
      leg.duration_in_traffic?.value ?? leg.duration?.value ?? 0;
    const arrival = new Date(Date.now() + secs * 1000);
    arrivalText = `${arrival.getHours().toString().padStart(2, "0")}:${arrival.getMinutes().toString().padStart(2, "0")}`;
  }

  const offline = !apiKey || Boolean(loadError) || timedOut;
  const loading = Boolean(apiKey) && !isLoaded && !loadError;
  const ready = Boolean(apiKey) && isLoaded && !loadError && !timedOut;

  const aspect = isMobile ? "4 / 3" : "16 / 10";

  const mapTypeButtons: { id: MapType; label: string }[] = [
    { id: "dark", label: "Dark" },
    { id: "satellite", label: "Satellite" },
    { id: "hybrid", label: "Hybrid" },
  ];

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    if (trafficLayerRef.current) {
      trafficLayerRef.current.setMap(null);
    }
    const layer = new google.maps.TrafficLayer();
    layer.setMap(map);
    trafficLayerRef.current = layer;
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg border border-border bg-surface-2"
      style={{ aspectRatio: aspect }}
    >
      <style>{`
        @keyframes storm-spin {
          to { transform: rotate(360deg); }
        }
        .storm-spin {
          animation: storm-spin 20s linear infinite;
          transform-origin: center;
          width: 28px;
          height: 28px;
        }
        @media (prefers-reduced-motion: reduce) {
          .storm-spin { animation: none; }
        }
      `}</style>
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
        <div className="relative h-full w-full">
          {directionsResult && leg && (
            <div className="absolute left-3 top-3 z-10 rounded-md border border-border bg-[color-mix(in_oklab,var(--bg)_85%,transparent)] px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-text-1 backdrop-blur-sm">
              <div className="text-text-3">{destinationCity}</div>
              <div className="mt-0.5 flex flex-wrap items-center gap-2">
                <span>{distanceText}</span>
                <span className="text-border">·</span>
                <span>{durationText}</span>
                {arrivalText && (
                  <>
                    <span className="text-border">·</span>
                    <span className="text-amber">ARR {arrivalText}</span>
                  </>
                )}
              </div>
            </div>
          )}
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={center}
            zoom={zoom}
            options={mapOptions}
            onLoad={onMapLoad}
          >
            <Polygon
              paths={mapConePath}
              options={{
                fillColor: coneBase.fill,
                fillOpacity,
                strokeColor: coneBase.stroke,
                strokeOpacity: 0.6,
                strokeWeight: 2,
              }}
            />
            {routePath && routePath.length > 0 ? (
              <>
                <Polyline
                  path={animatedRoutePath}
                  options={{
                    strokeColor: routeColor,
                    strokeOpacity: 0.25,
                    strokeWeight: 12,
                    zIndex: 1,
                  }}
                />
                <Polyline
                  path={animatedRoutePath}
                  options={{
                    strokeColor: routeColor,
                    strokeOpacity: 1,
                    strokeWeight: 5,
                    zIndex: 2,
                  }}
                />
              </>
            ) : null}
            <Marker
              position={storm.homePosition}
              title="Home · Gentilly"
              icon={{
                url: homePinDataUri(),
                scaledSize: new google.maps.Size(36, 48),
                anchor: new google.maps.Point(18, 46),
              }}
            />
            {routePath && routePath.length > 0 && (
              <Marker
                position={routePath[routePath.length - 1]}
                icon={{
                  url: destinationPinDataUri(),
                  scaledSize: new google.maps.Size(36, 48),
                  anchor: new google.maps.Point(18, 46),
                }}
              />
            )}
            <OverlayView
              position={animatedStormPos}
              mapPaneName="overlayMouseTarget"
              getPixelPositionOffset={getPixelPositionOffset}
            >
              <div className="storm-spin pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  aria-hidden
                >
                  <circle
                    cx="14"
                    cy="14"
                    r="10"
                    fill="#D05A3D"
                    stroke="rgba(208,90,61,0.4)"
                    strokeWidth="4"
                  />
                </svg>
              </div>
            </OverlayView>
          </GoogleMap>
          <div
            className="absolute right-3 top-3 z-10 flex overflow-hidden rounded-md border border-border backdrop-blur-sm"
            role="group"
            aria-label="Map type"
          >
            {mapTypeButtons.map((b, i) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setMapType(b.id)}
                className={`max-md:min-h-touch px-2.5 py-1.5 font-mono text-[10px] font-medium uppercase tracking-wider transition-colors ${
                  i > 0 ? "border-l border-border" : ""
                } ${
                  mapType === b.id
                    ? "bg-amber text-bg"
                    : "bg-[color-mix(in_oklab,var(--bg)_85%,transparent)] text-text-2 hover:text-text-1"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
