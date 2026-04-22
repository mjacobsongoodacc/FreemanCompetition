// Direction A — "Advisory"
// Aesthetic: NOAA advisory bulletin meets field guide. Warm paper palette,
// humanist serif (Source Serif 4) for prose, JetBrains Mono for coordinates
// and data. No rounded cards, no gradients, no emoji, no standard hero cta
// layout. Structure mimics an actual advisory document: header strip with
// live counters, a contour-line hurricane plot, columnar body, mono margin
// notes. The page IS the product's voice.

const aBrand = "#c14a2b";   // ink red — advisory
const aInk   = "#1a1714";
const aInk2  = "#4a433c";
const aInk3  = "#8a8078";
const aPaper = "#f3ede1";
const aPaper2= "#ebe3d2";
const aRule  = "#cdc2ac";

// Small helpers -------------------------------------------------------------

function useTick(ms = 1000) {
  const [, setT] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setT(t => t + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
}

function CountdownMono({ seconds }) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontVariantNumeric: "tabular-nums" }}>
      {d}D·{pad(h)}:{pad(m)}:{pad(s)}
    </span>
  );
}

// Contour-line hurricane plot ------------------------------------------------
// Concentric deformed rings around an eye — done with SVG, no libraries. The
// shape breathes slowly so the page feels live without being flashy.
function ContourStorm({ t }) {
  // t drives a tiny phase offset so rings feel alive
  const rings = [];
  for (let i = 0; i < 9; i++) {
    const r = 28 + i * 18;
    const points = [];
    const N = 64;
    for (let k = 0; k < N; k++) {
      const a = (k / N) * Math.PI * 2;
      const wobble = Math.sin(a * 3 + i * 0.7 + t * 0.0008) * (2 + i * 0.6)
                   + Math.cos(a * 5 - i * 0.4 + t * 0.0006) * (1.5 + i * 0.3);
      const rr = r + wobble;
      points.push([200 + rr * Math.cos(a), 200 + rr * Math.sin(a)]);
    }
    const d = "M" + points.map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join("L") + "Z";
    const isOuter = i >= 6;
    rings.push(
      <path key={i} d={d}
        fill="none"
        stroke={isOuter ? "rgba(26,23,20,0.22)" : "rgba(193,74,43,0.55)"}
        strokeWidth={isOuter ? 0.7 : 1}
      />
    );
  }
  // Eye + eyewall
  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%" style={{ display: "block" }}>
      <defs>
        <pattern id="paperGrain" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.3" fill="rgba(26,23,20,0.06)" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#paperGrain)" opacity="0.6" />

      {/* compass ticks */}
      {[0, 90, 180, 270].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 200 + 188 * Math.cos(rad);
        const y1 = 200 + 188 * Math.sin(rad);
        const x2 = 200 + 196 * Math.cos(rad);
        const y2 = 200 + 196 * Math.sin(rad);
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={aInk} strokeWidth="1.2" />;
      })}
      <text x="200" y="14" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill={aInk}>N</text>
      <text x="388" y="204" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill={aInk}>E</text>
      <text x="200" y="394" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill={aInk}>S</text>
      <text x="12"  y="204" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill={aInk}>W</text>

      {/* 1° grid */}
      {[0.25, 0.5, 0.75].map((f) => (
        <g key={f} stroke="rgba(26,23,20,0.08)" strokeDasharray="2 3">
          <line x1={f*400} y1="0" x2={f*400} y2="400" />
          <line x1="0" y1={f*400} x2="400" y2={f*400} />
        </g>
      ))}

      {rings}

      {/* eye */}
      <circle cx="200" cy="200" r="8" fill={aPaper} stroke={aBrand} strokeWidth="1.2" />
      <circle cx="200" cy="200" r="2.2" fill={aBrand} />

      {/* storm label */}
      <g transform="translate(212,196)">
        <line x1="0" y1="0" x2="28" y2="-14" stroke={aInk} strokeWidth="0.8" />
        <text x="32" y="-16" fontFamily="JetBrains Mono" fontSize="10" fill={aInk} fontWeight="600">IDA</text>
        <text x="32" y="-6" fontFamily="JetBrains Mono" fontSize="8" fill={aInk2}>27.8°N 88.2°W</text>
      </g>

      {/* landfall marker */}
      <g transform="translate(98,118)">
        <rect x="-2" y="-2" width="4" height="4" fill={aInk} />
        <line x1="2" y1="-2" x2="18" y2="-18" stroke={aInk} strokeWidth="0.8" />
        <text x="22" y="-18" fontFamily="JetBrains Mono" fontSize="9" fill={aInk}>LANDFALL</text>
        <text x="22" y="-8" fontFamily="JetBrains Mono" fontSize="8" fill={aInk2}>SUN 08:00 CDT</text>
      </g>

      {/* track dashed */}
      <path d="M 200 200 Q 160 160 128 128 T 98 118"
        fill="none" stroke={aInk} strokeWidth="0.9" strokeDasharray="3 3" />
    </svg>
  );
}

