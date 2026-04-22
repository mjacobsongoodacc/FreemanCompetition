// Direction C — "Signal"
// Dark ops console, now with centered typographic hero and tweakable fonts/accents.

const cBg    = "#0a0d10";
const cBg2   = "#10151b";
const cInk   = "#e8ecef";
const cInk2  = "#a6b0ba";
const cInk3  = "#5a6570";
const cRule  = "#1e262f";
const cAlert = "#d05a3d";

// ── Tweakable defaults (font + accent presets) ─────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "fontPreset": "grotesk",
  "accentPreset": "emerald",
  "subheadColor": "ink",
  "stormPalette": "classic"
}/*EDITMODE-END*/;

const STORM_PALETTES = {
  classic:  { label: "Classic red",       path: "#d0583b", pathGlow: "rgba(255,210,180,0.45)", storm: "#f5eadd", stormInner: "#e8a76f", eye: "#0a0e14", dot: "#ffd8c2" },
  crimson:  { label: "Crimson & ivory",  path: "#c43545", pathGlow: "rgba(255,200,200,0.4)",  storm: "#f8f3e8", stormInner: "#d8667a", eye: "#0a0e14", dot: "#ffe0d8" },
  amber:    { label: "Amber & bone",     path: "#e8a76f", pathGlow: "rgba(255,220,180,0.45)", storm: "#f2e4c7", stormInner: "#c78251", eye: "#0a0e14", dot: "#f4e0c8" },
  cyan:     { label: "Cyan & cloud",     path: "#4fb4c4", pathGlow: "rgba(180,230,240,0.45)", storm: "#eaf6fa", stormInner: "#6ec7d4", eye: "#0a1418", dot: "#cfeef5" },
  violet:   { label: "Violet & pearl",   path: "#9d7be0", pathGlow: "rgba(220,200,240,0.45)", storm: "#f0ecf8", stormInner: "#a68ee8", eye: "#0c0e18", dot: "#e5dcf5" },
  emerald:  { label: "Emerald & cloud",  path: "#3fb579", pathGlow: "rgba(190,235,210,0.45)", storm: "#eaf7ee", stormInner: "#5ac08a", eye: "#0a1412", dot: "#d3edde" },
  lemon:    { label: "Lemon & slate",    path: "#d4b447", pathGlow: "rgba(240,225,170,0.45)", storm: "#f5ecc8", stormInner: "#b89535", eye: "#0e120a", dot: "#ecd98a" },
  hotpink:  { label: "Hot pink & white", path: "#e8518b", pathGlow: "rgba(255,200,220,0.45)", storm: "#fdeef4", stormInner: "#f078a4", eye: "#140a10", dot: "#ffd2e0" },
  mono:     { label: "Mono / white",     path: "#e6e2d6", pathGlow: "rgba(230,220,200,0.4)",  storm: "#ffffff", stormInner: "#c9c4b5", eye: "#0a0d10", dot: "#f1ede3" },
};

const SUBHEAD_COLORS = {
  accent:  { label: "Accent (primary)",  get: (a) => a.primary },
  voice:   { label: "Voice (secondary)", get: (a) => a.voice },
  bone:    { label: "Bone / off-white",  get: ()  => "#e6d7b8" },
  ink:     { label: "Ink (text-1)",      get: ()  => cInk },
  muted:   { label: "Muted steel",       get: ()  => cInk2 },
  dim:     { label: "Dim graphite",      get: ()  => cInk3 },
  alert:   { label: "Alert red",         get: ()  => cAlert },
  amber:   { label: "Amber",              get: ()  => "#e8a76f" },
};

const FONT_PRESETS = {
  sourceSerif: { label: "Source Serif 4 + JetBrains Mono",  display: "'Source Serif 4', Georgia, serif",  mono: "'JetBrains Mono', monospace", heroWeight: 500, uiWeight: 600, googleImport: "Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400;1,8..60,500&family=JetBrains+Mono:wght@400;500;600;700" },
  ibmPlex:     { label: "IBM Plex Serif + IBM Plex Mono",    display: "'IBM Plex Serif', Georgia, serif",   mono: "'IBM Plex Mono', monospace",  heroWeight: 500, uiWeight: 600, googleImport: "IBM+Plex+Serif:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=IBM+Plex+Mono:wght@400;500;600;700" },
  fraunces:    { label: "Fraunces + Space Mono",             display: "'Fraunces', Georgia, serif",         mono: "'Space Mono', monospace",     heroWeight: 600, uiWeight: 700, googleImport: "Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Space+Mono:wght@400;700" },
  ibmPlexSans: { label: "IBM Plex Sans (modernist)",          display: "'IBM Plex Sans', system-ui, sans",   mono: "'IBM Plex Mono', monospace",  heroWeight: 600, uiWeight: 700, googleImport: "IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700" },
  grotesk:     { label: "Space Grotesk + Space Mono",         display: "'Space Grotesk', system-ui, sans",   mono: "'Space Mono', monospace",     heroWeight: 600, uiWeight: 700, googleImport: "Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700" },
  instrument:  { label: "Instrument Serif + Geist Mono",      display: "'Instrument Serif', Georgia, serif", mono: "'Geist Mono', monospace",     heroWeight: 400, uiWeight: 600, googleImport: "Instrument+Serif:ital@0;1&family=Geist+Mono:wght@400;500;600;700" },
};

