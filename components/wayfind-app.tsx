"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import mapboxgl from "mapbox-gl";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  CornerUpLeft,
  CornerUpRight,
  Flag,
  MapPin,
  Minus,
  Plus,
} from "lucide-react";
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const BORDER_SUBTLE = "color-mix(in oklab, var(--text-1) 7%, transparent)";
const MAP_ROUTE_LINE = "#3fb579";
const MAP_MARKER_END = "#e8ecef";

const stitchDataUrl: string = (() => {
  const parts: string[] = [];
  const line5 = (x0: number, y0: number, x1: number, y1: number) => {
    for (let i = 1; i <= 5; i += 1) {
      const t = i / 6;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + (y1 - y0) * t;
      const ang = Math.atan2(y1 - y0, x1 - x0);
      const deg = (ang * 180) / Math.PI;
      parts.push(
        `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${deg.toFixed(2)})"><rect x="-1" y="-2" width="2" height="4" fill="rgba(58,58,64,0.06)"/></g>`,
      );
    }
  };
  line5(24, 6, 8, 22);
  line5(24, 6, 40, 22);
  line5(8, 22, 40, 22);
  line5(8, 22, 24, 42);
  line5(40, 22, 24, 42);
  const inner = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">${parts.join("")}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(inner)}")`;
})();

const pageStitch: CSSProperties = {
  backgroundColor: "var(--bg)",
  backgroundImage: stitchDataUrl,
  backgroundSize: "48px 48px",
};

const liquidHoverParent =
  "hover:[background:linear-gradient(to_bottom,rgba(255,255,255,0.138),rgba(255,255,255,0.023))]";

function LiquidGlassFrame({
  children,
  className,
  style,
  hoverBorderBrighten = false,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  hoverBorderBrighten?: boolean;
}) {
  return (
    <div
      className={`p-[1.5px] ${hoverBorderBrighten ? `group/liquid ${liquidHoverParent}` : ""} ${className ?? ""}`}
      style={{
        background:
          "linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.02))",
        ...style,
      }}
    >
      <div
        className={`h-full w-full backdrop-blur-md backdrop-saturate-150 ${hoverBorderBrighten ? "group-hover/liquid:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" : ""}`}
        style={{
          background: "var(--bg)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

type DirStep = {
  id: string;
  icon: typeof ArrowUp;
  instruction: string;
  distance: string;
};

const TURN_STEPS: DirStep[] = [
  {
    id: "1",
    icon: ArrowUp,
    instruction: "Head north on Mission St toward 25th St",
    distance: "0.3 mi",
  },
  {
    id: "2",
    icon: CornerUpLeft,
    instruction: "Turn left onto Valencia St, toward Market",
    distance: "0.6 mi",
  },
  {
    id: "3",
    icon: ArrowRight,
    instruction: "Slight right to stay on Valencia St as it becomes Duboce Ave",
    distance: "0.4 mi",
  },
  {
    id: "4",
    icon: CornerUpLeft,
    instruction: "Turn left onto Market St, toward the Embarcadero",
    distance: "1.1 mi",
  },
  {
    id: "5",
    icon: Minus,
    instruction: "Continue straight on Market, passing 9th, 8th, 7th, 6th",
    distance: "0.5 mi",
  },
  {
    id: "6",
    icon: ArrowUp,
    instruction: "Keep in the right lanes near Montgomery St; watch for the bike buffer",
    distance: "0.3 mi",
  },
  {
    id: "7",
    icon: CornerUpRight,
    instruction: "At Embarcadero, take the right turn bay toward the Ferry",
    distance: "0.4 mi",
  },
  {
    id: "8",
    icon: CornerUpLeft,
    instruction: "Turn left at Steuart St, following signs for Ferry Plaza",
    distance: "0.2 mi",
  },
  {
    id: "9",
    icon: ArrowRight,
    instruction: "Merge into the short queue lane for the Ferry Building circle",
    distance: "500 ft",
  },
  {
    id: "10",
    icon: CornerUpLeft,
    instruction: "At the drop-off, bear left to the public parking entrance (if no parking, continue to the curb near Gate B)",
    distance: "300 ft",
  },
  {
    id: "11",
    icon: MapPin,
    instruction: "Arrive: Ferry Building, One Embarcadero",
    distance: "—",
  },
];

const ROUTE_GEO: GeoJSON.Feature<GeoJSON.LineString> = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "LineString",
    coordinates: [
      [-122.40945, 37.75385],
      [-122.40925, 37.75455],
      [-122.40902, 37.75512],
      [-122.40955, 37.75535],
      [-122.40995, 37.75495],
      [-122.41075, 37.75475],
      [-122.4145, 37.76045],
      [-122.41485, 37.76095],
      [-122.41455, 37.762],
      [-122.40112, 37.78945],
      [-122.40055, 37.79],
      [-122.40035, 37.79025],
      [-122.39905, 37.79005],
      [-122.39855, 37.78985],
      [-122.39835, 37.79],
      [-122.39565, 37.796],
      [-122.39545, 37.79615],
    ],
  },
};

const MAP_CENTER: [number, number] = [-122.404, 37.777];

type ChatMessage = { id: string; role: "user" | "assistant"; text: string };

const SEED_CHAT: ChatMessage[] = [
  {
    id: "s1",
    role: "user",
    text: "Is 5th St still a mess near Market, or is it back to one lane each way this morning?",
  },
  {
    id: "s2",
    role: "assistant",
    text: "CivicCenterSF flags two blocks of lane shifts on 5th between Market and Mission for utility work, but the posted delay is about three minutes, not a full closure. If you are already on Market eastbound, stay right before Montgomery and you will miss most of the weave.",
  },
  {
    id: "s3",
    role: "user",
    text: "Add a two-minute detour to grab coffee—somewhere on Mission before I get onto Market.",
  },
  {
    id: "s4",
    role: "assistant",
    text: "Sure. A quick stop at Ritual on Valencia (between 21st and 22nd) adds roughly four minutes to your trip time, including the left back onto Mission. I will keep the Embarcadero arrival window at 7:12 if you are rolling in the next two minutes from your current point.",
  },
  {
    id: "s5",
    role: "user",
    text: "What is my ETA to the Ferry if I leave in five minutes, assuming typical Tuesday traffic on Market?",
  },
  {
    id: "s6",
    role: "assistant",
    text: "With a five-minute start delay, expect about 26 minutes to the One Embarcadero drop-off, including the usual hold at Montgomery and a short queue near the pier gate. I will nudge the route if I see a spike on the bridge approach.",
  },
];

function PrimaryButton({
  onClick,
  className = "",
  children,
}: {
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98, transition: { duration: 0.08, ease: "easeOut" } }}
      className={`relative w-full min-h-[44px] rounded-lg ${className}`}
    >
      <LiquidGlassFrame className="rounded-lg overflow-hidden" hoverBorderBrighten>
        <div className="flex h-full w-full min-h-[44px] items-center justify-center gap-2 px-4 py-2.5 text-[15px] font-medium text-text-1">
          {children}
        </div>
      </LiquidGlassFrame>
    </motion.button>
  );
}

export default function App() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const [from, setFrom] = useState("1145 Mission St");
  const [to, setTo] = useState("Ferry Building");
  const [chatExpanded, setChatExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_CHAT);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 2000);
  }, []);

  useEffect(() => {
    mapboxgl.accessToken = "YOUR_MAPBOX_TOKEN";
    if (!mapContainerRef.current) return;

    const line = ROUTE_GEO;
    const bounds = new mapboxgl.LngLatBounds(
      line.geometry.coordinates[0] as [number, number],
      line.geometry.coordinates[0] as [number, number],
    );
    for (const c of line.geometry.coordinates) {
      bounds.extend(c as [number, number]);
    }
    const padding = 80;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: MAP_CENTER,
      zoom: 12.2,
    });

    map.on("load", () => {
      map.addSource("route", { type: "geojson", data: line });
      map.addLayer({
        id: "route-glow",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": MAP_ROUTE_LINE,
          "line-width": 9,
          "line-opacity": 0.2,
          "line-blur": 2,
        },
      });
      map.addLayer({
        id: "route-core",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": MAP_ROUTE_LINE, "line-width": 4, "line-opacity": 1 },
      });

      const start = line.geometry.coordinates[0] as [number, number];
      const end = line.geometry.coordinates[
        line.geometry.coordinates.length - 1
      ] as [number, number];

      new mapboxgl.Marker({ color: MAP_ROUTE_LINE })
        .setLngLat(start)
        .addTo(map);
      new mapboxgl.Marker({ color: MAP_MARKER_END })
        .setLngLat(end)
        .addTo(map);

      map.fitBounds(bounds, { padding, duration: 0 });
    });

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!chatRef.current) return;
      if (!chatExpanded) return;
      if (e.target instanceof Node && !chatRef.current.contains(e.target)) {
        setChatExpanded(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [chatExpanded]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setChatExpanded(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const send = () => {
    const t = input.trim();
    if (!t) return;
    setMessages((m) => [
      ...m,
      { id: `u${Date.now()}`, role: "user", text: t },
      {
        id: `a${Date.now()}`,
        role: "assistant",
        text: "I will keep this route pinned to the Ferry Building. If the Embarcadero gets busy near Pier 1, the next suggested cut is a right on Howard and back up Steuart, which adds about two minutes but avoids the circle queue.",
      },
    ]);
    setInput("");
  };

  return (
    <div
      className="min-h-dvh w-full overflow-hidden font-sans antialiased"
      style={{ color: "var(--text-1)", ...pageStitch }}
    >
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-40">
        <div className="pointer-events-auto">
          <LiquidGlassFrame className="w-full min-w-0">
            <div
              className="flex h-14 w-full min-w-0 items-center justify-between pl-4 pr-4"
              style={{ minHeight: 56 }}
            >
              <span
                className="text-[18px] font-semibold"
                style={{ color: "var(--text-1)" }}
              >
                Wayfind
              </span>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium"
                  style={{ background: "var(--surface-2)", color: "var(--text-1)" }}
                >
                  MC
                </div>
                <motion.button
                  type="button"
                  onClick={() => showToast("Preparing a new trip…")}
                  whileTap={{
                    scale: 0.98,
                    transition: { duration: 0.08, ease: "easeOut" },
                  }}
                  className="shrink-0"
                >
                  <LiquidGlassFrame
                    className="inline-block min-w-0 overflow-hidden rounded-lg"
                    hoverBorderBrighten
                  >
                    <span className="inline-flex h-9 items-center gap-2 px-3 text-sm font-medium text-text-1">
                      <Plus className="h-4 w-4" strokeWidth={2} />
                      New trip
                    </span>
                  </LiquidGlassFrame>
                </motion.button>
              </div>
            </div>
          </LiquidGlassFrame>
        </div>
      </div>

      <div
        ref={mapContainerRef}
        className="fixed left-0 right-0 z-0"
        style={{
          top: 56,
          bottom: 0,
          minHeight: 400,
        }}
      />

      <aside
        className="pointer-events-auto fixed z-10 box-border flex w-[360px] flex-col overflow-hidden rounded-xl border border-border"
        style={{
          left: 16,
          top: 72,
          bottom: 16,
          backgroundColor: "var(--surface)",
          backgroundImage: stitchDataUrl,
          backgroundSize: "48px 48px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
        }}
      >
        <div className="shrink-0 border-b p-4" style={{ borderColor: BORDER_SUBTLE }}>
          <h1 className="mb-3 text-lg font-semibold" style={{ color: "var(--text-1)" }}>
            Directions
          </h1>
          <div className="space-y-2">
            <div
              className="flex items-center gap-2 rounded-lg border px-3 py-2"
              style={{ borderColor: BORDER_SUBTLE, background: "var(--bg)" }}
            >
              <MapPin
                className="h-4 w-4 shrink-0"
                style={{ color: "var(--text-2)" }}
              />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                style={{ color: "var(--text-1)" }}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                aria-label="From"
              />
            </div>
            <div
              className="flex items-center gap-2 rounded-lg border px-3 py-2"
              style={{ borderColor: BORDER_SUBTLE, background: "var(--bg)" }}
            >
              <Flag
                className="h-4 w-4 shrink-0"
                style={{ color: "var(--text-2)" }}
              />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                style={{ color: "var(--text-1)" }}
                value={to}
                onChange={(e) => setTo(e.target.value)}
                aria-label="To"
              />
            </div>
          </div>
        </div>
        <div
          className="min-h-0 flex-1 overflow-y-auto"
          style={{
            backgroundColor: "var(--surface)",
            backgroundImage: stitchDataUrl,
            backgroundSize: "48px 48px",
          }}
        >
          <ol className="py-0">
            {TURN_STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <li
                  key={s.id}
                  className="border-b"
                  style={{ borderColor: BORDER_SUBTLE }}
                >
                  <div className="flex gap-3 px-4 py-3">
                    <div className="flex w-7 shrink-0 flex-col items-center gap-0.5 pt-0.5 text-[11px] font-medium" style={{ color: "var(--text-2)" }}>
                      {i + 1}
                    </div>
                    <Icon
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{ color: "var(--text-2)" }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-snug" style={{ color: "var(--text-1)" }}>
                        {s.instruction}
                      </p>
                      <p
                        className="mt-1 text-xs"
                        style={{ color: "var(--text-2)" }}
                      >
                        {s.distance}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
        <div
          className="shrink-0 space-y-3 border-t p-4"
          style={{ borderColor: BORDER_SUBTLE, background: "var(--bg)", backgroundImage: stitchDataUrl, backgroundSize: "48px 48px" }}
        >
          <div
            className="flex items-baseline justify-between text-sm"
            style={{ color: "var(--text-1)" }}
          >
            <span className="font-medium">24 min</span>
            <span style={{ color: "var(--text-2)" }}>3.2 mi</span>
          </div>
          <PrimaryButton
            onClick={() => showToast("Starting navigation…")}
            className="block w-full"
          >
            Start
          </PrimaryButton>
        </div>
      </aside>

      <div
        ref={chatRef}
        className="fixed z-20 box-border w-[min(560px,calc(100vw-32px))] max-w-[min(560px,calc(100vw-32px))]"
        style={{
          bottom: 24,
          left: "max(16px, min(max(400px, calc(50% - 280px)), calc(100vw - 592px)))",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <motion.div
          className="overflow-hidden"
          initial={false}
          animate={{ height: chatExpanded ? 480 : 56 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <LiquidGlassFrame
            className="h-full w-full min-h-[56px] max-h-[480px] overflow-hidden rounded-2xl"
            hoverBorderBrighten
          >
            <div
              className="flex h-full min-h-0 max-h-full flex-col"
              onFocusCapture={() => setChatExpanded(true)}
            >
              <div
                className={`min-h-0 flex-1 overflow-y-auto ${chatExpanded ? "block" : "hidden"}`}
                style={{
                  backgroundColor: "var(--surface)",
                  backgroundImage: stitchDataUrl,
                  backgroundSize: "48px 48px",
                }}
              >
                <div className="space-y-3 p-3 pt-2">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`max-w-[92%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                        m.role === "user" ? "ml-auto border" : "mr-auto"
                      }`}
                      style={
                        m.role === "user"
                          ? {
                              background: "var(--surface-2)",
                              borderColor: BORDER_SUBTLE,
                              color: "var(--text-1)",
                            }
                          : {
                              background: "var(--surface)",
                              border: `1px solid ${BORDER_SUBTLE}`,
                              color: "var(--text-1)",
                            }
                      }
                    >
                      {m.text}
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="shrink-0 p-2"
                style={{ background: "var(--bg)" }}
              >
                <div
                  className="flex items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2"
                >
                  <input
                    ref={inputRef}
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                    style={{ color: "var(--text-1)" }}
                    placeholder="Ask about your route…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onFocus={() => setChatExpanded(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") send();
                    }}
                  />
                  {chatExpanded ? (
                    <motion.button
                      type="button"
                      onClick={send}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
                      style={{ borderColor: BORDER_SUBTLE, background: "var(--surface)" }}
                      aria-label="Send"
                      whileTap={{ scale: 0.98, transition: { duration: 0.08, ease: "easeOut" } }}
                    >
                      <ArrowUp className="h-4 w-4" style={{ color: "var(--text-1)" }} />
                    </motion.button>
                  ) : null}
                </div>
              </div>
            </div>
          </LiquidGlassFrame>
        </motion.div>
      </div>

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none fixed bottom-20 left-1/2 z-[100] -translate-x-1/2 rounded-lg border px-4 py-2 text-sm"
            style={{
              background: "var(--surface)",
              borderColor: BORDER_SUBTLE,
              color: "var(--text-1)",
            }}
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
