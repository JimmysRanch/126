import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Accent = "blue" | "amber" | "green";
type CardId =
  | "avgMins"
  | "rpm"
  | "appts"
  | "rpmMonthly"
  | "avgMinsMonthly"
  | "rpmBySize"
  | "earningsByBreed"
  | "topCombos"
  | "rpmMatrix";

type CardDef = {
  id: CardId;
  accent: Accent;
  icon: string;
  value: string;
  unit?: string;
  label: string;
  subtitle?: string;
  kind: "kpi" | "chart" | "list" | "matrix" | "sectioned";
};

export default function GroomerPerformanceP3() {
  const cards = useMemo<CardDef[]>(
    () => [
      { id: "avgMins", accent: "blue", icon: "⏱", value: "64", unit: "mins", label: "AVG MINUTES / APPOINTMENT", subtitle: "Today", kind: "kpi" },
      { id: "rpm", accent: "amber", icon: "$", value: "$3.75", label: "REVENUE PER MIN | RPM", subtitle: "Today", kind: "kpi" },
      { id: "appts", accent: "green", icon: "🐾", value: "75", label: "COMPLETED APPOINTMENTS", subtitle: "Today", kind: "kpi" },

      { id: "rpmMonthly", accent: "blue", icon: "📈", value: "$1.97", label: "RPM (Monthly)", subtitle: "Last 5 months", kind: "chart" },
      { id: "avgMinsMonthly", accent: "blue", icon: "🕒", value: "47", unit: "mins", label: "Average Minutes per Appointment (Monthly)", subtitle: "Last 5 months", kind: "chart" },
      { id: "rpmBySize", accent: "amber", icon: "🐶", value: "$2.24", label: "RPM by Dog Size", subtitle: "Small/Med/Large", kind: "chart" },

      { id: "earningsByBreed", accent: "blue", icon: "🏷️", value: "$1.77", label: "Earnings by Breed", subtitle: "Top breeds", kind: "list" },
      { id: "topCombos", accent: "amber", icon: "⭐", value: "$1.77", label: "Top Performing Breed & Size Combinations", subtitle: "Top + Lowest", kind: "sectioned" },
      { id: "rpmMatrix", accent: "amber", icon: "🧩", value: "$1.72", label: "RPM by Breed & Size", subtitle: "Matrix view", kind: "matrix" },
    ],
    []
  );

  const [activeId, setActiveId] = useState<CardId | null>(null);
  const active = activeId ? cards.find((c) => c.id === activeId) ?? null : null;

  const row1 = cards.slice(0, 3);
  const row2 = cards.slice(3, 6);
  const row3 = cards.slice(6, 9);

  return (
    <>
      <style>{`
        :root{
          --bg0:#050915; --bg1:#071326;
          --text: rgba(255,255,255,.92);
          --muted: rgba(255,255,255,.70);
          --muted2: rgba(255,255,255,.50);
          --stroke: rgba(255,255,255,.10);
          --stroke2: rgba(255,255,255,.06);
          --blue: 84, 210, 255;
          --amber: 255, 180, 77;
          --green: 116, 255, 158;
        }
        *{ box-sizing:border-box; }
        body{ margin:0; }

        .page{
          min-height: calc(100vh - 56px);
          padding: clamp(14px, 2.2vw, 26px);
          display:grid;
          place-items:center;
          color: var(--text);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
          background:
            radial-gradient(1200px 800px at 50% 5%, rgba(120,140,255,.18), transparent 55%),
            radial-gradient(900px 700px at 20% 70%, rgba(var(--blue), .12), transparent 58%),
            radial-gradient(900px 700px at 85% 75%, rgba(var(--amber), .12), transparent 58%),
            radial-gradient(700px 500px at 92% 18%, rgba(0,0,0,.55), transparent 70%),
            linear-gradient(180deg, var(--bg0), var(--bg1));
        }

        .stage{
          width: min(1720px, 100%);
          display:grid;
          gap: 14px;
        }

        .curveWrap{
          perspective: 1200px;
          perspective-origin: 50% 40%;
        }

        .rowGrid{
          display:grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(12px, 1.25vw, 18px);
          align-items: stretch;
        }

        .cell{
          transform-style: preserve-3d;
          will-change: transform;
        }

        /* Curved TV spacing (subtle) */
        .cell[data-col="-1"]{ --ry: -10deg; --tz: 26px; --tx: -8px; }
        .cell[data-col="0"] { --ry:   0deg; --tz: 56px; --tx:  0px; }
        .cell[data-col="1"] { --ry:  10deg; --tz: 26px; --tx:  8px; }

        .rowKpi  .cell{ --rx: 0deg; }
        .rowMid  .cell{ --rx: 5deg; }
        .rowBot  .cell{ --rx: 8deg; }

        .cellInner{
          height: 100%;
          transform:
            rotateX(var(--rx))
            rotateY(var(--ry))
            translateZ(var(--tz))
            translateX(var(--tx));
          transform-style: preserve-3d;
        }

        /* ============================================================
           NEW: "REFERENCE" CARD CHROME (matches your first image)
           - Thin neon outer frame
           - Inner “double border” / inset frame
           - Strong top sheen + bottom vignette
           - Accent glow on edges only
        ============================================================ */

        .card{
          width: 100%;
          height: 100%;
          border-radius: 18px;
          padding: 10px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;

          /* base glass */
          background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.015));
          box-shadow:
            0 26px 80px rgba(0,0,0,.62),
            0 0 0 1px rgba(255,255,255,.08) inset;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transform-style: preserve-3d;
        }

        /* outer neon stroke */
        .card::before{
          content:"";
          position:absolute; inset:0;
          border-radius: 18px;
          pointer-events:none;
          background:
            /* subtle bright perimeter */
            linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,.04));
          opacity: .85;
        }

        /* cinematic sheen + bottom vignette */
        .card::after{
          content:"";
          position:absolute; inset:0;
          border-radius: 18px;
          pointer-events:none;
          background:
            radial-gradient(1200px 520px at 50% -45%, rgba(255,255,255,.14), transparent 55%),
            radial-gradient(900px 340px at 50% 125%, rgba(0,0,0,.72), transparent 62%);
          opacity: .45;
        }

        /* accent edge glow + colored border line */
        .card.blue{
          box-shadow:
            0 26px 80px rgba(0,0,0,.62),
            0 0 0 1px rgba(255,255,255,.08) inset,
            0 0 0 1px rgba(var(--blue), .28),
            0 0 28px rgba(var(--blue), .14);
        }
        .card.amber{
          box-shadow:
            0 26px 80px rgba(0,0,0,.62),
            0 0 0 1px rgba(255,255,255,.08) inset,
            0 0 0 1px rgba(var(--amber), .25),
            0 0 28px rgba(var(--amber), .12);
        }
        .card.green{
          box-shadow:
            0 26px 80px rgba(0,0,0,.62),
            0 0 0 1px rgba(255,255,255,.08) inset,
            0 0 0 1px rgba(var(--green), .22),
            0 0 28px rgba(var(--green), .10);
        }

        /* inner “double frame” like the reference */
        .chrome{
          position: relative;
          height: 100%;
          border-radius: 14px;

          background:
            radial-gradient(900px 260px at 22% 12%, rgba(255,255,255,.07), transparent 60%),
            linear-gradient(180deg, rgba(12,16,26,.62), rgba(6,10,18,.90));

          border: 1px solid rgba(255,255,255,.10);
          box-shadow:
            0 0 0 1px rgba(0,0,0,.50) inset,              /* dark inner edge */
            0 0 0 1px rgba(255,255,255,.06),              /* faint outer inner line */
            0 14px 36px rgba(0,0,0,.42);
          overflow: hidden;
        }

        /* a second inset stroke (gives the “two line” look) */
        .chrome::before{
          content:"";
          position:absolute; inset: 8px;
          border-radius: 12px;
          pointer-events:none;
          border: 1px solid rgba(255,255,255,.07);
          box-shadow: 0 0 0 1px rgba(0,0,0,.45) inset;
          opacity: .95;
        }

        /* KPI content typography (not the focus, but keep nice) */
        .kpiWrap{
          height:100%;
          padding: 18px 18px 16px;
          display:flex;
          flex-direction:column;
          justify-content:center;
          gap: 10px;
          position: relative;
          z-index: 2;
        }
        .kpiTop{
          display:flex;
          align-items:center;
          justify-content:center;
          gap: 12px;
        }
        .kpiIcon{
          width: 44px; height: 44px;
          border-radius: 14px;
          display:grid; place-items:center;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.12);
          box-shadow: 0 0 0 1px rgba(0,0,0,.25) inset;
          font-size: 20px;
          opacity: .95;
        }
        .kpiValue{
          display:flex;
          align-items:baseline;
          justify-content:center;
          gap: 10px;
          font-weight: 900;
          letter-spacing: .4px;
          text-shadow: 0 18px 44px rgba(0,0,0,.70);
          font-size: clamp(34px, 3.4vw, 52px);
          line-height: 1;
          white-space:nowrap;
        }
        .kpiUnit{ font-size: 18px; font-weight: 900; opacity:.70; }
        .kpiLabel{
          text-align:center;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,.72);
        }

        /* Non-KPI header */
        .cardHeader{
          display:flex; align-items:center; gap:10px;
          font-size: 13px; color: rgba(255,255,255,.86);
          padding: 14px 14px 0;
          position: relative;
          z-index: 2;
        }
        .dot{
          width: 8px; height: 8px; border-radius: 3px;
          background: rgba(var(--blue), .95);
          box-shadow: 0 0 14px rgba(var(--blue), .25);
        }
        .amberDot{ background: rgba(var(--amber), .95); box-shadow: 0 0 14px rgba(var(--amber), .22); }
        .greenDot{ background: rgba(var(--green), .95); box-shadow: 0 0 14px rgba(var(--green), .18); }

        .content{
          padding: 10px 14px 14px;
          height: calc(100% - 44px);
          position: relative;
          z-index: 2;
        }
        .slot{
          height:100%;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,.08);
          background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
          box-shadow: 0 0 0 1px rgba(0,0,0,.35) inset;
          padding: 10px 12px;
          overflow:hidden;
        }

        /* list styling */
        .rows{ display:grid; gap:10px; }
        .row{
          display:grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
          align-items:center;
          padding: 10px 10px;
          border-radius: 12px;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.06);
        }
        .rowL{ color: rgba(255,255,255,.84); }
        .rowR{ color: rgba(255,255,255,.92); font-weight: 900; letter-spacing:.2px; }

        /* overlay (stable) */
        .overlay{
          position: fixed; inset: 0; z-index: 90;
          background: rgba(0,0,0,.62);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display:grid;
          place-items:center;
          padding: 18px;
        }
        .modal{
          width: min(1280px, 100%);
          height: min(86vh, 980px);
          position: relative;
        }
        .modalInner{
          height:100%;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,.10);
          background: linear-gradient(180deg, rgba(8,12,22,.78), rgba(6,10,18,.88));
          box-shadow: 0 0 0 1px rgba(0,0,0,.35) inset;
          display:flex;
          flex-direction:column;
          overflow:hidden;
        }
        .modalHead{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap: 12px;
          padding: 16px 16px 12px;
          border-bottom: 1px solid rgba(255,255,255,.07);
          background: rgba(255,255,255,.02);
        }
        .modalHeadL{ display:flex; align-items:center; gap:12px; }
        .modalTitle{ font-weight: 900; letter-spacing:.2px; }
        .btn{
          border: 1px solid rgba(255,255,255,.14);
          background: rgba(255,255,255,.06);
          color: rgba(255,255,255,.90);
          padding: 10px 12px;
          border-radius: 12px;
          cursor:pointer;
        }
        .modalBody{
          flex:1;
          padding: 16px;
          overflow:auto;
        }
        .modalKpi{
          display:flex; align-items:baseline; gap:10px;
          font-weight: 900;
          font-size: 44px;
          margin-bottom: 12px;
        }

        /* heights */
        .kpiH{ height: clamp(110px, 11.5vw, 160px); }
        .chartH{ height: clamp(200px, 18vw, 260px); }
        .row3H{ height: 260px; }

        @media (max-width: 980px){
          .rowGrid{ grid-template-columns: 1fr; }
          .cell{ --ry: 0deg !important; --tz: 24px !important; --tx: 0px !important; }
        }
      `}</style>

      <div className="page">
        <div className="stage">
          <div className="curveWrap">
            {/* TOP ROW (KPIs) */}
            <div className="rowGrid rowKpi">
              {row1.map((c, i) => (
                <GridCell key={c.id} col={i === 0 ? -1 : i === 1 ? 0 : 1} onOpen={() => setActiveId(c.id)}>
                  <ReferenceCard accent={c.accent} heightClass="kpiH">
                    <div className="kpiWrap">
                      <div className="kpiTop">
                        <div className="kpiIcon">{c.icon}</div>
                        <div className="kpiValue">
                          {c.value}
                          {c.unit ? <span className="kpiUnit">{c.unit}</span> : null}
                        </div>
                      </div>
                      <div className="kpiLabel">{c.label}</div>
                    </div>
                  </ReferenceCard>
                </GridCell>
              ))}
            </div>

            {/* SECOND ROW (same exact card chrome as row 1) */}
            <div className="rowGrid rowMid">
              {row2.map((c, i) => (
                <GridCell key={c.id} col={i === 0 ? -1 : i === 1 ? 0 : 1} onOpen={() => setActiveId(c.id)}>
                  <ReferenceCard accent={c.accent} heightClass="chartH">
                    <div className="cardHeader">
                      <div className={`dot ${c.accent === "amber" ? "amberDot" : c.accent === "green" ? "greenDot" : ""}`} />
                      <div>{c.label}</div>
                    </div>
                    <div className="content">
                      <div className="slot">
                        <MiniContent def={c} />
                      </div>
                    </div>
                  </ReferenceCard>
                </GridCell>
              ))}
            </div>

            {/* leave row 3 alone (still uses same chrome so it matches) */}
            <div className="rowGrid rowBot" style={{ marginTop: 10 }}>
              {row3.map((c, i) => (
                <GridCell key={c.id} col={i === 0 ? -1 : i === 1 ? 0 : 1} onOpen={() => setActiveId(c.id)}>
                  <ReferenceCard accent={c.accent} heightClass="row3H">
                    <div className="cardHeader">
                      <div className={`dot ${c.accent === "amber" ? "amberDot" : c.accent === "green" ? "greenDot" : ""}`} />
                      <div>{c.label}</div>
                    </div>
                    <div className="content">
                      <div className="slot">
                        <MiniContent def={c} />
                      </div>
                    </div>
                  </ReferenceCard>
                </GridCell>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="overlay"
            onClick={() => setActiveId(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="card modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 38 }}
            >
              <div className="modalInner">
                <div className="modalHead">
                  <div className="modalHeadL">
                    <div className="kpiIcon">{active.icon}</div>
                    <div>
                      <div className="modalTitle">{active.label}</div>
                      <div style={{ color: "rgba(255,255,255,.60)", fontSize: 13 }}>Fullscreen details (wire to live data)</div>
                    </div>
                  </div>
                  <button className="btn" onClick={() => setActiveId(null)}>Close</button>
                </div>

                <div className="modalBody">
                  <div className="modalKpi">
                    {active.value}
                    {active.unit ? <span style={{ fontSize: 18, opacity: .75, fontWeight: 900 }}>{active.unit}</span> : null}
                  </div>

                  <ExpandedContent def={active} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function GridCell(props: { col: -1 | 0 | 1; onOpen: () => void; children: React.ReactNode }) {
  const { col, onOpen, children } = props;
  return (
    <div className="cell" data-col={col}>
      <div className="cellInner" onClick={onOpen}>
        {children}
      </div>
    </div>
  );
}

/** Wrapper that applies the reference “chrome” to ANY content */
function ReferenceCard(props: { accent: Accent; heightClass: string; children: React.ReactNode }) {
  const { accent, heightClass, children } = props;
  const accentClass = accent === "amber" ? "amber" : accent === "green" ? "green" : "blue";
  return (
    <motion.div
      className={`card ${accentClass} ${heightClass}`}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
    >
      <div className="chrome">{children}</div>
    </motion.div>
  );
}

/* ===== your existing content components (unchanged) ===== */
function MiniContent({ def }: { def: CardDef }) {
  if (def.id === "rpmMonthly") return <MiniBars labels={["JAN", "FEB", "MAR", "APR", "MAY"]} values={[2.02, 1.92, 1.94, 1.96, 1.97]} prefix="$" />;
  if (def.id === "avgMinsMonthly") return <MiniBars labels={["JAN", "FEB", "MAR", "APR", "MAY"]} values={[42, 45, 46, 46, 47]} suffix="m" />;
  if (def.id === "rpmBySize") return <MiniBars labels={["Small", "Medium", "Large"]} values={[1.56, 1.95, 2.24]} prefix="$" />;
  if (def.id === "earningsByBreed") return <MiniList rows={[["Golden Retrievers", "$1.77"], ["Cavaliers", "$1.72"], ["Dachshunds", "$1.65"]]} />;
  if (def.id === "topCombos") return <MiniList rows={[["Golden Retrievers Large", "$1.77"], ["Cavaliers Small", "$1.72"], ["Dachshunds Small", "$1.65"]]} />;
  if (def.id === "rpmMatrix") return <MiniMatrix />;
  return <div style={{ color: "rgba(255,255,255,.70)" }}>—</div>;
}

function ExpandedContent({ def }: { def: CardDef }) {
  if (def.id === "rpmMonthly") {
    return (
      <>
        <h3 style={{ margin: "0 0 10px", fontWeight: 900 }}>RPM (Monthly)</h3>
        <BigBars labels={["JAN", "FEB", "MAR", "APR", "MAY"]} values={[2.02, 1.92, 1.94, 1.96, 1.97]} prefix="$" />
      </>
    );
  }
  if (def.id === "avgMinsMonthly") {
    return (
      <>
        <h3 style={{ margin: "0 0 10px", fontWeight: 900 }}>Average Minutes per Appointment (Monthly)</h3>
        <BigBars labels={["JAN", "FEB", "MAR", "APR", "MAY"]} values={[42, 45, 46, 46, 47]} suffix=" mins" />
      </>
    );
  }
  if (def.id === "rpmBySize") {
    return (
      <>
        <h3 style={{ margin: "0 0 10px", fontWeight: 900 }}>RPM by Dog Size</h3>
        <BigBars labels={["Small", "Medium", "Large"]} values={[1.56, 1.95, 2.24]} prefix="$" />
      </>
    );
  }
  if (def.id === "earningsByBreed") {
    return (
      <>
        <h3 style={{ margin: "0 0 10px", fontWeight: 900 }}>Earnings by Breed</h3>
        <List rows={[
          ["Golden Retrievers", "$1.77"],
          ["Cavaliers", "$1.72"],
          ["Dachshunds", "$1.65"],
          ["Poodles", "$1.58"],
          ["Maltese", "$1.52"],
          ["Goldendoodles", "$1.35"],
          ["Labradors", "$1.35"],
        ]}/>
      </>
    );
  }
  if (def.id === "topCombos") {
    return (
      <>
        <h3 style={{ margin: "0 0 10px", fontWeight: 900 }}>Top Performing Breed & Size Combinations</h3>
        <List rows={[
          ["Golden Retrievers Large", "$1.77"],
          ["Cavaliers Small", "$1.72"],
          ["Dachshunds Small", "$1.65"],
        ]}/>
        <div style={{ margin: "12px 2px 10px", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: "rgba(var(--amber), .92)" }}>
          Lowest Performing Breed & Size Combinations
        </div>
        <List rows={[
          ["Goldendoodles Large", "$1.22"],
          ["Labradors Large", "$1.18"],
          ["Mixed Breed XL", "$1.05"],
        ]}/>
      </>
    );
  }
  if (def.id === "rpmMatrix") {
    return (
      <>
        <h3 style={{ margin: "0 0 10px", fontWeight: 900 }}>RPM by Breed & Size</h3>
        <Matrix />
      </>
    );
  }

  return (
    <div style={{ color: "rgba(255,255,255,.75)", lineHeight: 1.6 }}>
      Replace this content with the live details for <b>{def.label}</b>.
    </div>
  );
}

function MiniBars(props: { labels: string[]; values: number[]; prefix?: string; suffix?: string }) {
  const { labels, values, prefix, suffix } = props;
  const max = Math.max(...values);
  return (
    <div style={{ height: "100%", display: "grid", gridTemplateColumns: `repeat(${labels.length}, 1fr)`, gap: 10, alignItems: "end" }}>
      {labels.map((l, i) => {
        const v = values[i];
        const h = Math.max(0.18, v / max);
        return (
          <div key={l} style={{ display: "grid", gridTemplateRows: "auto 1fr auto", gap: 6 }}>
            <div style={{ fontSize: 11, textAlign: "center", color: "rgba(255,255,255,.72)" }}>
              {(prefix ?? "")}{prefix ? v.toFixed(2) : v.toFixed(0)}{suffix ?? ""}
            </div>
            <div style={{ height: 110, borderRadius: 10, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.05)", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
              <div style={{ width: "100%", height: `${h * 100}%`, borderRadius: "10px 10px 0 0", background: "linear-gradient(180deg, rgba(120,180,255,.55), rgba(79,209,255,.20))" }} />
            </div>
            <div style={{ fontSize: 10, textAlign: "center", letterSpacing: 1, color: "rgba(255,255,255,.55)" }}>{l}</div>
          </div>
        );
      })}
    </div>
  );
}

function BigBars(props: { labels: string[]; values: number[]; prefix?: string; suffix?: string }) {
  const { labels, values, prefix, suffix } = props;
  const max = Math.max(...values);
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${labels.length}, 1fr)`, gap: 14, alignItems: "end" }}>
      {labels.map((l, i) => {
        const v = values[i];
        const h = Math.max(0.08, v / max);
        return (
          <div key={l} style={{ display: "grid", gridTemplateRows: "auto 1fr auto", gap: 10 }}>
            <div style={{ fontSize: 13, textAlign: "center", color: "rgba(255,255,255,.78)" }}>
              {(prefix ?? "")}{prefix ? v.toFixed(2) : v.toFixed(0)}{suffix ?? ""}
            </div>
            <div style={{ height: 320, borderRadius: 14, border: "1px solid rgba(255,255,255,.10)", background: "rgba(255,255,255,.04)", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
              <div style={{ width: "100%", height: `${h * 100}%`, borderRadius: "14px 14px 0 0", background: "linear-gradient(180deg, rgba(120,180,255,.62), rgba(79,209,255,.18))" }} />
            </div>
            <div style={{ fontSize: 12, textAlign: "center", letterSpacing: 1, color: "rgba(255,255,255,.60)" }}>{l}</div>
          </div>
        );
      })}
    </div>
  );
}

function MiniList({ rows }: { rows: [string, string][] }) {
  return (
    <div className="rows">
      {rows.map(([a, b]) => (
        <div key={a} className="row">
          <div className="rowL">{a}</div>
          <div className="rowR">{b}</div>
        </div>
      ))}
    </div>
  );
}
function List({ rows }: { rows: [string, string][] }) {
  return <MiniList rows={rows} />;
}

function MiniMatrix() {
  return <div style={{ color: "rgba(255,255,255,.72)", lineHeight: 1.6 }}>Tap to open matrix</div>;
}

function Matrix() {
  const cols = ["Small", "Medium", "Large", "XL"];
  const rows: [string, string[]][] = [
    ["Cavalier", ["$1.72", "—", "—", "—"]],
    ["Dachshund", ["$1.65", "—", "—", "—"]],
    ["Bichon Frise", ["$1.58", "$1.41", "$1.41", "$1.48"]],
    ["Golden Retriever", ["$1.58", "$1.52", "$1.60", "$1.61"]],
    ["Goldendoodle", ["—", "$1.55", "$1.60", "—"]],
    ["Labradoodle", ["$1.35", "$1.35", "$1.60", "—"]],
    ["Labrador", ["$1.35", "$1.65", "$1.60", "—"]],
  ];

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.45fr repeat(4, .75fr)", gap: 10, alignItems: "center", color: "rgba(255,255,255,.62)", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>
        <div>Breed</div>
        {cols.map((c) => <div key={c}>{c}</div>)}
      </div>
      {rows.map(([r, vals]) => (
        <div key={r} style={{ display: "grid", gridTemplateColumns: "1.45fr repeat(4, .75fr)", gap: 10, alignItems: "center" }}>
          <div style={{ padding: "10px 10px", borderRadius: 12, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", color: "rgba(255,255,255,.84)" }}>{r}</div>
          {vals.map((v, i) => (
            <div
              key={`${r}-${i}`}
              style={{
                padding: "10px 10px",
                borderRadius: 12,
                background: "rgba(255,255,255,.03)",
                border: "1px solid rgba(255,255,255,.06)",
                textAlign: "center",
                fontWeight: v === "—" ? 700 : 900,
                color: v === "—" ? "rgba(255,255,255,.35)" : "rgba(255,255,255,.92)",
              }}
            >
              {v}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