const ACCENT_PRESETS = {
  phosphor:   { label: "Phosphor cyan + Amber",   primary: "#5bd0c6", voice: "#e8a76f" },
  sage:       { label: "Sage + Amber",            primary: "#8ab8a4", voice: "#e8a76f" },
  emerald:    { label: "Emerald + Bone",          primary: "#3fb579", voice: "#e6d7b8" },
  mint:       { label: "Mint + Amber",            primary: "#6fd3a3", voice: "#e8a76f" },
  forest:     { label: "Forest + Ochre",          primary: "#4a9268", voice: "#d4a256" },
  ice:        { label: "Ice blue + Amber",        primary: "#7fb8e6", voice: "#e8a76f" },
  azure:      { label: "Azure + Sand",            primary: "#4a9fe6", voice: "#e6d7b8" },
  cobalt:     { label: "Cobalt + Amber",          primary: "#5e7fff", voice: "#e8a76f" },
  deepBlue:   { label: "Deep blue + Bone",        primary: "#3d6fc9", voice: "#e6d7b8" },
  steel:      { label: "Steel blue + Amber",      primary: "#6a9bc3", voice: "#e8a76f" },
  violet:     { label: "Violet + Amber",          primary: "#9b7ae8", voice: "#e8a76f" },
  rose:       { label: "Rose + Bone",             primary: "#e67fa5", voice: "#e6d7b8" },
};

function cUseTick(ms = 100) {
  const [, setT] = React.useState(0);
  React.useEffect(() => { const id = setInterval(() => setT(t => t+1), ms); return () => clearInterval(id); }, [ms]);
}

