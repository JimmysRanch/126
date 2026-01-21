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
      // ROW 1 (KPIs)
      { id: "avgMins", accent: "blue", icon: "⏱", value: "64", unit: "mins", label: "AVG MINUTES / APPOINTMENT", subtitle: "Today", kind: "kpi" },
      { id: "rpm", accent: "amber", icon: "$", value: "$3.75", label: "REVENUE PER MIN | RPM", subtitle: "Today", kind: "kpi" },
      { id: "appts", accent: "green", icon: "🐾", value: "75", label: "COMPLETED APPOINTMENTS", subtitle: "Today", kind: "kpi" },

      // ROW 2 (PANELS) — we keep your existing ids but render them like the reference
      { id: "rpmMonthly", accent: "blue", icon: "📋", value: "18", label: "Appointments Today", subtitle: "Live", kind: "chart" },
      { id: "avgMinsMonthly", accent: "blue", icon: "🕒", value: "82%", label: "Average Minutes per Appointment (Monthly)", subtitle: "Last 5 months", kind: "chart" },
      { id: "rpmBySize", accent: "amber", icon: "💰", value: "$1450", label: "Expected revenue", subtitle: "Today", kind: "chart" },

      // ROW 3 (leave as-is for now)
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
          perspective: 1150px;
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

        /* Curved TV spacing (subtle, like reference) */
        .cell[data-col="-1"]{ --ry: -10deg; --tz: 28px; --tx: -8px; }
        .cell[data-col="0"] { --ry:   0deg; --tz: 58px; --tx:  0px; }
        .cell[data-col="1"] { --ry:  10deg; --tz: 28px; --tx:  8px; }

        .rowKpi  .cell{ --rx: 0deg; }
        .rowPanels .cell{ --rx: 5deg; }
        .rowBot .cell{ --rx: 8deg; }

        .cellInner{
          height: 100%;
          transform:
            rotateX(var(--rx))
            rotateY(var(--ry))
            translateZ(var(--tz))
            translateX(var(--tx));
          transform-style: preserve-3d;
        }

        /* ===== FRAME / GLASS ===== */
        .shell{
          width: 100%;
          height: 100%;
          border-radius: 18px;
          padding: 12px;
          overflow:hidden;
          position: relative;
          background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
          box-shadow: 0 30px 90px rgba(0,0,0,.62), 0 0 0 1px rgba(255,255,255,.07) inset;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transform-style: preserve-3d;
          cursor:pointer;
          user-select:none;
          -webkit-tap-highlight-color: transparent;
        }

        /* outer “neon frame” like your reference */
        .shell::before{
          content:"";
          position:absolute; inset:0;
          border-radius: 18px;
          pointer-events:none;
          opacity: .95;
          background:
            linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.02));
        }

        .shell::after{
          content:"";
          position:absolute; inset:0;
          border-radius: 18px;
          pointer-events:none;
          background:
            radial-gradient(1200px 520px at 50% -40%, rgba(255,255,255,.10), transparent 55%),
            radial-gradient(900px 300px at 50% 120%, rgba(0,0,0,.60), transparent 60%);
          opacity:.35;
        }

        /* accent glow on the frame edges */
        .shell.blueGlow{
          box-shadow:
            0 30px 90px rgba(0,0,0,.62),
            0 0 0 1px rgba(255,255,255,.08) inset,
            0 0 0 1px rgba(var(--blue), .28),
            0 0 32px rgba(var(--blue), .14);
        }
        .shell.amberGlow{
          box-shadow:
            0 30px 90px rgba(0,0,0,.62),
            0 0 0 1px rgba(255,255,255,.08) inset,
            0 0 0 1px rgba(var(--amber), .26),
            0 0 32px rgba(var(--amber), .12);
        }
        .shell.greenGlow{
          box-shadow:
            0 30px 90px rgba(0,0,0,.62),
            0 0 0 1px rgba(255,255,255,.08) inset,
            0 0 0 1px rgba(var(--green), .22),
            0 0 32px rgba(var(--green), .10);
        }

        .inner{
          position: relative;
          height:100%;
          border-radius: 14px;
          background:
            radial-gradient(900px 300px at 18% 10%, rgba(255,255,255,.06), transparent 60%),
            linear-gradient(180deg, rgba(8,12,22,.70), rgba(6,10,18,.86));
          border: 1px solid rgba(255,255,255,.10);
          box-shadow: 0 0 0 1px rgba(0,0,0,.40) inset, 0 16px 40px rgba(0,0,0,.42);
          padding: 16px 18px;
          display:flex;
          flex-direction:column;
          justify-content:center;
          gap: 6px;
        }

        /* ===== KPI (row 1) — match reference layout ===== */
        .kpiInner{
          height:100%;
          border-radius: 14px;
          background:
            radial-gradient(1200px 360px at 50% -60%, rgba(255,255,255,.10), transparent 60%),
            linear-gradient(180deg, rgba(12,16,26,.66), rgba(6,10,18,.90));
          border: 1px solid rgba(255,255,255,.10);
          box-shadow: 0 0 0 1px rgba(0,0,0,.50) inset, 0 18px 44px rgba(0,0,0,.42);
          padding: 18px 18px 16px;
          display:flex;
          flex-direction:column;
          justify-content:center;
          gap: 10px;
        }
        .kpiTop{
          display:flex; align-items:center; justify-content:center;
          gap: 12px;
        }
        .kpiIcon{
          width: 44px; height: 44px; border-radius: 14px;
          display:grid; place-items:center;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.12);
          box-shadow: 0 0 0 1px rgba(0,0,0,.25) inset;
          font-size: 20px;
          opacity: .95;
        }
        .kpiValue{
          display:flex; align-items:baseline; justify-content:center;
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

        /* ===== Panels (row 2) — reference style ===== */
        .panelInner{
          height:100%;
          border-radius: 14px;
          background:
            radial-gradient(1200px 360px at 50% -60%, rgba(255,255,255,.08), transparent 60%),
            linear-gradient(180deg, rgba(10,14,24,.70), rgba(6,10,18,.88));
          border: 1px solid rgba(255,255,255,.10);
          box-shadow: 0 0 0 1px rgba(0,0,0,.45) inset, 0 18px 44px rgba(0,0,0,.40);
          display:flex;
          flex-direction:column;
          overflow:hidden;
        }
        .panelHead{
          display:flex; align-items:center; gap:10px;
          padding: 14px 14px 10px;
          border-bottom: 1px solid rgba(255,255,255,.07);
          background: rgba(255,255,255,.02);
          color: rgba(255,255,255,.86);
          font-size: 14px;
          letter-spacing: .2px;
        }
        .panelHead .miniIco{
          width: 28px; height: 28px; border-radius: 10px;
          display:grid; place-items:center;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.12);
        }
        .panelBody{
          padding: 14px;
          flex:1;
          display:flex;
          gap: 14px;
        }

        /* Appts Today panel */
        .apList{ flex:1; display:grid; gap: 10px; }
        .apRow{
          display:flex; align-items:center; justify-content:space-between;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.06);
        }
        .apLeft{ display:flex; align-items:center; gap:10px; color: rgba(255,255,255,.84); }
        .apDot{
          width: 10px; height: 10px; border-radius: 999px;
          background: rgba(255,255,255,.28);
          border: 1px solid rgba(255,255,255,.18);
        }
        .apDot.ok{ background: rgba(var(--green), .65); }
        .apDot.info{ background: rgba(var(--blue), .65); }
        .apDot.warn{ background: rgba(var(--amber), .70); }
        .apDot.bad{ background: rgba(255, 110, 110, .70); }
        .apVal{ font-weight: 900; color: rgba(255,255,255,.92); }
        .progress{
          margin-top: 2px;
          height: 10px;
          border-radius: 999px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.08);
          overflow:hidden;
        }
        .progress > div{
          height:100%;
          width: 67%;
          background: linear-gradient(90deg, rgba(var(--blue), .55), rgba(var(--green), .55));
          border-radius: 999px;
        }
        .progressMeta{
          display:flex; align-items:center; justify-content:space-between;
          margin-top: 8px;
          color: rgba(255,255,255,.62);
          font-size: 12px;
        }

        /* Donut + bars panel */
        .donutWrap{
          flex: 0 0 170px;
          display:grid;
          place-items:center;
        }
        .donut{
          width: 150px;
          height: 150px;
          border-radius: 999px;
          background:
            conic-gradient(rgba(var(--green), .70) 0 295deg, rgba(255,255,255,.12) 295deg 360deg);
          box-shadow: 0 16px 40px rgba(0,0,0,.55);
          position: relative;
          border: 1px solid rgba(255,255,255,.12);
        }
        .donut::after{
          content:"";
          position:absolute; inset: 18px;
          border-radius: 999px;
          background: linear-gradient(180deg, rgba(10,14,24,.72), rgba(6,10,18,.90));
          border: 1px solid rgba(255,255,255,.10);
          box-shadow: 0 0 0 1px rgba(0,0,0,.45) inset;
        }
        .donutCenter{
          position:absolute; inset:0;
          display:grid; place-items:center;
          text-align:center;
          z-index: 2;
        }
        .donutPct{ font-size: 34px; font-weight: 900; letter-spacing: .2px; }
        .donutLab{ font-size: 12px; color: rgba(255,255,255,.70); margin-top: 2px; }
        .donutSub{ font-size: 11px; color: rgba(255,255,255,.55); margin-top: 4px; }

        .barsWrap{ flex:1; display:flex; flex-direction:column; gap:10px; }
        .tinyBars{
          flex:1;
          display:grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          align-items:end;
          padding-top: 6px;
        }
        .barCol{
          display:grid;
          grid-template-rows: auto 1fr auto;
          gap: 8px;
          align-items:end;
        }
        .barTop{
          font-size: 11px;
          text-align:center;
          color: rgba(255,255,255,.70);
          white-space:nowrap;
        }
        .barWell{
          height: 110px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,.10);
          background: rgba(255,255,255,.04);
          overflow:hidden;
          display:flex;
          align-items:flex-end;
        }
        .barFill{
          width:100%;
          border-radius: 12px 12px 0 0;
          background: linear-gradient(180deg, rgba(120,180,255,.55), rgba(79,209,255,.18));
        }
        .barLab{
          font-size: 11px;
          text-align:center;
          color: rgba(255,255,255,.55);
          letter-spacing: 1px;
        }

        /* Expected revenue panel */
        .revLeft{
          flex: 1.1;
          display:flex;
          flex-direction:column;
          gap: 10px;
        }
        .revTitle{ color: rgba(255,255,255,.72); font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
        .revBig{ font-size: 40px; font-weight: 900; letter-spacing:.3px; }
        .revMeta{
          display:grid;
          gap: 10px;
          margin-top: 2px;
        }
        .revLine{
          display:flex; align-items:center; justify-content:space-between;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.06);
          color: rgba(255,255,255,.80);
        }
        .revLine b{ color: rgba(255,255,255,.92); }
        .revRight{
          flex: 0.9;
          display:grid;
          gap: 10px;
        }
        .revCard{
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.06);
        }
        .revCardTop{ display:flex; justify-content:space-between; color: rgba(255,255,255,.70); font-size: 12px; }
        .revCardVal{ display:flex; justify-content:space-between; margin-top: 6px; font-weight: 900; }
        .revCardVal span{ color: rgba(255,255,255,.92); }
        .revCardVal em{ font-style: normal; color: rgba(var(--blue), .85); }

        /* ===== OVERLAY (stable, no stacking) ===== */
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

        /* Row sizing (match reference proportions) */
        .kpiH{ height: clamp(110px, 11.5vw, 160px); }
        .panelH{ height: clamp(200px, 18vw, 260px); }

        @media (max-width: 980px){
          .rowGrid{ grid-template-columns: 1fr; }
          .cell{ --ry: 0deg !important; --tz: 26px !important; --tx: 0px !important; }
          .panelBody{ flex-direction:column; }
          .donutWrap{ justify-self:start; }
        }
      `}</style>

      <div className="page">
        <div className="stage">
          <div className="curveWrap">
            {/* TOP ROW (KPIs) */}
            <div className="rowGrid rowKpi">
              {row1.map((c, i) => (
                <GridCell key={c.id} col={i === 0 ? -1 : i === 1 ? 0 : 1} onOpen={() => setActiveId(c.id)}>
                  <CardRow1Kpi def={c} />
                </GridCell>
              ))}
            </div>

            {/* SECOND ROW (PANELS like reference image) */}
            <div className="rowGrid rowPanels">
              {row2.map((c, i) => (
                <GridCell key={c.id} col={i === 0 ? -1 : i === 1 ? 0 : 1} onOpen={() => setActiveId(c.id)}>
                  <CardRow2Panel def={c} />
                </GridCell>
              ))}
            </div>

            {/* Leave row 3 as you already had (still works) */}
            <div className="rowGrid rowBot" style={{ marginTop: 10 }}>
              {row3.map((c, i) => (
                <GridCell key={c.id} col={i === 0 ? -1 : i === 1 ? 0 : 1} onOpen={() => setActiveId(c.id)}>
                  <CardRow3 def={c} />
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
              className={`shell modal ${accentGlowClass(active.accent)}`}
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

function accentGlowClass(accent: Accent) {
  if (accent === "amber") return "amberGlow";
  if (accent === "green") return "greenGlow";
  return "blueGlow";
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

/* ===================== ROW 1 (KPIs) ===================== */
function CardRow1Kpi({ def }: { def: CardDef }) {
  return (
    <motion.div
      className={`shell ${accentGlowClass(def.accent)} kpiH`}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
    >
      <div className="kpiInner">
        <div className="kpiTop">
          <div className="kpiIcon">{def.icon}</div>
          <div className="kpiValue">
            {def.value}
            {def.unit ? <span className="kpiUnit">{def.unit}</span> : null}
          </div>
        </div>
        <div className="kpiLabel">{def.label}</div>
      </div>
    </motion.div>
  );
}

/* ===================== ROW 2 (PANELS like reference) ===================== */
function CardRow2Panel({ def }: { def: CardDef }) {
  return (
    <motion.div
      className={`shell ${accentGlowClass(def.accent)} panelH`}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
    >
      <div className="panelInner">
        <div className="panelHead">
          <div className="miniIco">{def.icon}</div>
          <div>{def.label}</div>
        </div>
        <div className="panelBody">
          {def.id === "rpmMonthly" ? <PanelAppointmentsToday /> : null}
          {def.id === "avgMinsMonthly" ? <PanelDonutAndBars /> : null}
          {def.id === "rpmBySize" ? <PanelExpectedRevenue /> : null}
        </div>
      </div>
    </motion.div>
  );
}

function PanelAppointmentsToday() {
  // demo values (wire to live data later)
  const scheduled = 18;
  const completed = 5;
  const noShows = 1;
  const late = 3;
  const total = scheduled;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div style={{ width: "100%" }}>
      <div className="apList">
        <div className="apRow">
          <div className="apLeft"><span className="apDot info" /> Scheduled</div>
          <div className="apVal">{scheduled}</div>
        </div>
        <div className="apRow">
          <div className="apLeft"><span className="apDot ok" /> Completed</div>
          <div className="apVal">{completed}</div>
        </div>
        <div className="apRow">
          <div className="apLeft"><span className="apDot bad" /> No-Shows</div>
          <div className="apVal">{noShows}</div>
        </div>
        <div className="apRow">
          <div className="apLeft"><span className="apDot warn" /> Late</div>
          <div className="apVal">{late}</div>
        </div>

        <div className="progressMeta">
          <div>Day Progress</div>
          <div>{completed} / {total}</div>
        </div>
        <div className="progress" aria-label="Day progress">
          <div style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

function PanelDonutAndBars() {
  const mins = [42, 45, 46, 46, 47];
  const labels = ["JAN", "FEB", "MAR", "APR", "MAY"];
  const max = Math.max(...mins);

  return (
    <>
      <div className="donutWrap">
        <div className="donut">
          <div className="donutCenter">
            <div>
              <div className="donutPct">82%</div>
              <div className="donutLab">Target</div>
              <div className="donutSub">Target 90%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="barsWrap">
        <div className="tinyBars">
          {labels.map((l, i) => {
            const v = mins[i];
            const h = Math.max(0.12, v / max);
            return (
              <div key={l} className="barCol">
                <div className="barTop">{v} mins</div>
                <div className="barWell">
                  <div className="barFill" style={{ height: `${h * 100}%` }} />
                </div>
                <div className="barLab">{l}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function PanelExpectedRevenue() {
  // demo values (wire to live data later)
  const expected = 1450;
  const profitAfterCommissions = 763;
  const tipsIncluded = 150;
  const commissionEstimate = 290;

  return (
    <>
      <div className="revLeft">
        <div className="revTitle">Expected revenue</div>
        <div className="revBig">${expected}</div>

        <div className="revMeta">
          <div className="revLine">
            <span>Profit After Commissions</span>
            <b>${profitAfterCommissions}</b>
          </div>
          <div className="revLine">
            <span>Tips Included</span>
            <b>${tipsIncluded}</b>
          </div>
          <div className="revLine">
            <span>Commission estimate</span>
            <b>${commissionEstimate}</b>
          </div>
        </div>
      </div>

      <div className="revRight">
        <div className="revCard">
          <div className="revCardTop">
            <span>Leperlhart</span>
            <span>Total</span>
          </div>
          <div className="revCardVal">
            <span>763 Total</span>
            <em>$648</em>
          </div>
        </div>

        <div className="revCard">
          <div className="revCardTop">
            <span>5 appts</span>
            <span>Canceled</span>
          </div>
          <div className="revCardVal">
            <span>Spommedgy</span>
            <em>$580</em>
          </div>
        </div>

        <div className="revCard">
          <div className="revCardTop">
            <span>6 month</span>
            <span>Minutes</span>
          </div>
          <div className="revCardVal">
            <span>feedhourt a9y</span>
            <em>$759</em>
          </div>
        </div>
      </div>
    </>
  );
}

/* ===================== ROW 3 (leave as-is for now) ===================== */
function CardRow3({ def }: { def: CardDef }) {
  const accentClass = accentGlowClass(def.accent);
  return (
    <motion.div
      className={`shell ${accentClass}`}
      style={{ height: 260 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
    >
      <div className="inner" style={{ padding: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 14px 10px", borderBottom: "1px solid rgba(255,255,255,.07)", background: "rgba(255,255,255,.02)", color: "rgba(255,255,255,.86)", fontSize: 13 }}>
          <div style={{ width: 8, height: 8, borderRadius: 3, background: def.accent === "amber" ? "rgba(var(--amber), .95)" : def.accent === "green" ? "rgba(var(--green), .95)" : "rgba(var(--blue), .95)" }} />
          <div>{def.label}</div>
        </div>
        <div style={{ padding: 14, height: "calc(100% - 44px)" }}>
          <div style={{ height: "100%", borderRadius: 12, border: "1px solid rgba(255,255,255,.08)", background: "linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02))", boxShadow: "0 0 0 1px rgba(0,0,0,.35) inset", padding: "10px 12px", overflow: "hidden" }}>
            <MiniContent def={def} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ===================== CONTENT ===================== */
function MiniContent({ def }: { def: CardDef }) {
  if (def.id === "earningsByBreed") return <MiniList rows={[["Golden Retrievers", "$1.77"], ["Cavaliers", "$1.72"], ["Dachshunds", "$1.65"]]} />;
  if (def.id === "topCombos") return <MiniList rows={[["Golden Retrievers Large", "$1.77"], ["Cavaliers Small", "$1.72"], ["Dachshunds Small", "$1.65"]]} />;
  if (def.id === "rpmMatrix") return <MiniMatrix />;
  return <div style={{ color: "rgba(255,255,255,.70)" }}>—</div>;
}

function ExpandedContent({ def }: { def: CardDef }) {
  // keep your existing expanded content behaviors
  if (def.id === "rpmMonthly") {
    return (
      <div style={{ color: "rgba(255,255,255,.78)", lineHeight: 1.6 }}>
        <h3 style={{ margin: "0 0 10px", fontWeight: 900 }}>Appointments Today</h3>
        <PanelAppointmentsToday />
      </div>
    );
  }
  if (def.id === "avgMinsMonthly") {
    return (
      <div style={{ color: "rgba(255,255,255,.78)", lineHeight: 1.6 }}>
        <h3 style={{ margin: "0 0 10px", fontWeight: 900 }}>Average Minutes per Appointment (Monthly)</h3>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: "0 0 220px" }}><PanelDonutAndBars /></div>
        </div>
      </div>
    );
  }
  if (def.id === "rpmBySize") {
    return (
      <div style={{ color: "rgba(255,255,255,.78)", lineHeight: 1.6 }}>
        <h3 style={{ margin: "0 0 10px", fontWeight: 900 }}>Expected revenue</h3>
        <PanelExpectedRevenue />
      </div>
    );
  }
  if (def.id === "earningsByBreed") {
    return (
      <>
        <h3 style={{ margin: "0 0 10px", fontWeight: 900 }}>Earnings by Breed</h3>
        <List
          rows={[
            ["Golden Retrievers", "$1.77"],
            ["Cavaliers", "$1.72"],
            ["Dachshunds", "$1.65"],
            ["Poodles", "$1.58"],
            ["Maltese", "$1.52"],
            ["Goldendoodles", "$1.35"],
            ["Labradors", "$1.35"],
          ]}
        />
      </>
    );
  }
  if (def.id === "topCombos") {
    return (
      <>
        <h3 style={{ margin: "0 0 10px", fontWeight: 900 }}>Top Performing Breed & Size Combinations</h3>
        <List rows={[["Golden Retrievers Large", "$1.77"], ["Cavaliers Small", "$1.72"], ["Dachshunds Small", "$1.65"]]} />
        <div style={{ margin: "12px 2px 10px", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: "rgba(var(--amber), .92)" }}>
          Lowest Performing Breed & Size Combinations
        </div>
        <List rows={[["Goldendoodles Large", "$1.22"], ["Labradors Large", "$1.18"], ["Mixed Breed XL", "$1.05"]]} />
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

function MiniList({ rows }: { rows: [string, string][] }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {rows.map(([a, b]) => (
        <div
          key={a}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 10,
            alignItems: "center",
            padding: "10px 10px",
            borderRadius: 12,
            background: "rgba(255,255,255,.03)",
            border: "1px solid rgba(255,255,255,.06)",
          }}
        >
          <div style={{ color: "rgba(255,255,255,.84)" }}>{a}</div>
          <div style={{ color: "rgba(255,255,255,.92)", fontWeight: 900, letterSpacing: ".2px" }}>{b}</div>
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
