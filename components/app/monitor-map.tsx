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

function smoothPath(
  points: { lat: number; lng: number }[],
  segments = 8
): { lat: number; lng: number }[] {
  if (points.length < 3) return points;
  const result: { lat: number; lng: number }[] = [];
  const pts = [points[0], ...points, points[points.length - 1]];

  for (let i = 0; i < pts.length - 3; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const p2 = pts[i + 2];
    const p3 = pts[i + 3];
    for (let t = 0; t < segments; t++) {
      const s = t / segments;
      const s2 = s * s;
      const s3 = s2 * s;
      const lat =
        0.5 *
        (2 * p1.lat +
          (-p0.lat + p2.lat) * s +
          (2 * p0.lat - 5 * p1.lat + 4 * p2.lat - p3.lat) * s2 +
          (-p0.lat + 3 * p1.lat - 3 * p2.lat + p3.lat) * s3);
      const lng =
        0.5 *
        (2 * p1.lng +
          (-p0.lng + p2.lng) * s +
          (2 * p0.lng - 5 * p1.lng + 4 * p2.lng - p3.lng) * s2 +
          (-p0.lng + 3 * p1.lng - 3 * p2.lng + p3.lng) * s3);
      result.push({ lat, lng });
    }
  }
  return result;
}

function scalePolygon(
  points: { lat: number; lng: number }[],
  factor: number
): { lat: number; lng: number }[] {
  if (points.length === 0) return points;
  const centroid = points.reduce(
    (acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
    { lat: 0, lng: 0 }
  );
  centroid.lat /= points.length;
  centroid.lng /= points.length;
  return points.map((p) => ({
    lat: centroid.lat + (p.lat - centroid.lat) * factor,
    lng: centroid.lng + (p.lng - centroid.lng) * factor,
  }));
}

function forecastDotDataUri() {
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" fill="#E8A76F" opacity="0.7" stroke="#C78251" stroke-width="1"/></svg>`
  );
  return `data:image/svg+xml;charset=UTF-8,${svg}`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- retained for external/icon URL references
function stormIconDataUri() {
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="10" fill="#D05A3D" stroke="rgba(208,90,61,0.4)" stroke-width="4"/></svg>`
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

  const routeColor =
    meta?.urgency === "high" ? "#D05A3D" : "#60A5FA";

  const coneBase = coneColors(disaster?.category);

  const smoothedCone = useMemo(() => smoothPath(mapConePath, 8), []);
  const innerCone = useMemo(() => scalePolygon(smoothedCone, 0.7), [smoothedCone]);
  const outerCone = useMemo(() => scalePolygon(smoothedCone, 1.15), [smoothedCone]);

  const forecastDots = useMemo(() => {
    if (mapConePath.length < 3) return [];
    const stormPos = animatedStormPos;
    let narrowIdx = 0;
    let narrowDist = Infinity;
    mapConePath.forEach((p, i) => {
      const d = (p.lat - stormPos.lat) ** 2 + (p.lng - stormPos.lng) ** 2;
      if (d < narrowDist) {
        narrowDist = d;
        narrowIdx = i;
      }
    });
    const narrow = mapConePath[narrowIdx];
    const byDist = mapConePath
      .map((p) => ({
        p,
        d: (p.lat - narrow.lat) ** 2 + (p.lng - narrow.lng) ** 2,
      }))
      .sort((a, b) => b.d - a.d)
      .slice(0, 3);
    const wide = {
      lat: byDist.reduce((a, x) => a + x.p.lat, 0) / byDist.length,
      lng: byDist.reduce((a, x) => a + x.p.lng, 0) / byDist.length,
    };
    const pcts = [0.2, 0.4, 0.6, 0.8, 0.95];
    return pcts.map((t) => ({
      lat: narrow.lat + (wide.lat - narrow.lat) * t,
      lng: narrow.lng + (wide.lng - narrow.lng) * t,
    }));
  }, [animatedStormPos]);

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
    // String IDs are valid MapOptions values and work when `MapTypeId` is not
    // on `google.maps` yet (brief window after `useJsApiLoader` reports loaded).
    const mapTypeId: google.maps.MapTypeId | string =
      mapType === "satellite"
        ? "satellite"
        : mapType === "hybrid"
          ? "hybrid"
          : "roadmap";
    if (typeof google === "undefined" || !google.maps) {
      return { ...base, mapTypeId, styles: mapDarkStyles };
    }
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
          width: 32px;
          height: 32px;
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
            <div className="absolute left-3 top-3 z-10 rounded-md border border-border bg-[color-mix(in_oklab,var(--bg)_85%,transparent)] px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-text-1 backdrop-blur-sm">
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
              paths={outerCone}
              options={{
                fillColor: coneBase.fill,
                fillOpacity: 0.08 + (conePulse ? 0.06 : 0),
                strokeColor: coneBase.stroke,
                strokeOpacity: 0.15,
                strokeWeight: 1,
                clickable: false,
                zIndex: 1,
              }}
            />
            <Polygon
              paths={smoothedCone}
              options={{
                fillColor: coneBase.fill,
                fillOpacity: coneBase.fillOpacity + (conePulse ? 0.1 : 0),
                strokeColor: coneBase.stroke,
                strokeOpacity: 0.5,
                strokeWeight: 1.5,
                clickable: false,
                zIndex: 2,
              }}
            />
            <Polygon
              paths={innerCone}
              options={{
                fillColor: coneBase.fill,
                fillOpacity: 0.35 + (conePulse ? 0.1 : 0),
                strokeColor: coneBase.stroke,
                strokeOpacity: 0.7,
                strokeWeight: 1.5,
                clickable: false,
                zIndex: 3,
              }}
            />
            {stormActive &&
              forecastDots.map((pos, i) => (
                <Marker
                  key={`forecast-${i}`}
                  position={pos}
                  icon={{
                    url: forecastDotDataUri(),
                    scaledSize: new google.maps.Size(8, 8),
                    anchor: new google.maps.Point(4, 4),
                  }}
                  clickable={false}
                  zIndex={4}
                />
              ))}
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
              <div className="storm-spin pointer-events-none" aria-hidden>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="16"
                    cy="16"
                    r="15"
                    fill="none"
                    stroke="rgba(208,90,61,0.12)"
                    strokeWidth="2"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="13"
                    fill="none"
                    stroke="rgba(208,90,61,0.35)"
                    strokeWidth="4"
                  />
                  <circle cx="16" cy="16" r="10" fill="#D05A3D" />
                  <path
                    d="M 16 16 Q 22 14 22 8"
                    stroke="#7A2418"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.55"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 16 16 Q 10 18 10 24"
                    stroke="#7A2418"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.55"
                    strokeLinecap="round"
                  />
                  <circle cx="16" cy="16" r="1.8" fill="#2A0F08" />
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
                className={`max-md:min-h-touch px-2.5 py-1.5 font-mono text-[10px] font-[750] uppercase tracking-wider transition-colors ${
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