// ── Tweaks hook: listen for host toggle + live key updates ────────────────
function useTweaks() {
  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);
  const [editMode, setEditMode] = React.useState(false);
  React.useEffect(() => {
    const handler = (ev) => {
      const d = ev.data || {};
      if (d.type === "__activate_edit_mode")   setEditMode(true);
      if (d.type === "__deactivate_edit_mode") setEditMode(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);
  const setKey = React.useCallback((k, v) => {
    setTweaks(t => ({ ...t, [k]: v }));
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*");
  }, []);
  return { tweaks, editMode, setKey };
}

// ── Load google fonts for all presets once ─────────────────────────────────
function useGoogleFonts() {
  React.useEffect(() => {
    const families = Object.values(FONT_PRESETS).map(p => p.googleImport).join("&family=");
    const href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
    if (document.querySelector(`link[data-shprd-fonts]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet"; l.href = href; l.setAttribute("data-shprd-fonts", "1");
    document.head.appendChild(l);
  }, []);
}

// ── Hurricane Ida path map ─────────────────────────────────────────────────
// Satellite image of the Gulf with Ida's track and a spinning hurricane icon.
function RadarSweep({ accent, voice, storm }) {
  const ref = React.useRef(null);
  const imgRef = React.useRef(null);
  const [imgReady, setImgReady] = React.useState(false);
  const stormRef = React.useRef(storm);
  stormRef.current = storm;

  React.useEffect(() => {
    const img = new Image();
    img.src = "homepage/gulf-satellite.png";
    img.onload = () => { imgRef.current = img; setImgReady(true); };
  }, []);

  React.useEffect(() => {
    if (!imgReady) return;
    const el = ref.current; if (!el) return;
    const W = el.width, H = el.height;
    const ctx = el.getContext("2d");
    const img = imgRef.current;
    let raf, start = performance.now();

    // Calibrate using visible landmarks in the satellite image.
    // Image is 1884×1212 but we'll compute in normalized 0..1 coords so it scales to the canvas.
    // Landmarks I read off the image (approx normalized x, y):
    //   New Orleans label pin: (0.571, 0.161)   lon -90.07, lat 29.95
    //   Houston label:         (0.045, 0.178)   lon -95.37, lat 29.76
    //   Destin:                (0.895, 0.136)   lon -86.50, lat 30.39
    // Linear fit (lon vs nx, lat vs ny) gives roughly:
    //   lon(nx) = -95.62 + nx * 10.25
    //   lat(ny) = 31.60 - ny * 10.25    (aspect ~matches)
    // These are approximations tuned to the image so markers sit correctly.
    const LON0 = -95.62, LON_SPAN = 10.25;
    const LAT0 = 31.60,  LAT_SPAN = 10.25;
    const proj = (lon, lat) => {
      const nx = (lon - LON0) / LON_SPAN;
      const ny = (LAT0 - lat) / LAT_SPAN;
      return [nx * W, ny * H];
    };

    // Ida track (approx NHC best-track positions)
    const idaTrack = [
      [-85.8, 24.0],
      [-86.5, 24.8],
      [-87.2, 25.5],
      [-87.8, 26.1],
      [-88.3, 26.7],
      [-88.8, 27.3],
      [-89.2, 27.9],
      [-89.55, 28.45],
      [-89.85, 28.85],
      [-90.05, 29.05],
      [-90.20, 29.12], // landfall Port Fourchon
      [-90.40, 29.50], // Houma
      [-90.50, 29.85],
      [-90.45, 30.15], // LaPlace
      [-90.25, 30.40],
      [-89.95, 30.65],
    ];

    const cities = [
      { name: "PORT FOURCHON", lon: -90.20, lat: 29.12, r: 3.5, landfall: true },
    ];

    const samplePath = (pts, t) => {
      const segs = pts.length - 1;
      const f = Math.max(0, Math.min(segs - 0.001, t * segs));
      const i = Math.floor(f);
      const lt = f - i;
      const [ax,ay] = proj(pts[i][0], pts[i][1]);
      const [bx,by] = proj(pts[i+1][0], pts[i+1][1]);
      return [ax + (bx-ax)*lt, ay + (by-ay)*lt];
    };

    const smoothTrack = (pts, stroke, width) => {
      ctx.beginPath();
      const projPts = pts.map(p => proj(p[0], p[1]));
      ctx.moveTo(projPts[0][0], projPts[0][1]);
      for (let i=1; i<projPts.length-1; i++) {
        const [x1,y1] = projPts[i];
        const [x2,y2] = projPts[i+1];
        const xc = (x1+x2)/2, yc = (y1+y2)/2;
        ctx.quadraticCurveTo(x1, y1, xc, yc);
      }
      const last = projPts[projPts.length-1];
      ctx.lineTo(last[0], last[1]);
      ctx.strokeStyle = stroke; ctx.lineWidth = width;
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.stroke();
    };

    const draw = (tms) => {
      const dt = (tms - start) / 1000;

      // Draw the satellite image as the base — cover-fit into the canvas
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const canvasAspect = W / H;
      const imgAspect = iw / ih;
      let sx = 0, sy = 0, sW = iw, sH = ih;
      if (imgAspect > canvasAspect) {
        // image wider than canvas → crop horizontally
        sW = ih * canvasAspect;
        sx = (iw - sW) / 2;
      } else {
        sH = iw / canvasAspect;
        sy = (ih - sH) / 2;
      }
      ctx.drawImage(img, sx, sy, sW, sH, 0, 0, W, H);

      // Darken slightly for UI contrast
      ctx.fillStyle = "rgba(8, 14, 20, 0.18)";
      ctx.fillRect(0, 0, W, H);

      // Track — past portion solid, forecast portion dashed
      // past (solid)
      const sp = stormRef.current;
      smoothTrack(idaTrack, sp.pathGlow, 4.5);
      // overlay cleaner line in the palette color
      smoothTrack(idaTrack, sp.path, 2);

      // Advisory dots
      idaTrack.forEach(([lo, la]) => {
        const [x,y] = proj(lo, la);
        ctx.fillStyle = sp.dot;
        ctx.beginPath(); ctx.arc(x, y, 2.4, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = sp.path;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(x, y, 2.4, 0, Math.PI*2); ctx.stroke();
      });

      // Landfall marker
      cities.forEach(c => {
        const [x, y] = proj(c.lon, c.lat);
        if (c.landfall) {
          ctx.strokeStyle = sp.path;
          ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(x, y, 10 + Math.sin(dt*2)*2, 0, Math.PI*2); ctx.stroke();
          ctx.fillStyle = "#f1ede3";
          ctx.font = `700 10px "Space Mono", monospace`;
          ctx.textBaseline = "middle";
          ctx.textAlign = "left";
          // label with backing for legibility
          const label = c.name;
          const metrics = ctx.measureText(label);
          ctx.fillStyle = "rgba(10, 13, 16, 0.75)";
          ctx.fillRect(x + 12, y - 8, metrics.width + 8, 16);
          ctx.fillStyle = "#f1ede3";
          ctx.fillText(label, x + 16, y);
        }
      });

      // Spinning hurricane icon on track — cycle position along the Gulf portion
      const loopDur = 14;
      const tLoop = (dt % loopDur) / loopDur;
      // Restrict to Gulf approach (before landfall)
      const gulfEnd = 0.65; // stops at ~landfall
      const [hx, hy] = samplePath(idaTrack, tLoop * gulfEnd + 0.05);

      // Glow
      const glow = ctx.createRadialGradient(hx, hy, 4, hx, hy, 90);
      glow.addColorStop(0, sp.pathGlow);
      glow.addColorStop(0.5, sp.pathGlow.replace(/[\d.]+\)$/, "0.2)"));
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(hx, hy, 90, 0, Math.PI*2); ctx.fill();

      // ── Realistic hurricane ──────────────────────────────────────
      // A spinning cloud disc with multiple logarithmic-spiral arms,
      // speckled cloud texture, and a dark eye with eyewall ring.
      const rot = -dt * 0.9; // slower, more realistic rotation
      ctx.save();
      ctx.translate(hx, hy);
      ctx.rotate(rot);

      const discR = 48;

      // outer diffuse cloud body
      const body = ctx.createRadialGradient(0, 0, 4, 0, 0, discR);
      body.addColorStop(0, "rgba(0,0,0,0)");
      body.addColorStop(0.25, sp.stormInner + "cc");
      body.addColorStop(0.55, sp.storm + "dd");
      body.addColorStop(0.85, sp.storm + "55");
      body.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.arc(0, 0, discR, 0, Math.PI*2); ctx.fill();

      // spiral arms — logarithmic
      ctx.globalCompositeOperation = "lighter";
      const arms = 5;
      for (let a = 0; a < arms; a++) {
        ctx.beginPath();
        const phase = (a / arms) * Math.PI * 2;
        for (let k = 0; k <= 80; k++) {
          const p = k / 80;
          const ang = phase + p * Math.PI * 2.2;
          const r = 4 + Math.exp(p * 2.6) * 1.8; // log-spiral radius
          if (r > discR) break;
          const x = Math.cos(ang) * r;
          const y = Math.sin(ang) * r;
          if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = sp.storm + "d8";
        ctx.lineWidth = 3.6;
        ctx.lineCap = "round";
        ctx.shadowColor = sp.storm;
        ctx.shadowBlur = 6;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = "source-over";

      // wispy outer arms
      for (let a = 0; a < arms; a++) {
        ctx.beginPath();
        const phase = (a / arms) * Math.PI * 2 + 0.3;
        for (let k = 0; k <= 60; k++) {
          const p = k / 60;
          const ang = phase + p * Math.PI * 1.9;
          const r = 20 + Math.exp(p * 1.6) * 4;
          if (r > discR * 1.15) break;
          const x = Math.cos(ang) * r;
          const y = Math.sin(ang) * r;
          if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = sp.storm + "55";
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      // cloud speckle — deterministic-ish using a seeded small PRNG
      const speckles = 120;
      for (let i = 0; i < speckles; i++) {
        const seed = i * 13.37;
        const ang = (seed * 0.618) % (Math.PI * 2);
        const r = ((seed * 7.77) % (discR - 6)) + 6;
        const x = Math.cos(ang) * r;
        const y = Math.sin(ang) * r;
        const size = 0.8 + ((seed * 3.3) % 1.6);
        ctx.fillStyle = sp.storm + "aa";
        ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill();
      }

      // eyewall ring (bright)
      ctx.strokeStyle = sp.storm;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = sp.storm;
      ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI*2); ctx.stroke();
      ctx.shadowBlur = 0;

      // dark eye
      const eyeGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 6);
      eyeGrad.addColorStop(0, sp.eye);
      eyeGrad.addColorStop(0.7, sp.eye);
      eyeGrad.addColorStop(1, sp.eye + "00");
      ctx.fillStyle = eyeGrad;
      ctx.beginPath(); ctx.arc(0, 0, 5.5, 0, Math.PI*2); ctx.fill();

      ctx.restore();

      // Header labels
      ctx.fillStyle = sp.path;
      ctx.font = `700 11px "Space Mono", monospace`;
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      const l1 = "HURRICANE IDA · AUG 2021";
      const l2 = "NOAA BEST-TRACK · LANDFALL PORT FOURCHON";
      ctx.fillStyle = "rgba(10, 14, 20, 0.6)";
      ctx.fillRect(14, 12, Math.max(ctx.measureText(l1).width, ctx.measureText(l2).width) + 14, 36);
      ctx.fillStyle = sp.path;
      ctx.fillText(l1, 20, 26);
      ctx.fillStyle = "rgba(230, 215, 184, 0.85)";
      ctx.font = `500 9px "Space Mono", monospace`;
      ctx.fillText(l2, 20, 42);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [imgReady]);

  return <canvas ref={ref} width={720} height={560} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ── Channel tape ───────────────────────────────────────────────────────────
function ChannelTape({ font, accent }) {
  const [rows, setRows] = React.useState(() => window.SHEPHERD.streams.map(() => Array.from({length:80}).map(()=>Math.random())));
  React.useEffect(() => { const id = setInterval(() => setRows(rs => rs.map(r => [...r.slice(1), Math.random()])), 260); return () => clearInterval(id); }, []);
  return (
    <div style={{ border: "1px solid "+cRule, background: cBg2 }}>
      {window.SHEPHERD.streams.map((s, i) => (
        <div key={s.key} style={{ display:"grid", gridTemplateColumns:"52px 110px 1fr 140px", alignItems:"center", padding:"16px 18px", borderBottom: i<4?"1px solid "+cRule:"none", gap: 16 }}>
          <span style={{ fontFamily: font.mono, fontSize: 11, color: accent.primary, letterSpacing:"0.14em", fontWeight: 600 }}>CH{s.n}</span>
          <div>
            <div style={{ fontFamily: font.display, fontSize: 22, color: cInk, letterSpacing:"-0.01em", fontWeight: font.heroWeight }}>{s.label}</div>
            <div style={{ fontFamily: font.mono, fontSize: 9, color: cInk3, letterSpacing:"0.18em", marginTop: 2, fontWeight: 500 }}>{s.key}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap: 1, height: 36 }}>
            {rows[i].map((v,k) => (
              <span key={k} style={{ flex: 1, height: `${8+v*28}px`, background: k>rows[i].length-10?accent.primary:`rgba(140,200,200,${0.2+v*0.6})`, transition:"height 240ms linear, background 240ms" }}/>
            ))}
          </div>
          <div style={{ fontFamily: font.mono, fontSize: 11, color: cInk2, textAlign: "right", fontWeight: 500 }}>{s.body}</div>
        </div>
      ))}
    </div>
  );
}

function AlertTicker({ font, accent }) {
  return (
    <div style={{ display:"flex", gap: 40, overflow:"hidden", whiteSpace:"nowrap", padding:"10px 0", borderTop:"1px solid "+cRule, borderBottom:"1px solid "+cRule, background: cBg2, fontFamily: font.mono, fontSize: 11, color: cInk2, letterSpacing:"0.06em", fontWeight: 500 }}>
      <div style={{ display:"flex", gap: 40, animation:"cTick 50s linear infinite", flexShrink: 0 }}>
        {[...window.SHEPHERD.alerts, ...window.SHEPHERD.alerts].map((a,i) => (
          <span key={i} style={{ display:"inline-flex", alignItems:"center", gap: 12 }}>
            <span style={{ display:"inline-block", width: 8, height: 8, borderRadius: 8, background: a.sev==="red"?cAlert:a.sev==="amber"?accent.voice:accent.primary }}/>
            <span style={{ color: cInk3 }}>{a.t}</span>
            <span style={{ color: accent.primary }}>{a.agency}</span>
            <span style={{ color: cInk }}>{a.body}</span>
            <span style={{ color: cRule }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Voice panel (moved under hero, font weight bumped) ─────────────────────
function VoicePanel({ font, accent }) {
  const [idx, setIdx] = React.useState(0);
  const [chars, setChars] = React.useState(0);
  const msgs = window.SHEPHERD.chat;
  React.useEffect(() => {
    const m = msgs[idx]; if (!m) return;
    const dur = m.role==="bot" ? Math.min(7000, m.body.length*22) : Math.min(2200, m.body.length*18);
    const start = performance.now();
    let raf;
    const step = (t) => {
      const p = Math.min(1, (t-start)/dur);
      setChars(Math.floor(p * m.body.length));
      if (p<1) raf = requestAnimationFrame(step);
      else setTimeout(() => { setIdx((idx+1)%msgs.length); setChars(0); }, 1400);
    };
    const pre = setTimeout(() => raf = requestAnimationFrame(step), 500);
    return () => { clearTimeout(pre); cancelAnimationFrame(raf); };
  }, [idx]);
  const show = msgs.slice(0, idx+1);
  return (
    <div style={{ border: "1px solid "+cRule, background: cBg2, padding:"22px 22px 18px", display:"flex", flexDirection:"column", gap: 18, height: "100%" }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontFamily: font.mono, fontSize: 11, color: cInk3, letterSpacing:"0.2em", fontWeight: font.uiWeight }}>
        <span style={{ color: accent.voice, display:"flex", alignItems:"center", gap: 8, fontWeight: font.uiWeight }}>
          <span style={{ width: 7, height: 7, borderRadius: 7, background: accent.voice, animation:"cBlink 1.2s infinite" }}/>
          COMPANION · VOICE CHANNEL
        </span>
        <span style={{ fontWeight: font.uiWeight }}>LIVE</span>
      </div>
      <div style={{ flex: 1, display:"flex", flexDirection:"column", gap: 14, overflow:"hidden" }}>
        {show.map((m,i) => {
          const isCurrent = i === show.length - 1;
          const text = isCurrent ? m.body.slice(0, chars) : m.body;
          const isBot = m.role === "bot";
          return (
            <div key={i} style={{ fontFamily: font.display, fontSize: 15, lineHeight: 1.55, color: isBot?cInk:cInk2, paddingLeft: 14, borderLeft: `2px solid ${isBot?accent.voice:cInk3}`, fontStyle: isBot?"normal":"italic", opacity: i===show.length-1?1:0.55 }}>
              <span style={{ display:"block", fontFamily: font.mono, fontSize: 10, letterSpacing:"0.2em", color: isBot?accent.voice:cInk3, marginBottom: 4, fontWeight: font.uiWeight }}>
                {isBot?"SHPRD":"SARAH"} · {m.time}
              </span>
              {text}
              {isCurrent && <span style={{ display:"inline-block", width: 7, height: 14, background: accent.voice, marginLeft: 3, verticalAlign:"-2px", animation:"cBlink 1s infinite" }}/>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tweaks panel (floating, bottom-right) ──────────────────────────────────
function TweaksPanel({ tweaks, setKey, font, accent }) {
  return (
    <div style={{
      position: "fixed", right: 20, bottom: 20, zIndex: 100,
      background: "#0e1318", border: "1px solid "+cRule, padding: 16, width: 300,
      fontFamily: font.mono, fontSize: 11, color: cInk2, letterSpacing: "0.04em",
      boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
    }}>
      <div style={{ fontWeight: 700, color: accent.primary, letterSpacing:"0.2em", marginBottom: 14, fontSize: 10 }}>TWEAKS</div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ color: cInk3, marginBottom: 6, fontSize: 9, letterSpacing:"0.18em" }}>FONT</div>
        <div style={{ display:"grid", gap: 4 }}>
          {Object.entries(FONT_PRESETS).map(([k, v]) => (
            <button key={k} onClick={() => setKey("fontPreset", k)} style={{
              background: tweaks.fontPreset===k?"#1a2129":"transparent",
              color: tweaks.fontPreset===k?cInk:cInk2,
              border: "1px solid "+(tweaks.fontPreset===k?accent.primary:cRule),
              padding: "7px 10px", textAlign:"left", cursor:"pointer",
              fontFamily: v.display, fontSize: 13, fontWeight: v.heroWeight,
            }}>{v.label}</button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ color: cInk3, marginBottom: 6, fontSize: 9, letterSpacing:"0.18em" }}>ACCENT</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: 4 }}>
          {Object.entries(ACCENT_PRESETS).map(([k,v]) => (
            <button key={k} onClick={() => setKey("accentPreset", k)} style={{
              background: tweaks.accentPreset===k?"#1a2129":"transparent",
              color: cInk, border: "1px solid "+(tweaks.accentPreset===k?v.primary:cRule),
              padding: "8px 10px", cursor:"pointer", textAlign:"left", fontSize: 10,
              display:"flex", flexDirection:"column", gap: 4,
            }}>
              <span style={{ display:"flex", gap: 4 }}>
                <span style={{ width: 12, height: 12, background: v.primary }}/>
                <span style={{ width: 12, height: 12, background: v.voice }}/>
              </span>
              <span style={{ color: cInk2 }}>{v.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <div style={{ color: cInk3, marginBottom: 6, fontSize: 9, letterSpacing:"0.18em" }}>SUBHEADING COLOR</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: 4 }}>
          {Object.entries(SUBHEAD_COLORS).map(([k,v]) => {
            const swatch = v.get(accent);
            return (
              <button key={k} onClick={() => setKey("subheadColor", k)} style={{
                background: tweaks.subheadColor===k?"#1a2129":"transparent",
                border: "1px solid "+(tweaks.subheadColor===k?swatch:cRule),
                padding: "8px 10px", cursor:"pointer", textAlign:"left", fontSize: 10,
                display:"flex", alignItems:"center", gap: 8,
              }}>
                <span style={{ width: 12, height: 12, background: swatch, flexShrink: 0 }}/>
                <span style={{ color: swatch, fontWeight: 700, letterSpacing:"0.14em" }}>{v.label.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
function VariantSignal() {
  cUseTick(1000);
  useGoogleFonts();
  const { tweaks, editMode, setKey } = useTweaks();
  const font = FONT_PRESETS[tweaks.fontPreset] || FONT_PRESETS.sourceSerif;
  const accent = ACCENT_PRESETS[tweaks.accentPreset] || ACCENT_PRESETS.phosphor;
  const stormPal = STORM_PALETTES[tweaks.stormPalette] || STORM_PALETTES.classic;
  const subColor = (SUBHEAD_COLORS[tweaks.subheadColor] || SUBHEAD_COLORS.accent).get(accent);

  return (
    <div style={{ width:"100%", minHeight:"100vh", background: cBg, color: cInk, fontFamily: font.display, overflowX:"hidden" }}>
      <style>{`
        @keyframes cBlink { 0%,50%{opacity:1} 51%,100%{opacity:0.2} }
        @keyframes cTick { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .c-link { color: ${cInk2}; cursor: pointer; font-family: ${font.mono}; font-size: 11px; letter-spacing: 0.2em; font-weight: ${font.uiWeight}; }
        .c-link:hover { color: ${accent.primary}; }
        .c-grid-bg { background-image: linear-gradient(${cRule} 1px, transparent 1px), linear-gradient(90deg, ${cRule} 1px, transparent 1px); background-size: 48px 48px; }
      `}</style>

      {/* Mission bar — uplink + sys nominal removed */}
      <header style={{ display:"grid", gridTemplateColumns:"auto 1fr auto", alignItems:"center", padding:"14px 32px", borderBottom:"1px solid "+cRule, background: cBg2, gap: 32 }}>
        <div style={{ display:"flex", alignItems:"center", gap: 12 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" style={{ animation: "cOrbPulse 2.8s ease-in-out infinite" }}><circle cx="9" cy="9" r="4" fill="#3fb579"/><circle cx="9" cy="9" r="8" stroke="#3fb579" strokeWidth="1" fill="none" opacity="0.4"/></svg>
          <span style={{ fontFamily: font.display, fontSize: 20, letterSpacing: "0.02em", fontWeight: font.heroWeight }}>Shepherd</span>
          <span style={{ fontFamily: font.mono, fontSize: 12, color: subColor, letterSpacing:"0.22em", marginLeft: 8, fontWeight: font.uiWeight }}>OPS CONSOLE</span>
        </div>
        <div/>
        <div style={{ display:"flex", alignItems:"center", gap: 24 }}>
          <span className="c-link">WHAT IT IS</span>
          <span className="c-link">VOICE</span>
          <button style={{ background: accent.primary, color: cBg, border:"none", padding:"10px 18px", fontFamily: font.mono, fontSize: 11, letterSpacing:"0.22em", fontWeight: 700, cursor:"pointer" }}>ENTER THE DEMO →</button>
        </div>
      </header>

      {/* HERO — fully centered typographic */}
      <section style={{ padding:"96px 32px 72px", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap: 32 }}>
        <h1 style={{
          margin: 0, fontFamily: font.display,
          fontSize:"clamp(52px, 7vw, 108px)",
          fontWeight: font.heroWeight, lineHeight: 1.0, letterSpacing:"-0.02em",
          textWrap:"balance", maxWidth: "18ch",
        }}>
          When the plan breaks, Shepherd walks with you.
        </h1>
        <p style={{ margin: 0, fontSize: 20, lineHeight: 1.55, color: cInk2, maxWidth: "58ch", fontWeight: 400 }}>
          Five streams — plan, resources, location, the storm itself, the world outside your window — fused into one calm voice on the other end of the line.
        </p>
        <button style={{
          marginTop: 8, background: accent.primary, color: cBg, border:"none",
          padding:"20px 38px", fontFamily: font.mono, fontSize: 13,
          letterSpacing:"0.24em", fontWeight: 700, cursor:"pointer",
        }}>
          ENTER THE DEMO →
        </button>
        <div style={{ fontFamily: font.mono, fontSize: 12, color: subColor, letterSpacing:"0.22em", fontWeight: font.uiWeight }}>
          NO SIGNUP · FREE DURING ACTIVE ADVISORY
        </div>
      </section>

      {/* Mission panel */}
      <section style={{ padding:"72px 32px 96px", borderTop:"1px solid "+cRule, borderBottom:"1px solid "+cRule, background: cBg2, textAlign:"center", marginBottom: 72 }}>
        <div style={{ fontFamily: font.mono, fontSize: 12, color: subColor, letterSpacing:"0.3em", fontWeight: 700, marginBottom: 20 }}>
          MISSION
        </div>
        <h2 style={{
          margin: 0, fontFamily: font.display,
          fontSize:"clamp(44px, 6vw, 88px)",
          fontWeight: font.heroWeight, lineHeight: 1.02, letterSpacing:"-0.02em",
          textWrap:"balance", maxWidth: "22ch", marginLeft:"auto", marginRight:"auto",
        }}>
          Your disaster companion.
        </h2>
        <p style={{
          margin: "24px auto 0", fontFamily: font.display,
          fontSize: 22, lineHeight: 1.5, color: cInk2,
          fontWeight: 400, maxWidth: "46ch", textWrap: "balance", fontStyle: "italic",
        }}>
          Steady, personalized guidance for the moments your plan stops matching reality.
        </p>
      </section>

      {/* UNDER HERO: radar + voice channel side by side */}
      <section style={{ padding:"0 32px 56px", display:"grid", gridTemplateColumns:"1.15fr 1fr", gap: 32, alignItems:"stretch" }}>
        <div style={{ border: "1px solid "+cRule, background: cBg2, position:"relative", overflow:"hidden", minHeight: 560 }}>
          <div className="c-grid-bg" style={{ position:"absolute", inset: 0, opacity: 0.5 }}/>
          <div style={{ position:"absolute", inset: 0 }}>
            <RadarSweep accent={accent.primary} voice={accent.voice} storm={stormPal} />
          </div>
          <div style={{ position:"absolute", bottom: 14, left: 18, right: 18, display:"flex", justifyContent:"space-between", fontFamily: font.mono, fontSize: 10, color: cInk3, letterSpacing:"0.2em", fontWeight: font.uiWeight }}>
            <span>CAT 4 · 125 MPH / 155 G</span>
            <span>MVMT NNW 12 MPH</span>
            <span style={{ color: accent.voice }}>LANDFALL SUN 08:00</span>
          </div>
        </div>
        <div style={{ minHeight: 560 }}>
          <VoicePanel font={font} accent={accent} />
        </div>
      </section>

      <AlertTicker font={font} accent={accent} />

      {/* Channel tape */}
      <section style={{ padding:"56px 32px" }}>
        <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom: 22 }}>
          <div>
            <div style={{ fontFamily: font.mono, fontSize: 12, color: subColor, letterSpacing:"0.24em", fontWeight: 700 }}>CHANNELS</div>
            <h2 style={{ margin:"10px 0 0", fontFamily: font.display, fontSize: 42, fontWeight: font.heroWeight, letterSpacing:"-0.015em" }}>
              Five streams. <em style={{ color: accent.voice }}>One voice.</em>
            </h2>
          </div>
          <div style={{ fontFamily: font.mono, fontSize: 12, color: subColor, letterSpacing:"0.2em", fontWeight: font.uiWeight }}>
            SAMPLING 260ms · 5 OF 5 UP
          </div>
        </div>
        <ChannelTape font={font} accent={accent} />
      </section>

      {/* Not a planner */}
      <section style={{ padding:"56px 32px", borderTop:"1px solid "+cRule, background: cBg2 }}>
        <div style={{ display:"grid", gridTemplateColumns:"200px 1fr 1fr", gap: 48 }}>
          <div style={{ fontFamily: font.mono, fontSize: 12, color: subColor, letterSpacing:"0.24em", fontWeight: 700 }}>CHARACTER</div>
          <h2 style={{ margin: 0, fontFamily: font.display, fontSize: 44, fontWeight: font.heroWeight, lineHeight: 1.05, letterSpacing:"-0.015em" }}>
            Not a planner.<br/><em style={{ color: accent.voice }}>A companion.</em>
          </h2>
          <div style={{ fontSize: 16, lineHeight: 1.65, color: cInk2, display:"flex", flexDirection:"column", gap: 16 }}>
            <p style={{ margin: 0 }}>{window.SHEPHERD.manifesto.paragraphs[0]}</p>
            <p style={{ margin: 0 }}>{window.SHEPHERD.manifesto.paragraphs[1]}</p>
          </div>
        </div>
      </section>

      {/* States */}
      <section style={{ padding:"72px 32px", borderTop:"1px solid "+cRule }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.1fr", gap: 40, alignItems:"start" }}>
          <div>
            <div style={{ fontFamily: font.mono, fontSize: 12, color: subColor, letterSpacing:"0.24em", fontWeight: 700 }}>STATES</div>
            <h2 style={{ margin:"10px 0 0", fontFamily: font.display, fontSize: 48, fontWeight: font.heroWeight, lineHeight: 1.02, letterSpacing:"-0.015em" }}>
              Calm until<br/><em style={{ color: accent.voice }}>it can't be.</em>
            </h2>
            <p style={{ marginTop: 20, fontSize: 16, lineHeight: 1.6, color: cInk2, maxWidth:"40ch", fontStyle:"italic" }}>
              Most days: a single orb, breathing green. No storm, no feed. The product disappears until it's needed — then it arrives with your name, your tank, your mother's zip code, and a route that already accounts for the fuel line in Hammond.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: 14 }}>
            <div style={{ border:"1px solid "+cRule, background: cBg2, padding: 24, display:"flex", flexDirection:"column", alignItems:"center", minHeight: 320, justifyContent:"center", gap: 16 }}>
              <div style={{ fontFamily: font.mono, fontSize: 9, color: cInk3, letterSpacing:"0.22em", alignSelf:"stretch", display:"flex", justifyContent:"space-between", fontWeight: 600 }}>
                <span>STATE · CALM</span><span style={{ color: accent.primary }}>●</span>
              </div>
              <div style={{ width: 80, height: 80, borderRadius: 80, background: `radial-gradient(circle at 35% 30%, #9de0d5, ${accent.primary})`, boxShadow:`0 0 40px ${accent.primary}66`, animation:"cBreath 3s ease-in-out infinite" }}/>
              <div style={{ fontFamily: font.display, fontStyle:"italic", fontSize: 15, color: cInk2, textAlign:"center", maxWidth:"22ch" }}>No NHC events. Shepherd is listening.</div>
            </div>
            <div style={{ border:`1px solid ${accent.voice}`, background:`linear-gradient(to bottom, ${accent.voice}14, transparent)`, padding: 24, display:"flex", flexDirection:"column", minHeight: 320, gap: 10 }}>
              <div style={{ fontFamily: font.mono, fontSize: 9, color: accent.voice, letterSpacing:"0.22em", display:"flex", justifyContent:"space-between", fontWeight: 600 }}>
                <span>STATE · ACTIVE · T-36h</span><span style={{ animation:"cBlink 1s infinite" }}>●</span>
              </div>
              <div style={{ fontFamily: font.display, fontSize: 15, lineHeight: 1.5, color: cInk, paddingTop: 4 }}>
                <span style={{ fontFamily: font.mono, fontSize: 9, color: accent.voice, letterSpacing:"0.16em", fontWeight: 600 }}>SHPRD 23:16</span><br/>
                You leave today. Jackson — Hampton Inn, $89/night. Four nights is $356, leaves $644 buffer. I-10 West, then I-55 North. Leave by 2 PM when contraflow opens. Text your mom you're picking her up at 1.
              </div>
              <div style={{ marginTop:"auto", borderTop:"1px dashed "+cRule, paddingTop: 10, fontFamily: font.mono, fontSize: 9, color: cInk3, letterSpacing:"0.16em", fontWeight: 600 }}>
                FUEL 37% · CASH $844 · DEPENDENT MOM SLIDELL
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"96px 32px 48px", background:`radial-gradient(circle at 50% 0%, ${accent.voice}14, transparent 50%)`, borderTop:"1px solid "+cRule, textAlign:"center" }}>
        <div style={{ fontFamily: font.mono, fontSize: 12, color: subColor, letterSpacing:"0.24em", fontWeight: 700 }}>ENGAGE</div>
        <h2 style={{ margin:"24px auto 0", fontFamily: font.display, fontSize:"clamp(60px, 8vw, 120px)", fontWeight: font.heroWeight, lineHeight: 1, letterSpacing:"-0.02em", maxWidth:"14ch" }}>
          Meet <em style={{ color: accent.voice }}>Shepherd.</em>
        </h2>
        <button style={{ marginTop: 44, background: accent.voice, color: cBg, border:"none", padding:"18px 34px", fontFamily: font.mono, fontSize: 12, letterSpacing:"0.24em", fontWeight: 700, cursor:"pointer" }}>
          ENTER THE DEMO →
        </button>
        <div style={{ marginTop: 28, fontFamily: font.mono, fontSize: 12, color: subColor, letterSpacing:"0.22em", fontWeight: font.uiWeight }}>
          NO SIGNUP · FREE DURING ACTIVE ADVISORY
        </div>
      </section>

      <footer style={{ borderTop:"1px solid "+cRule, background: cBg2, padding:"16px 32px", display:"flex", justifyContent:"space-between", fontFamily: font.mono, fontSize: 12, color: subColor, letterSpacing:"0.2em", fontWeight: font.uiWeight }}>
        <span>SHEPHERD / OPS</span>
        <span>5/5 CHANNELS</span>
        <span>TULANE AI CHALLENGE · MMXXVI</span>
      </footer>

      <style>{`@keyframes cBreath { 0%,100% { transform: scale(1); opacity: 1 } 50% { transform: scale(1.05); opacity: 0.85 } }
        @keyframes cOrbPulse { 0%,100% { opacity: 1; transform: scale(1) } 50% { opacity: 0.82; transform: scale(1.06) } }`}</style>

      {editMode && <TweaksPanel tweaks={tweaks} setKey={setKey} font={font} accent={accent} />}
    </div>
  );
}

window.VariantSignal = VariantSignal;