// Live ticker strip ---------------------------------------------------------
function AdvisoryStrip() {
  useTick(1000);
  const secondsToLandfall = Math.max(0, Math.floor((new Date("2026-04-26T13:00:00Z") - new Date()) / 1000));
  return (
    <div style={{
      borderTop: "1px solid " + aInk,
      borderBottom: "1px solid " + aInk,
      background: aPaper2,
      display: "grid",
      gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1fr 1fr",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 11,
      color: aInk,
    }}>
      {[
        ["ADVISORY", "№ 28 · 23:00 CDT"],
        ["STORM", "IDA · CAT 4"],
        ["WINDS", "125 MPH / 155 GUST"],
        ["PRESSURE", "949 MB"],
        ["MOVEMENT", "NNW 12 MPH"],
        ["LANDFALL IN", <CountdownMono key="c" seconds={secondsToLandfall} />],
      ].map(([k, v], i) => (
        <div key={i} style={{
          padding: "10px 16px",
          borderRight: i < 5 ? "1px solid " + aRule : "none",
          display: "flex", flexDirection: "column", gap: 2,
          minWidth: 0,
        }}>
          <span style={{ fontSize: 9, letterSpacing: "0.14em", color: aInk3 }}>{k}</span>
          <span style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

// Live chat widget ----------------------------------------------------------
function AdvisoryChat() {
  const [visible, setVisible] = React.useState(1);
  const [typing, setTyping] = React.useState(false);
  const msgs = window.SHEPHERD.chat;
  React.useEffect(() => {
    if (visible >= msgs.length) return;
    setTyping(true);
    const t1 = setTimeout(() => { setTyping(false); setVisible(v => v + 1); }, 2600);
    return () => clearTimeout(t1);
  }, [visible]);

  return (
    <div style={{
      background: aPaper,
      border: "1px solid " + aInk,
      padding: 0,
      fontFamily: "'Source Serif 4', Georgia, serif",
      color: aInk,
    }}>
      <div style={{
        padding: "10px 16px",
        borderBottom: "1px solid " + aInk,
        display: "flex", justifyContent: "space-between",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10, letterSpacing: "0.14em",
        background: aInk, color: aPaper,
      }}>
        <span>TRANSCRIPT · 23:15 CDT</span>
        <span>CHANNEL · COMPANION</span>
      </div>
      <div style={{ padding: "20px 20px 8px 20px", display: "flex", flexDirection: "column", gap: 18 }}>
        {msgs.slice(0, visible).map((m, i) => (
          <div key={i} style={{
            display: "grid",
            gridTemplateColumns: "64px 1fr",
            gap: 14,
            opacity: 0,
            animation: "aFade 420ms forwards",
            animationDelay: (i === visible - 1 ? 0 : 0) + "ms",
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: m.role === "bot" ? aBrand : aInk3,
              letterSpacing: "0.1em",
              paddingTop: 4,
            }}>
              {m.role === "bot" ? "SHPRD" : "SARAH"}<br/>
              <span style={{ color: aInk3 }}>{m.time}</span>
            </div>
            <div style={{
              fontSize: 15,
              lineHeight: 1.55,
              borderLeft: "1px solid " + (m.role === "bot" ? aBrand : aRule),
              paddingLeft: 14,
              color: m.role === "bot" ? aInk : aInk2,
              fontStyle: m.role === "user" ? "italic" : "normal",
            }}>
              {m.body}
            </div>
          </div>
        ))}
        {typing && visible < msgs.length && (
          <div style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: 14 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: aBrand, paddingTop: 4 }}>SHPRD<br/><span style={{ color: aInk3 }}>···</span></div>
            <div style={{ borderLeft: "1px solid " + aBrand, paddingLeft: 14, paddingTop: 4, display: "flex", gap: 4 }}>
              <Dot/><Dot delay={0.15}/><Dot delay={0.3}/>
            </div>
          </div>
        )}
      </div>
      <div style={{
        padding: "12px 20px",
        borderTop: "1px solid " + aRule,
        display: "flex",
        justifyContent: "space-between",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        color: aInk3,
        letterSpacing: "0.12em",
      }}>
        <span>END OF TRANSCRIPT EXCERPT</span>
        <span onClick={() => { setVisible(1); }} style={{ cursor: "pointer", color: aBrand, textDecoration: "underline" }}>REPLAY</span>
      </div>
    </div>
  );
}

function Dot({ delay = 0 }) {
  return <span style={{
    width: 5, height: 5, borderRadius: 5, background: aBrand,
    animation: "aBlink 1s infinite", animationDelay: delay + "s",
  }} />;
}

// Streams table ------------------------------------------------------------
function StreamsTable() {
  // Each row: number, name, what it monitors, and a tiny "live" sparkline-ish
  // row showing fake activity the way a serial port log would.
  const [ticks, setTicks] = React.useState(() => window.SHEPHERD.streams.map(() => Math.random()));
  React.useEffect(() => {
    const id = setInterval(() => {
      setTicks(t => t.map(() => Math.random()));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ borderTop: "1px solid " + aInk, borderBottom: "1px solid " + aInk, background: aPaper }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "60px 160px 1fr 180px",
        padding: "10px 20px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        letterSpacing: "0.14em",
        color: aInk3,
        borderBottom: "1px solid " + aRule,
      }}>
        <span>№</span><span>STREAM</span><span>SCOPE</span><span>SIGNAL</span>
      </div>
      {window.SHEPHERD.streams.map((s, i) => (
        <div key={s.n} style={{
          display: "grid",
          gridTemplateColumns: "60px 160px 1fr 180px",
          padding: "18px 20px",
          borderBottom: i < 4 ? "1px solid " + aRule : "none",
          alignItems: "center",
        }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: aBrand, fontWeight: 600 }}>{s.n}</span>
          <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 22, color: aInk, fontWeight: 500 }}>{s.label}</span>
          <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 15, color: aInk2, fontStyle: "italic" }}>{s.body}</span>
          <span style={{ display: "flex", gap: 2 }}>
            {Array.from({ length: 28 }).map((_, k) => {
              const seed = (ticks[i] * 13 + k * 0.37) % 1;
              const h = 4 + seed * 18;
              return <span key={k} style={{
                width: 3, height: h,
                background: k > 22 ? aBrand : aInk2,
                opacity: 0.35 + seed * 0.65,
                transition: "height 600ms",
              }}/>;
            })}
          </span>
        </div>
      ))}
    </div>
  );
}

