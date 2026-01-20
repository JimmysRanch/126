import React from "react";

export default function GroomerPerformanceP6() {
  const data = {
    kpis: [
      { value: "64", unit: "mins", label: "AVG MINUTES / APPOINTMENT", accent: "blue", icon: "⏱" },
      { value: "$3.75", label: "REVENUE PER MIN | RPM", accent: "amber", icon: "$" },
      { value: "75", label: "COMPLETED APPOINTMENTS", accent: "green", icon: "🐾" },
    ],
    charts: [
      {
        title: "RPM (Monthly)",
        accent: "blue",
        labels: ["JAN", "FEB", "MAR", "APR", "MAY"],
        values: [1.92, 1.92, 1.84, 1.89, 1.86, 1.97],
        displayValues: ["$1.92", "$1.92", "$1.84", "$1.89", "$1.86", "$1.97"],
      },
      {
        title: "Average Minutes per Appointment (Monthly)",
        accent: "blue",
        labels: ["JAN", "FEB", "MAR", "APR", "MAY"],
        values: [43, 45, 46, 45, 47],
        displayValues: ["43 mins", "45 mins", "46 mins", "45 mins", "47 mins"],
      },
      {
        title: "RPM by Dog Size",
        accent: "amber",
        labels: ["Small Dogs", "Medium Dogs", "Large Dogs"],
        values: [1.56, 1.95, 2.24],
        displayValues: ["$1.56", "$1.95", "$2.24"],
      },
    ],
    earningsByBreed: [
      { left: "Golden Retrievers", right: "$1.77" },
      { left: "Cavaliers", right: "$1.72" },
      { left: "Dachshunds", right: "$1.65" },
      { left: "Poodles", right: "$1.58" },
      { left: "Maltese", right: "$1.52" },
      { left: "Goldendoodles", right: "$1.52" },
      { left: "Labradors", right: "$1.35" },
    ],
    combos: {
      topTitle: "Top Performing Breed & Size Combinations",
      topRows: [
        { left: "Golden Retrievers Large", right: "$1.77" },
        { left: "Cavaliers Small", right: "$1.72" },
        { left: "Dachshunds Small", right: "$1.65" },
        { left: "Goldendoodles Large", right: "$1.61" },
        { left: "Poodles Small", right: "$1.57" },
      ],
      bottomTitle: "Lowest Performing Breed & Size Combinations",
      bottomRows: [
        { left: "Labradoodles Small", right: "$1.35" },
        { left: "Labradors Medium", right: "$1.35" },
        { left: "Labradoodles Medium", right: "$1.35" },
        { left: "Poodles XL", right: "$1.34" },
        { left: "Maltese Medium", right: "$1.29" },
      ],
    },
    rpmMatrix: {
      cols: ["Small", "Medium", "Large", "XL"],
      rows: [
        { name: "Poodle", cells: ["$1.18", "$1.47", "--", "--"] },
        { name: "Cavailier", cells: ["$1.72", "--", "--", "--"] },
        { name: "Dachshund", cells: ["$1.65", "--", "--", "--"] },
        { name: "Bichon Frise", cells: ["$1.58", "--", "--", "--"] },
        { name: "Golden Ret", cells: ["$1.36", "$1.41", "$1.41", "$1.48"] },
        { name: "Goldendoodle", cells: ["--", "$1.52", "$1.52", "$1.61"] },
        { name: "Goldendoodle", cells: ["--", "$1.36", "$1.60", "--"] },
        { name: "Labradoodle", cells: ["$1.35", "$1.41", "$1.58", "--"] },
        { name: "Labradoodle", cells: ["$1.35", "$1.36", "$1.60", "--"] },
      ],
    },
  };

  return (
    <>
      <style>{`
        :root{
          --bg0:#0a1118;
          --bg1:#0d161f;

          --card-bg: rgba(15,25,35,.85);
          --card-border: rgba(60,100,140,.35);
          
          --text: rgba(255,255,255,.95);
          --text-muted: rgba(255,255,255,.70);
          --text-dim: rgba(255,255,255,.50);

          --amber: #ffb44d;
          --amber-glow: rgba(255,180,77,.25);
          --blue: #4fd1ff;
          --blue-glow: rgba(79,209,255,.25);
          --green: #74ff9e;
          
          --kpi-h: 132px;
          --chart-h: 310px;
          --bottom-h: 440px;
        }

        *{ box-sizing:border-box; margin:0; padding:0; }

        .p6-wrap{
          min-height: calc(100vh - 56px);
          padding: 22px;
          color: var(--text);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
          background: linear-gradient(180deg, var(--bg0), var(--bg1));
        }

        .p6-container{
          max-width: 1440px;
          margin: 0 auto;
          display: grid;
          gap: 16px;
        }

        .p6-row{
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .p6-card{
          border-radius: 12px;
          border: 1px solid var(--card-border);
          background: var(--card-bg);
          overflow: hidden;
        }

        .kpi-card{
          height: var(--kpi-h);
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          background: linear-gradient(135deg, rgba(60,100,140,.15), rgba(15,25,35,.45));
        }

        .kpi-icon-wrap{
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 26px;
          flex-shrink: 0;
        }
        .kpi-icon-wrap.amber{ background: var(--amber-glow); color: var(--amber); }
        .kpi-icon-wrap.blue{ background: var(--blue-glow); color: var(--blue); }
        .kpi-icon-wrap.green{ background: rgba(116,255,158,.25); color: var(--green); }

        .kpi-content{
          flex: 1;
          min-width: 0;
        }

        .kpi-value{
          font-size: 38px;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
        }
        .kpi-value .unit{
          font-size: 18px;
          font-weight: 700;
          margin-left: 4px;
          opacity: 0.8;
        }

        .kpi-label{
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .chart-card{
          height: var(--chart-h);
          display: flex;
          flex-direction: column;
        }

        .chart-header{
          padding: 14px 16px;
          border-bottom: 1px solid rgba(60,100,140,.20);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chart-dot{
          width: 8px;
          height: 8px;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .chart-dot.blue{ background: var(--blue); box-shadow: 0 0 8px var(--blue-glow); }
        .chart-dot.amber{ background: var(--amber); box-shadow: 0 0 8px var(--amber-glow); }

        .chart-title{
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
        }

        .chart-body{
          flex: 1;
          padding: 20px 16px 16px;
          display: flex;
          align-items: flex-end;
          gap: 12px;
        }

        .bar-group{
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: center;
        }

        .bar-value{
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
        }

        .bar-track{
          width: 100%;
          height: 180px;
          background: rgba(0,0,0,.25);
          border: 1px solid rgba(60,100,140,.20);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
        }

        .bar-fill{
          width: 100%;
          border-radius: 8px 8px 0 0;
        }
        .bar-fill.blue{
          background: linear-gradient(180deg, rgba(79,209,255,.55), rgba(79,209,255,.18));
        }
        .bar-fill.amber{
          background: linear-gradient(180deg, rgba(255,180,77,.55), rgba(255,180,77,.18));
        }

        .bar-label{
          font-size: 11px;
          font-weight: 600;
          color: var(--text-dim);
          text-align: center;
        }

        .bottom-card{
          height: var(--bottom-h);
          display: flex;
          flex-direction: column;
        }

        .bottom-body{
          flex: 1;
          padding: 16px;
          overflow-y: auto;
        }

        .list-row{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          margin-bottom: 8px;
          background: rgba(60,100,140,.08);
          border: 1px solid rgba(60,100,140,.15);
          border-radius: 8px;
        }

        .list-left{
          font-size: 13px;
          color: var(--text-muted);
        }

        .list-right{
          font-size: 14px;
          font-weight: 900;
          color: var(--text);
        }

        .section-title{
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--amber);
          margin: 16px 0 10px;
        }

        .matrix-table{
          display: grid;
          gap: 8px;
        }

        .matrix-header, .matrix-row{
          display: grid;
          grid-template-columns: 1.3fr repeat(4, 0.8fr);
          gap: 8px;
          align-items: center;
        }

        .matrix-header{
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--text-dim);
          padding: 0 4px;
        }

        .matrix-cell{
          padding: 10px;
          background: rgba(60,100,140,.08);
          border: 1px solid rgba(60,100,140,.15);
          border-radius: 6px;
          text-align: center;
          font-size: 13px;
          font-weight: 900;
          color: var(--text);
        }

        .matrix-cell.breed-name{
          text-align: left;
          font-weight: 600;
          color: var(--text-muted);
        }

        .matrix-cell.empty{
          color: var(--text-dim);
          font-weight: 600;
        }

        @media (max-width: 1100px){
          .p6-row{ grid-template-columns: 1fr; }
          .kpi-card, .chart-card, .bottom-card{ height: auto; }
        }
      `}</style>

      <div className="p6-wrap">
        <div className="p6-container">
          <div className="p6-row">
            {data.kpis.map((kpi, i) => (
              <div key={i} className="p6-card kpi-card">
                <div className={`kpi-icon-wrap ${kpi.accent}`}>
                  {kpi.icon}
                </div>
                <div className="kpi-content">
                  <div className="kpi-value">
                    {kpi.value}
                    {kpi.unit && <span className="unit">{kpi.unit}</span>}
                  </div>
                  <div className="kpi-label">{kpi.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p6-row">
            {data.charts.map((chart, i) => (
              <div key={i} className="p6-card chart-card">
                <div className="chart-header">
                  <div className={`chart-dot ${chart.accent}`} />
                  <div className="chart-title">{chart.title}</div>
                </div>
                <div className="chart-body">
                  {chart.labels.map((label, j) => {
                    const max = Math.max(...chart.values);
                    const height = (chart.values[j] / max) * 100;
                    return (
                      <div key={j} className="bar-group">
                        <div className="bar-value">{chart.displayValues[j]}</div>
                        <div className="bar-track">
                          <div 
                            className={`bar-fill ${chart.accent}`}
                            style={{ height: `${height}%` }}
                          />
                        </div>
                        <div className="bar-label">{label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p6-row">
            <div className="p6-card bottom-card">
              <div className="chart-header">
                <div className="chart-dot blue" />
                <div className="chart-title">Earnings by Breed</div>
              </div>
              <div className="bottom-body">
                {data.earningsByBreed.map((row, i) => (
                  <div key={i} className="list-row">
                    <div className="list-left">{row.left}</div>
                    <div className="list-right">{row.right}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p6-card bottom-card">
              <div className="chart-header">
                <div className="chart-dot amber" />
                <div className="chart-title">{data.combos.topTitle}</div>
              </div>
              <div className="bottom-body">
                {data.combos.topRows.map((row, i) => (
                  <div key={i} className="list-row">
                    <div className="list-left">{row.left}</div>
                    <div className="list-right">{row.right}</div>
                  </div>
                ))}
                <div className="section-title">{data.combos.bottomTitle}</div>
                {data.combos.bottomRows.map((row, i) => (
                  <div key={i} className="list-row">
                    <div className="list-left">{row.left}</div>
                    <div className="list-right">{row.right}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p6-card bottom-card">
              <div className="chart-header">
                <div className="chart-dot amber" />
                <div className="chart-title">RPM by Breed & Size</div>
              </div>
              <div className="bottom-body">
                <div className="matrix-table">
                  <div className="matrix-header">
                    <div>Breed</div>
                    {data.rpmMatrix.cols.map((col, i) => (
                      <div key={i}>{col}</div>
                    ))}
                  </div>
                  {data.rpmMatrix.rows.map((row, i) => (
                    <div key={i} className="matrix-row">
                      <div className="matrix-cell breed-name">{row.name}</div>
                      {row.cells.map((cell, j) => (
                        <div 
                          key={j} 
                          className={`matrix-cell ${cell === "--" ? "empty" : ""}`}
                        >
                          {cell}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
