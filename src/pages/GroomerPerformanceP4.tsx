import React from "react";

type KPI = { value: string; unit?: string; label: string; accent: "blue" | "amber" | "green"; icon?: React.ReactNode; subtitle?: string };
type BarSeries = { title: string; accent: "blue" | "amber"; labels: string[]; values: number[]; valueFmt?: (v: number) => string };
type ListRow = { left: string; right: string };
type SectionedList = { topTitle: string; topRows: ListRow[]; bottomTitle: string; bottomRows: ListRow[] };
type Matrix = { cols: string[]; rows: { name: string; cells: (string | null)[] }[] };

export default function GroomerPerformanceP4() {
  const data: {
    kpis: KPI[];
    charts: BarSeries[];
    earningsByBreed: ListRow[];
    combos: SectionedList;
    rpmMatrix: Matrix;
  } = {
    kpis: [
      { value: "64", unit: "mins", label: "AVG MINUTES / APPOINTMENT", accent: "blue", icon: <ClockIcon /> },
      { value: "$3.75", label: "REVENUE PER MIN | RPM", accent: "amber", icon: <DollarIcon /> },
      { value: "75", label: "COMPLETED APPOINTMENTS", accent: "green", icon: <PawIcon /> },
    ],
    charts: [
      {
        title: "RPM (Monthly)",
        accent: "blue",
        labels: ["JAN", "FEB", "MAR", "APR", "MAY"],
        values: [2.02, 1.92, 1.94, 1.96, 1.97],
        valueFmt: (v: number) => `$${v.toFixed(2)}`,
      },
      {
        title: "Average Minutes per Appointment (Monthly)",
        accent: "blue",
        labels: ["JAN", "FEB", "MAR", "APR", "MAY"],
        values: [42, 45, 46, 46, 47],
        valueFmt: (v: number) => `${Math.round(v)} mins`,
      },
      {
        title: "RPM by Dog Size",
        accent: "amber",
        labels: ["Small Dogs", "Medium Dogs", "Large Dogs"],
        values: [1.56, 1.95, 2.24],
        valueFmt: (v: number) => `$${v.toFixed(2)}`,
      },
    ],
    earningsByBreed: [
      { left: "Golden Retrievers", right: "$1.77" },
      { left: "Cavaliers", right: "$1.72" },
      { left: "Dachshunds", right: "$1.65" },
      { left: "Poodles", right: "$1.58" },
      { left: "Maltese", right: "$1.52" },
      { left: "Goldendoodles", right: "$1.35" },
      { left: "Labradors", right: "$1.35" },
    ],
    combos: {
      topTitle: "Top Performing Breed & Size Combinations",
      topRows: [
        { left: "Golden Retrievers Large", right: "$1.77" },
        { left: "Cavaliers Small", right: "$1.72" },
        { left: "Dachshunds Small", right: "$1.65" },
      ],
      bottomTitle: "Lowest Performing Breed & Size Combinations",
      bottomRows: [
        { left: "Golden Retrievers Large", right: "$1.77" },
        { left: "Cavaliers Small", right: "$1.72" },
        { left: "Dachshunds Small", right: "$1.65" },
      ],
    },
    rpmMatrix: {
      cols: ["Small", "Medium", "Large", "XL"],
      rows: [
        { name: "Cavalier", cells: ["$1.72", null, null, null] },
        { name: "Dachshund", cells: ["$1.65", null, null, null] },
        { name: "Bichon Frise", cells: ["$1.58", "$1.41", "$1.41", "$1.48"] },
        { name: "Golden Retriever", cells: ["$1.58", "$1.52", "$1.60", "$1.61"] },
        { name: "Goldendoodle", cells: [null, "$1.55", "$1.60", null] },
        { name: "Labradoodle", cells: ["$1.35", "$1.35", "$1.60", null] },
        { name: "Labrador", cells: ["$1.35", "$1.65", "$1.60", null] },
      ],
    },
  };

  return (
    <>
      <style>{`
        :root{
          --bg0:#050915;
          --bg1:#071326;

          --card0: rgba(10,14,22,.74);
          --card1: rgba(12,16,26,.62);

          --stroke: rgba(255,255,255,.12);
          --stroke2: rgba(255,255,255,.07);
          --text: rgba(255,255,255,.92);
          --muted: rgba(255,255,255,.72);
          --muted2: rgba(255,255,255,.50);

          --blue: 84, 210, 255;
          --amber: 255, 180, 77;
          --green: 116, 255, 158;

          --radius: 18px;
          --innerRadius: 14px;

          --gap: 18px;

          --kpiH: 124px;
          --midH: 262px;
          --botH: 268px;
        }

        *{ box-sizing:border-box; }
        .gpWrap{
          min-height: calc(100vh - 56px);
          padding: 26px 26px 40px;
          display:grid;
          place-items:center;
          color: var(--text);
          background:
            radial-gradient(1200px 760px at 50% 4%, rgba(120,140,255,.18), transparent 55%),
            radial-gradient(1000px 760px at 18% 74%, rgba(var(--blue), .12), transparent 58%),
            radial-gradient(1000px 760px at 88% 74%, rgba(var(--amber), .12), transparent 58%),
            radial-gradient(900px 560px at 50% 115%, rgba(0,0,0,.80), transparent 55%),
            linear-gradient(180deg, var(--bg0), var(--bg1));
        }

        .gpStage{
          width: min(1320px, 100%);
          position: relative;
        }

        .grid{
          position: relative;
          display:grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--gap);
          z-index: 2;
        }

        .row1{ height: var(--kpiH); }
        .row2{ height: var(--midH); }
        .row3{ height: var(--botH); }

        .pedestal{
          position:absolute;
          left: 0;
          right: 0;
          bottom: -6px;
          height: calc(var(--botH) + 62px);
          z-index: 1;
          pointer-events:none;
          filter: drop-shadow(0 22px 40px rgba(0,0,0,.60));
        }
        .pedestal::before{
          content:"";
          position:absolute;
          left: 3%;
          right: 3%;
          top: 32px;
          bottom: 0;
          border-radius: 24px;
          background:
            linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.02) 24%, rgba(0,0,0,.40) 100%);
          box-shadow:
            0 0 0 1px rgba(255,255,255,.07) inset,
            0 40px 90px rgba(0,0,0,.70);
        }
        .pedestal::after{
          content:"";
          position:absolute;
          left: 8%;
          right: 8%;
          top: 46px;
          height: 10px;
          border-radius: 999px;
          background: radial-gradient(closest-side, rgba(255,255,255,.14), transparent 70%);
          opacity:.35;
        }

        .card{
          position:relative;
          border-radius: var(--radius);
          padding: 12px;
          overflow:hidden;

          background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
          box-shadow:
            0 26px 70px rgba(0,0,0,.62),
            0 0 0 1px rgba(255,255,255,.07) inset;

          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        .card::before{
          content:"";
          position:absolute;
          inset: -2px;
          border-radius: calc(var(--radius) + 2px);
          pointer-events:none;
          background:
            radial-gradient(620px 260px at 18% 24%, rgba(var(--glow), .34), transparent 62%),
            radial-gradient(620px 260px at 84% 36%, rgba(255,255,255,.10), transparent 62%),
            linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.00) 40%);
          opacity: .95;
        }

        .card::after{
          content:"";
          position:absolute;
          inset: 0;
          border-radius: var(--radius);
          pointer-events:none;
          box-shadow:
            0 0 0 1px rgba(255,255,255,.10) inset,
            0 0 0 1px rgba(0,0,0,.35);
          opacity:.70;
        }

        .inner{
          position:relative;
          height:100%;
          border-radius: var(--innerRadius);
          border: 1px solid rgba(255,255,255,.10);
          background:
            radial-gradient(900px 320px at 20% 18%, rgba(255,255,255,.06), transparent 60%),
            radial-gradient(900px 420px at 80% 100%, rgba(0,0,0,.60), transparent 58%),
            linear-gradient(180deg, var(--card0), var(--card1));
          box-shadow:
            0 0 0 1px rgba(0,0,0,.40) inset,
            0 14px 34px rgba(0,0,0,.35);
          overflow:hidden;
        }

        .inner::before{
          content:"";
          position:absolute;
          inset: 0;
          border-radius: var(--innerRadius);
          pointer-events:none;
          background:
            linear-gradient(180deg, rgba(255,255,255,.14), transparent 30%),
            linear-gradient(0deg, rgba(0,0,0,.42), transparent 38%);
          opacity:.22;
        }

        .blue{ --glow: var(--blue); }
        .amber{ --glow: var(--amber); }
        .green{ --glow: var(--green); }

        .kpi{
          padding: 16px 18px;
          display:flex;
          flex-direction:column;
          justify-content:center;
          gap: 8px;
        }
        .kTop{ display:flex; align-items:center; gap: 12px; }
        .kIcon{
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display:grid;
          place-items:center;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(255,255,255,.05);
          box-shadow: 0 0 0 1px rgba(0,0,0,.30) inset;
          opacity:.95;
        }
        .kValue{
          display:flex;
          align-items:baseline;
          gap: 10px;
          font-weight: 900;
          font-size: 48px;
          line-height: 1;
          letter-spacing: .4px;
          text-shadow: 0 18px 40px rgba(0,0,0,.75);
          white-space:nowrap;
        }
        .kUnit{ font-size: 16px; font-weight: 800; opacity:.72; }
        .kLabel{
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,.76);
        }
        .kSub{ font-size: 12px; color: rgba(255,255,255,.52); }

        .hdr{
          height: 44px;
          padding: 12px 14px 0;
          display:flex;
          align-items:center;
          gap: 10px;
          color: rgba(255,255,255,.88);
          font-size: 13px;
          letter-spacing: .3px;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }
        .dot{
          width: 8px; height: 8px;
          border-radius: 3px;
          background: rgba(var(--glow), .95);
          box-shadow: 0 0 14px rgba(var(--glow), .30);
          flex:0 0 auto;
        }
        .body{
          padding: 8px 14px 14px;
          height: calc(100% - 44px);
        }
        .slot{
          height:100%;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,.10);
          background:
            linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
          box-shadow: 0 0 0 1px rgba(0,0,0,.40) inset;
          padding: 10px 12px;
          overflow:hidden;
        }

        .bars{
          height:100%;
          display:grid;
          grid-template-columns: repeat(var(--n), 1fr);
          gap: 14px;
          align-items:end;
        }
        .barWrap{
          height: 100%;
          display:grid;
          grid-template-rows: auto 1fr auto;
          gap: 10px;
        }
        .barVal{
          font-size: 12px;
          color: rgba(255,255,255,.74);
          text-align:center;
          white-space:nowrap;
        }
        .barTrack{
          height: 100%;
          border-radius: 12px;
          background: rgba(0,0,0,.20);
          border: 1px solid rgba(255,255,255,.08);
          box-shadow: 0 0 0 1px rgba(0,0,0,.35) inset;
          display:flex;
          align-items:flex-end;
          overflow:hidden;
        }
        .bar{
          width: 100%;
          border-radius: 12px 12px 0 0;
          background:
            linear-gradient(180deg,
              rgba(var(--glow), .55),
              rgba(var(--glow), .14));
          box-shadow:
            0 10px 24px rgba(0,0,0,.35) inset,
            0 0 0 1px rgba(255,255,255,.10) inset;
        }
        .barLbl{
          font-size: 12px;
          color: rgba(255,255,255,.70);
          text-align:center;
          letter-spacing: .8px;
        }

        .list{
          display:grid;
          gap: 10px;
        }
        .li{
          display:grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          align-items:center;
          padding: 10px 10px;
          border-radius: 12px;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.06);
        }
        .liL{ color: rgba(255,255,255,.86); }
        .liR{ color: rgba(255,255,255,.92); font-weight: 900; letter-spacing:.2px; }

        .sectionTitle{
          margin: 12px 2px 10px;
          font-size: 12px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(var(--glow), .95);
        }

        .matrix{
          display:grid;
          gap: 10px;
        }
        .mHead, .mRow{
          display:grid;
          grid-template-columns: 1.45fr repeat(4, .75fr);
          gap:10px;
          align-items:center;
        }
        .mHead{
          font-size: 12px;
          color: rgba(255,255,255,.62);
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .mBreed, .mCell{
          padding: 10px 10px;
          border-radius: 12px;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.06);
        }
        .mBreed{ color: rgba(255,255,255,.86); }
        .mCell{ text-align:center; font-weight: 900; color: rgba(255,255,255,.92); }
        .mCell.muted{ color: rgba(255,255,255,.36); font-weight: 700; }

        @media (max-width: 1100px){
          .grid{ grid-template-columns: 1fr; }
          .pedestal{ display:none; }
          .row1,.row2,.row3{ height:auto; }
        }
      `}</style>

      <div className="gpWrap">
        <div className="gpStage">
          <div className="pedestal" />
          <div className="grid">
            {data.kpis.map((k, i) => (
              <GlassCard key={i} accent={k.accent} heightVar="--kpiH">
                <div className="inner kpi">
                  <div className="kTop">
                    <div className="kIcon">{k.icon ?? "•"}</div>
                    <div className="kValue">
                      {k.value}
                      {k.unit ? <span className="kUnit">{k.unit}</span> : null}
                    </div>
                  </div>
                  <div className="kLabel">{k.label}</div>
                  {k.subtitle ? <div className="kSub">{k.subtitle}</div> : null}
                </div>
              </GlassCard>
            ))}

            {data.charts.map((c, i) => (
              <GlassCard key={i} accent={c.accent} heightVar="--midH">
                <div className="inner">
                  <div className="hdr">
                    <div className="dot" />
                    <div>{c.title}</div>
                  </div>
                  <div className="body">
                    <div className="slot">
                      <Bars labels={c.labels} values={c.values} valueFmt={c.valueFmt} />
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}

            <GlassCard accent="blue" heightVar="--botH">
              <div className="inner">
                <div className="hdr">
                  <div className="dot" />
                  <div>Earnings by Breed</div>
                </div>
                <div className="body">
                  <div className="slot">
                    <List rows={data.earningsByBreed} />
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard accent="amber" heightVar="--botH">
              <div className="inner">
                <div className="hdr">
                  <div className="dot" />
                  <div>Top Performing Breed &amp; Size Combinations</div>
                </div>
                <div className="body">
                  <div className="slot">
                    <div className="list">
                      <List rows={data.combos.topRows} />
                      <div className="sectionTitle">{data.combos.bottomTitle}</div>
                      <List rows={data.combos.bottomRows} />
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard accent="amber" heightVar="--botH">
              <div className="inner">
                <div className="hdr">
                  <div className="dot" />
                  <div>RPM by Breed &amp; Size</div>
                </div>
                <div className="body">
                  <div className="slot">
                    <MatrixTable matrix={data.rpmMatrix} />
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </>
  );
}

function GlassCard(props: { accent: "blue" | "amber" | "green"; heightVar: "--kpiH" | "--midH" | "--botH"; children: React.ReactNode }) {
  const cls = `card ${props.accent}`;
  return (
    <div className={cls} style={{ height: `var(${props.heightVar})` }}>
      {props.children}
    </div>
  );
}

function Bars(props: { labels: string[]; values: number[]; valueFmt?: (v: number) => string }) {
  const { labels, values, valueFmt } = props;
  const max = Math.max(...values);
  return (
    <div className="bars" style={{ ["--n" as any]: labels.length }}>
      {labels.map((lbl, i) => {
        const v = values[i] ?? 0;
        const pct = max > 0 ? Math.max(0.12, v / max) : 0.12;
        return (
          <div className="barWrap" key={lbl}>
            <div className="barVal">{valueFmt ? valueFmt(v) : String(v)}</div>
            <div className="barTrack">
              <div className="bar" style={{ height: `${pct * 100}%` }} />
            </div>
            <div className="barLbl">{lbl}</div>
          </div>
        );
      })}
    </div>
  );
}

function List(props: { rows: { left: string; right: string }[] }) {
  return (
    <div className="list">
      {props.rows.map((r) => (
        <div className="li" key={r.left}>
          <div className="liL">{r.left}</div>
          <div className="liR">{r.right}</div>
        </div>
      ))}
    </div>
  );
}

function MatrixTable(props: { matrix: Matrix }) {
  const { cols, rows } = props.matrix;
  return (
    <div className="matrix">
      <div className="mHead">
        <div>Breed</div>
        {cols.map((c) => (
          <div key={c}>{c}</div>
        ))}
      </div>
      {rows.map((r) => (
        <div className="mRow" key={r.name}>
          <div className="mBreed">{r.name}</div>
          {r.cells.map((cell, i) => (
            <div key={`${r.name}-${i}`} className={`mCell ${cell ? "" : "muted"}`}>
              {cell ?? "—"}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z" stroke="rgba(255,255,255,.75)" strokeWidth="1.8" />
      <path d="M12 6v6l4 2" stroke="rgba(255,255,255,.75)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function DollarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2v20M16.5 7.5c0-1.9-2-3.5-4.5-3.5S7.5 5.6 7.5 7.5 9 10 12 10s4.5 1.6 4.5 3.5S14.5 17 12 17 7.5 15.4 7.5 13.5"
        stroke="rgba(255,255,255,.75)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function PawIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 14.5c-1.7 0-3 1.2-3 2.7 0 2.2 3 3.8 8 3.8s8-1.6 8-3.8c0-1.5-1.3-2.7-3-2.7-1 0-1.8.4-2.3 1-.6.7-1.5 1.2-2.7 1.2s-2.1-.5-2.7-1.2c-.5-.6-1.3-1-2.3-1Z"
        fill="rgba(255,255,255,.70)"
      />
      <circle cx="7.5" cy="9" r="1.6" fill="rgba(255,255,255,.70)" />
      <circle cx="12" cy="7.5" r="1.6" fill="rgba(255,255,255,.70)" />
      <circle cx="16.5" cy="9" r="1.6" fill="rgba(255,255,255,.70)" />
      <circle cx="9.8" cy="11.2" r="1.2" fill="rgba(255,255,255,.70)" />
      <circle cx="14.2" cy="11.2" r="1.2" fill="rgba(255,255,255,.70)" />
    </svg>
  );
}