// The variant page ---------------------------------------------------------
function VariantAdvisory() {
  useTick(1000);
  return (
    <div style={{
      width: "100%", height: "100%",
      background: aPaper,
      color: aInk,
      fontFamily: "'Source Serif 4', Georgia, serif",
      overflowY: "auto",
      overflowX: "hidden",
    }}>
      <style>{`
        @keyframes aFade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        @keyframes aBlink { 0%, 60%, 100% { opacity: 0.25 } 30% { opacity: 1 } }
        .a-link { color: ${aBrand}; border-bottom: 1px solid ${aBrand}; padding-bottom: 1px; cursor: pointer; }
        .a-link:hover { background: ${aBrand}; color: ${aPaper}; }
      `}</style>

      {/* Masthead ---------------------------------------------------------- */}
      <div style={{
        borderBottom: "1px solid " + aInk,
        padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11, letterSpacing: "0.18em", color: aInk,
      }}>
        <span style={{ fontWeight: 600 }}>SHEPHERD</span>
        <span style={{ color: aInk3 }}>FIELD ADVISORY · GULF COAST EDITION</span>
        <span style={{ display: "flex", gap: 20 }}>
          <span className="a-link">HOW IT WORKS</span>
          <span className="a-link">MANIFESTO</span>
          <span className="a-link">TRY THE DEMO →</span>
        </span>
      </div>

      {/* Advisory strip --------------------------------------------------- */}
      <AdvisoryStrip />

      {/* Hero ------------------------------------------------------------- */}
      <section style={{ padding: "56px 32px 40px", display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 56, alignItems: "start" }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.22em", color: aBrand, marginBottom: 22 }}>
            ¶ 001 · PURPOSE
          </div>
          <h1 style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(46px, 5.6vw, 78px)",
            lineHeight: 1.02,
            letterSpacing: "-0.01em",
            margin: 0,
            color: aInk,
            textWrap: "pretty",
          }}>
            When the plan breaks,<br/>
            <em style={{ fontStyle: "italic", color: aBrand }}>Shepherd walks with you.</em>
          </h1>
          <p style={{ marginTop: 28, fontSize: 19, lineHeight: 1.55, maxWidth: "48ch", color: aInk2, fontStyle: "italic" }}>
            A personal disaster companion for the moments your plan doesn't survive contact with the storm. Not a checklist. A voice, on the other end of the line, who already knows the highway.
          </p>

          <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 24 }}>
            <button style={{
              background: aInk,
              color: aPaper,
              border: "none",
              padding: "16px 22px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.18em",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
            }}>
              TRY THE DEMO
              <span style={{ fontSize: 14 }}>→</span>
            </button>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: aInk3, letterSpacing: "0.12em", lineHeight: 1.5 }}>
              NO SIGNUP<br/>FREE DURING ACTIVE ADVISORY
            </div>
          </div>

          <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, borderTop: "1px solid " + aRule }}>
            {[
              ["COVERAGE", "GULF · ATL"],
              ["SOURCES", "NHC · NWS · LA GOHSEP · ENTERGY"],
              ["STATUS", "LIVE · ADVISORY №28"],
            ].map(([k, v], i) => (
              <div key={i} style={{
                padding: "14px 0",
                borderRight: i < 2 ? "1px solid " + aRule : "none",
                paddingLeft: i > 0 ? 16 : 0,
              }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.16em", color: aInk3 }}>{k}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: aInk, marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Plot side ---------------------------------------------------- */}
        <div style={{ position: "relative" }}>
          <div style={{
            border: "1px solid " + aInk,
            background: aPaper2,
            aspectRatio: "1 / 1",
            position: "relative",
          }}>
            <ContourStorm t={Date.now()} />
            <div style={{
              position: "absolute", top: 10, left: 12, right: 12,
              display: "flex", justifyContent: "space-between",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.16em", color: aInk,
            }}>
              <span>PLATE 01 · STORM TRACK</span>
              <span>23:00 CDT</span>
            </div>
            <div style={{
              position: "absolute", bottom: 10, left: 12, right: 12,
              display: "flex", justifyContent: "space-between",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.16em", color: aInk3,
            }}>
              <span>MERCATOR · 1:2,400,000</span>
              <span>NHC/SHEPHERD</span>
            </div>
          </div>
          <div style={{
            marginTop: 10,
            fontFamily: "'Source Serif 4', serif",
            fontStyle: "italic",
            fontSize: 13,
            color: aInk2,
            lineHeight: 1.5,
          }}>
            Fig. 01 — Cat 4 IDA, 23:00 CDT. Track narrowing toward Terrebonne Bay; landfall envelope arrives 08:00 Sunday. The product knows what this map means for a 2014 Civic with 37% fuel.
          </div>
        </div>
      </section>

      {/* ¶ 002 Not a planner ---------------------------------------------- */}
      <section style={{ padding: "80px 32px", borderTop: "1px solid " + aRule }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", gap: 48 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.22em", color: aBrand, paddingTop: 10 }}>
            ¶ 002<br/><span style={{ color: aInk3 }}>COMPANION</span>
          </div>
          <h2 style={{
            margin: 0,
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "clamp(30px, 3vw, 44px)",
            fontWeight: 400, lineHeight: 1.1,
            letterSpacing: "-0.01em",
          }}>
            Not a planner.<br/><em style={{ color: aBrand }}>A companion.</em>
          </h2>
          <div style={{ fontSize: 16, lineHeight: 1.65, color: aInk2, display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={{ margin: 0 }}>{window.SHEPHERD.manifesto.paragraphs[0]}</p>
            <p style={{ margin: 0 }}>{window.SHEPHERD.manifesto.paragraphs[1]}</p>
          </div>
        </div>
      </section>

      {/* ¶ 003 Five streams ---------------------------------------------- */}
      <section style={{ padding: "60px 32px 80px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.22em", color: aBrand }}>¶ 003 · INSTRUMENTATION</div>
            <h2 style={{ margin: "8px 0 0", fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 44, fontWeight: 400, letterSpacing: "-0.01em" }}>
              Five streams. <em style={{ color: aBrand }}>One voice.</em>
            </h2>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.14em", color: aInk3, display: "flex", gap: 16 }}>
            <span><span style={{ width: 7, height: 7, borderRadius: 7, background: aBrand, display: "inline-block", marginRight: 6, animation: "aBlink 1.4s infinite" }}/>LIVE</span>
            <span>SAMPLING 1.8s</span>
          </div>
        </div>
        <StreamsTable />
      </section>

      {/* ¶ 004 Transcript ------------------------------------------------- */}
      <section style={{ padding: "80px 32px", background: aPaper2, borderTop: "1px solid " + aRule, borderBottom: "1px solid " + aRule }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 56, alignItems: "start" }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.22em", color: aBrand }}>¶ 004 · SPECIMEN</div>
            <h2 style={{ margin: "8px 0 0", fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 44, fontWeight: 400, letterSpacing: "-0.01em" }}>
              Calm until<br/><em style={{ color: aBrand }}>it can't be.</em>
            </h2>
            <p style={{ marginTop: 24, fontSize: 16, lineHeight: 1.65, color: aInk2, maxWidth: "42ch" }}>
              A transcript fragment from 36 hours before landfall. Sarah Boudreaux, 34, Gentilly. $1,000 and a Honda Civic. The plan broke at 23:15. Shepherd answered at 23:16.
            </p>
            <div style={{ marginTop: 32, borderTop: "1px solid " + aRule, paddingTop: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.14em", color: aInk3, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>SUBJECT</span><span style={{ color: aInk }}>SARAH B · 70122</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>CONTEXT</span><span style={{ color: aInk }}>T-36h · IDA</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>OUTCOME</span><span style={{ color: aInk }}>SHELTERED · JACKSON MS</span></div>
            </div>
          </div>
          <AdvisoryChat />
        </div>
      </section>

      {/* ¶ 005 CTA -------------------------------------------------------- */}
      <section style={{ padding: "96px 32px 48px", textAlign: "center" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.22em", color: aBrand }}>¶ 005 · END OF ADVISORY</div>
        <h2 style={{
          margin: "24px auto 0",
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: "clamp(56px, 7vw, 110px)",
          fontWeight: 400,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          maxWidth: "12ch",
        }}>
          Meet <em style={{ color: aBrand }}>Shepherd.</em>
        </h2>
        <button style={{
          marginTop: 48,
          background: aBrand,
          color: aPaper,
          border: "none",
          padding: "20px 40px 18px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
          letterSpacing: "0.22em",
          cursor: "pointer",
        }}>
          TRY THE DEMO →
        </button>
      </section>

      {/* Colophon --------------------------------------------------------- */}
      <footer style={{
        borderTop: "1px solid " + aInk,
        padding: "18px 32px",
        display: "flex", justifyContent: "space-between",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10, letterSpacing: "0.14em", color: aInk3,
      }}>
        <span>SHEPHERD · TULANE AI CHALLENGE 2026</span>
        <span>COLOPHON · SET IN SOURCE SERIF 4 & JETBRAINS MONO</span>
        <span>PRINTED IN NEW ORLEANS, LA</span>
      </footer>
    </div>
  );
}

window.VariantAdvisory = VariantAdvisory;
