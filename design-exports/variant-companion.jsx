// Direction B — "Companion"
// Aesthetic: quiet editorial. Warm off-white paper, humanist serif (EB Garamond)
// at generous sizes, mono annotations in margins. The page is structured like
// a letter — from Shepherd, to the reader. Soft amber accents. One living orb
// that breathes. Weather data present but recessed, in the margins where
// a book prints running heads.

const bInk   = "#1a1b1e";
const bInk2  = "#44474d";
const bInk3  = "#868a91";
const bPaper = "#f6f1e8";
const bPaper2= "#ede5d3";
const bAmber = "#b8733a";
const bRule  = "#d6cdb8";

function bUseTick(ms = 1000) {
  const [, setT] = React.useState(0);
  React.useEffect(() => { const id = setInterval(() => setT(t => t+1), ms); return () => clearInterval(id); }, [ms]);
}

// Breathing orb — a single living element, centered as signature.
function BreathingOrb({ size = 260 }) {
  const [phase, setPhase] = React.useState(0);
  React.useEffect(() => {
    let raf; const start = performance.now();
    const tick = (t) => { setPhase((t - start) / 1000); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const scale = 1 + Math.sin(phase * 0.9) * 0.03;
  const glow = 0.6 + (Math.sin(phase * 0.9) + 1) * 0.2;
  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      {/* outer halo */}
      <div style={{
        position: "absolute", inset: -80,
        background: `radial-gradient(circle, rgba(184,115,58,${glow*0.18}) 0%, transparent 60%)`,
      }} />
      <div style={{
        position: "absolute", inset: 0,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 30%, #f0d7b6, ${bAmber})`,
        boxShadow: `inset -20px -30px 60px rgba(80,40,10,0.35), 0 0 60px rgba(184,115,58,${glow*0.4})`,
        transform: `scale(${scale})`,
        transition: "none",
      }} />
      {/* faint rings */}
      {[1.25, 1.55, 1.9].map((r, i) => (
        <div key={i} style={{
          position: "absolute",
          inset: `${-(r-1)*size/2}px`,
          borderRadius: "50%",
          border: `1px solid rgba(184,115,58,${0.22 - i*0.06})`,
          transform: `scale(${1 + Math.sin(phase * 0.7 + i) * 0.01})`,
        }}/>
      ))}
    </div>
  );
}

// Streaming message — the chat unfolds typewriter-style
function BCompanionChat() {
  const msgs = window.SHEPHERD.chat;
  const [visible, setVisible] = React.useState(1);
  const [typedChars, setTypedChars] = React.useState(0);
  React.useEffect(() => {
    if (visible >= msgs.length) return;
    const current = msgs[visible];
    if (!current) return;
    const isBot = current.role === "bot";
    const total = current.body.length;
    const start = performance.now();
    const dur = isBot ? Math.min(9000, total * 24) : Math.min(2500, total * 16);
    let raf;
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      setTypedChars(Math.floor(p * total));
      if (p < 1) raf = requestAnimationFrame(step);
      else setTimeout(() => { setVisible(v => v + 1); setTypedChars(0); }, 900);
    };
    const pre = setTimeout(() => { raf = requestAnimationFrame(step); }, 700);
    return () => { clearTimeout(pre); cancelAnimationFrame(raf); };
  }, [visible]);

  return (
    <div style={{
      background: bPaper,
      border: "1px solid " + bRule,
      borderRadius: 2,
      padding: "28px 32px 22px",
      fontFamily: "'EB Garamond', Georgia, serif",
      color: bInk,
      boxShadow: "0 1px 0 rgba(0,0,0,0.03), 0 12px 40px -20px rgba(60,30,10,0.12)",
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        letterSpacing: "0.18em",
        color: bInk3,
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 20,
      }}>
        <span>A CONVERSATION · T-36h</span>
        <span onClick={() => { setVisible(1); setTypedChars(0); }} style={{ cursor: "pointer", color: bAmber }}>REPLAY →</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {msgs.slice(0, visible + 1).map((m, i) => {
          if (i > visible) return null;
          const isCurrent = i === visible && visible < msgs.length;
          const text = isCurrent ? m.body.slice(0, typedChars) : m.body;
          const isBot = m.role === "bot";
          return (
            <div key={i} style={{
              fontSize: 20,
              lineHeight: 1.55,
              fontStyle: isBot ? "normal" : "italic",
              color: isBot ? bInk : bInk2,
              maxWidth: isBot ? "100%" : "44ch",
              marginLeft: isBot ? 0 : "auto",
              textAlign: isBot ? "left" : "right",
              textWrap: "pretty",
            }}>
              {isBot && (
                <span style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.16em", color: bAmber, marginBottom: 6 }}>
                  SHEPHERD · {m.time}
                </span>
              )}
              {!isBot && (
                <span style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.16em", color: bInk3, marginBottom: 6 }}>
                  SARAH · {m.time}
                </span>
              )}
              {isBot ? "" : "“"}
              {text}
              {isCurrent && <span style={{ display: "inline-block", width: 2, height: 18, background: bAmber, marginLeft: 3, verticalAlign: "-3px", animation: "bCaret 1s infinite" }}/>}
              {!isBot && "”"}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// A subtle weather card — reads like a weather observation in a newspaper
function WeatherGlance() {
  return (
    <div style={{
      border: "1px solid " + bRule,
      padding: "22px 24px",
      background: "transparent",
      display: "grid",
      gridTemplateColumns: "auto 1px 1fr",
      gap: 20,
      alignItems: "center",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.2em", color: bInk3 }}>NOW · GULF</span>
        <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 48, lineHeight: 1, letterSpacing: "-0.02em", fontWeight: 500 }}>IDA</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: bAmber, letterSpacing: "0.12em" }}>CAT 4 · 125 MPH</span>
      </div>
      <div style={{ width: 1, height: 64, background: bRule }}/>
      <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, lineHeight: 1.5, fontStyle: "italic", color: bInk2 }}>
        Landfall expected near Terrebonne Bay, 08:00 Sunday. Pressure falling, eyewall tightening. It is time, if you haven't already, to decide.
      </div>
    </div>
  );
}

function VariantCompanion() {
  bUseTick(60000);
  const s = window.SHEPHERD;
  return (
    <div style={{
      width: "100%", height: "100%",
      background: bPaper,
      color: bInk,
      fontFamily: "'EB Garamond', Georgia, serif",
      overflowY: "auto",
      overflowX: "hidden",
    }}>
      <style>{`
        @keyframes bCaret { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        .b-link { color: ${bAmber}; cursor: pointer; border-bottom: 1px solid transparent; transition: border-color .15s; }
        .b-link:hover { border-bottom-color: ${bAmber}; }
      `}</style>

      {/* Masthead */}
      <header style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        padding: "22px 48px 18px",
        borderBottom: "1px double " + bRule,
      }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.22em", color: bInk3 }}>
          VOL. I · NO. 28 · APRIL MMXXVI
        </div>
        <div style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: 34, fontWeight: 500, letterSpacing: "0.02em",
        }}>
          Shepherd
        </div>
        <div style={{ justifySelf: "end", display: "flex", gap: 28, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.16em" }}>
          <span className="b-link">THE COMPANION</span>
          <span className="b-link">THE DEMO</span>
        </div>
      </header>

      {/* Dateline */}
      <div style={{
        padding: "10px 48px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10, letterSpacing: "0.2em",
        color: bInk3,
        display: "flex", justifyContent: "space-between",
        borderBottom: "1px solid " + bRule,
      }}>
        <span>NEW ORLEANS · 29.95°N, 90.07°W</span>
        <span>T MINUS 36 HOURS TO LANDFALL</span>
        <span>ADVISORY 23:00 CDT</span>
      </div>

      {/* Hero letter ---------------------------------------------------- */}
      <section style={{ padding: "72px 48px 56px", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 72 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: bAmber, marginBottom: 20 }}>
            A LETTER, BEFORE THE WIND ARRIVES
          </div>
          <h1 style={{
            margin: 0,
            fontFamily: "'EB Garamond', serif",
            fontWeight: 400,
            fontSize: "clamp(52px, 6.2vw, 96px)",
            lineHeight: 1.02,
            letterSpacing: "-0.015em",
            textWrap: "balance",
          }}>
            When the plan breaks, <em style={{ color: bAmber, fontWeight: 500 }}>I walk with you.</em>
          </h1>

          <div style={{ marginTop: 36, fontSize: 20, lineHeight: 1.6, color: bInk2, maxWidth: "52ch", fontStyle: "italic", textWrap: "pretty" }}>
            I am not a checklist. I am the voice on the other end of the line when the gas station at Hammond goes dry, when your mother calls from Slidell at 23:15 and your stomach drops, when the advisory shifts and the plan you made Sunday no longer matches the sky outside.
          </div>

          <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 28 }}>
            <button style={{
              background: bInk,
              color: bPaper,
              border: "none",
              padding: "18px 28px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.22em",
              cursor: "pointer",
            }}>
              TRY THE DEMO →
            </button>
            <span style={{ fontFamily: "'EB Garamond', serif", fontStyle: "italic", fontSize: 17, color: bInk2 }}>
              No signup. Free during any active advisory.
            </span>
          </div>

          <div style={{ marginTop: 56 }}>
            <WeatherGlance />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", paddingTop: 20 }}>
          <BreathingOrb size={340} />
          <div style={{
            position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: bInk3,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: 8, background: "#6fb59a", display: "inline-block" }}/>
            LISTENING · CALM
          </div>
        </div>
      </section>

      {/* Signature ------------------------------------------------------ */}
      <section style={{ padding: "48px 48px 80px", display: "grid", gridTemplateColumns: "180px 1fr 1fr", gap: 56, borderTop: "1px solid " + bRule, borderBottom: "1px solid " + bRule, background: bPaper2 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.22em", color: bAmber, paddingTop: 6 }}>
          I · THE COMPANION
        </div>
        <h2 style={{
          margin: 0,
          fontFamily: "'EB Garamond', serif",
          fontSize: 56,
          fontWeight: 400,
          lineHeight: 1.02,
          letterSpacing: "-0.01em",
        }}>
          Not a planner.<br/>
          <em style={{ color: bAmber }}>A companion.</em>
        </h2>
        <div style={{ fontSize: 18, lineHeight: 1.65, color: bInk2, display: "flex", flexDirection: "column", gap: 20, fontStyle: "italic" }}>
          <p style={{ margin: 0 }}>The plan is onboarding. I am the voice beside you when the checklist stops matching reality. I keep the threads in one place so you are not doing triage alone in a parking lot that calls itself a highway.</p>
          <p style={{ margin: 0 }}>I stay from three days out through shelter on night three. Calm when it can be, direct when it cannot. Think of me as the older sister who spent years inside emergency management and still sounds like a person, not a siren.</p>
        </div>
      </section>

      {/* Five streams — as a numbered index ---------------------------- */}
      <section style={{ padding: "80px 48px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 40 }}>
          <h2 style={{
            margin: 0,
            fontFamily: "'EB Garamond', serif",
            fontSize: 56,
            fontWeight: 400,
            letterSpacing: "-0.01em",
          }}>
            Five streams. <em style={{ color: bAmber }}>One voice.</em>
          </h2>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: bInk3, letterSpacing: "0.2em" }}>
            II · INSTRUMENTATION
          </div>
        </div>

        <div style={{ borderTop: "1px solid " + bRule }}>
          {s.streams.map((st, i) => (
            <div key={st.n} style={{
              display: "grid",
              gridTemplateColumns: "80px 220px 1fr 180px",
              padding: "28px 0 26px",
              borderBottom: "1px solid " + bRule,
              alignItems: "baseline",
              gap: 32,
            }}>
              <span style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 36,
                color: bAmber,
                fontStyle: "italic",
                fontWeight: 400,
              }}>
                {st.n}
              </span>
              <span style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 42,
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}>
                {st.label}
              </span>
              <span style={{
                fontSize: 19,
                lineHeight: 1.45,
                color: bInk2,
                fontStyle: "italic",
              }}>
                {st.body}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-end", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.16em", color: bInk3 }}>
                <span style={{ width: 6, height: 6, borderRadius: 6, background: "#6fb59a", animation: "bCaret 2s infinite" }}/>
                LIVE · {String(1800 + i * 120)}MS
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Transcript — calm until it can't be --------------------------- */}
      <section style={{ padding: "64px 48px 88px", background: bPaper2, borderTop: "1px solid " + bRule }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: 56, alignItems: "start" }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.22em", color: bAmber }}>III · A TRANSCRIPT</div>
            <h2 style={{
              margin: "14px 0 0",
              fontFamily: "'EB Garamond', serif",
              fontSize: 64,
              fontWeight: 400,
              lineHeight: 1,
              letterSpacing: "-0.015em",
            }}>
              Calm until<br/><em style={{ color: bAmber }}>it can't be.</em>
            </h2>
            <p style={{ marginTop: 28, fontSize: 18, lineHeight: 1.6, color: bInk2, maxWidth: "40ch", fontStyle: "italic" }}>
              From a real conversation, 36 hours before landfall. Sarah Boudreaux. A Civic with three-eighths of a tank. A mother in Slidell. The plan, quietly, coming apart.
            </p>

            <div style={{
              marginTop: 36,
              borderTop: "1px solid " + bRule,
              paddingTop: 20,
              fontFamily: "'EB Garamond', serif",
              fontSize: 16,
              color: bInk2,
              fontStyle: "italic",
              maxWidth: "40ch",
            }}>
              “You leave today. Here's the plan built for <em style={{ color: bAmber, fontStyle: "normal" }}>your actual numbers.</em>”
            </div>
          </div>

          <BCompanionChat />
        </div>
      </section>

      {/* Closing --------------------------------------------------------- */}
      <section style={{ padding: "96px 48px 48px", textAlign: "center" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.22em", color: bAmber }}>IV · AN INVITATION</div>
        <h2 style={{
          margin: "24px auto 0",
          fontFamily: "'EB Garamond', serif",
          fontSize: "clamp(64px, 9vw, 140px)",
          fontWeight: 400,
          lineHeight: 0.95,
          letterSpacing: "-0.02em",
          maxWidth: "14ch",
        }}>
          Meet <em style={{ color: bAmber }}>Shepherd.</em>
        </h2>
        <p style={{ marginTop: 28, fontSize: 20, lineHeight: 1.55, color: bInk2, fontStyle: "italic", maxWidth: "52ch", marginLeft: "auto", marginRight: "auto" }}>
          You do not have to wait for the storm to introduce us.
        </p>
        <button style={{
          marginTop: 40,
          background: bAmber,
          color: bPaper,
          border: "none",
          padding: "20px 36px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
          letterSpacing: "0.24em",
          cursor: "pointer",
        }}>
          TRY THE DEMO →
        </button>
      </section>

      {/* Colophon */}
      <footer style={{
        borderTop: "1px double " + bRule,
        padding: "20px 48px",
        display: "flex", justifyContent: "space-between",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10, letterSpacing: "0.18em", color: bInk3,
      }}>
        <span>SHEPHERD</span>
        <span>SET IN EB GARAMOND & JETBRAINS MONO</span>
        <span>TULANE AI CHALLENGE · MMXXVI</span>
      </footer>
    </div>
  );
}

window.VariantCompanion = VariantCompanion;
