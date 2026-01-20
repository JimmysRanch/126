import React from "react";

export default function GroomerPerformanceP6() {
  const data = {
    kpis: [
      { value: "64", unit: "mins", label: "AVG MINUTES / APPOINTMENT", accent: "clock", icon: "⏱" },
      { value: "$3.75", label: "REVENUE PER MIN | RPM", accent: "dollar", icon: "$" },
      { value: "75", label: "COMPLETED APPOINTMENTS", accent: "paw", icon: "🐾" },
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
        :root {
          --p6-bg-top: #1e2a3a;
          --p6-bg-bottom: #243142;
          --p6-card-bg: rgba(40, 55, 75, 0.6);
          --p6-card-border: rgba(70, 95, 130, 0.4);
          --p6-text: #f5e6d3;
          --p6-text-muted: rgba(245, 230, 211, 0.75);
          --p6-text-dim: rgba(245, 230, 211, 0.55);
          --p6-amber: #ffb44d;
          --p6-blue: #5eb3d1;
          --p6-green: #74d99e;
        }

        .p6-page {
          max-height: calc(100vh - 56px);
          padding: 14px 18px;
          overflow: hidden;
          color: var(--p6-text);
          background: linear-gradient(180deg, var(--p6-bg-top), var(--p6-bg-bottom));
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        }

        .p6-grid {
          height: 100%;
          max-width: 1540px;
          display: grid;
          grid-template-rows: auto auto 1fr;
          gap: 14px;
        }

        .p6-kpi-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .p6-kpi {
          border-radius: 12px;
          border: 1px solid var(--p6-card-border);
          background: var(--p6-card-bg);
          backdrop-filter: blur(10px);
          padding: 16px 20px;
          display: flex;
          gap: 16px;
        }

        .p6-kpi-icon {
          font-size: 26px;
          flex-shrink: 0;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }

        .p6-kpi-icon.clock {
          background: rgba(245, 230, 211, 0.12);
          color: var(--p6-text);
        }

        .p6-kpi-icon.dollar {
          background: rgba(255, 180, 77, 0.12);
          color: var(--p6-amber);
        }

        .p6-kpi-icon.paw {
          background: rgba(116, 217, 158, 0.12);
          color: var(--p6-green);
        }

        .p6-kpi-content {
          flex: 1;
          min-width: 0;
        }

        .p6-kpi-value {
          font-size: 38px;
          font-weight: 700;
          color: var(--p6-text);
        }

        .p6-kpi-value .unit {
          font-size: 18px;
          font-weight: 600;
          margin-left: 4px;
        }

        .p6-kpi-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.1px;
          text-transform: uppercase;
          color: var(--p6-text-muted);
          opacity: 0.85;
        }

        .p6-chart-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .p6-chart {
          border-radius: 12px;
          border: 1px solid var(--p6-card-border);
          background: var(--p6-card-bg);
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .p6-chart-header {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(70, 95, 130, 0.25);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .p6-chart-dot {
          width: 8px;
          height: 8px;
          border-radius: 2px;
        }

        .p6-chart-dot.blue {
          background: var(--p6-blue);
        }

        .p6-chart-dot.amber {
          background: var(--p6-amber);
        }

        .p6-chart-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--p6-text);
        }

        .p6-chart-body {
          flex: 1;
          padding: 14px 12px 12px;
          display: flex;
          align-items: flex-end;
          gap: 10px;
        }

        .p6-bar-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .p6-bar-value {
          font-size: 10px;
          font-weight: 700;
          color: var(--p6-text-muted);
          min-height: 16px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .p6-bar-track {
          width: 100%;
          height: 140px;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(70, 95, 130, 0.25);
          border-radius: 6px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }

        .p6-bar-fill {
          width: 100%;
          border-radius: 6px 6px 0 0;
        }

        .p6-bar-fill.blue {
          background: linear-gradient(180deg, var(--p6-blue), rgba(94, 179, 209, 0.3));
        }

        .p6-bar-fill.amber {
          background: linear-gradient(180deg, var(--p6-amber), rgba(255, 180, 77, 0.3));
        }

        .p6-bar-label {
          font-size: 10px;
          font-weight: 600;
          text-align: center;
          color: var(--p6-text-dim);
        }

        .p6-bottom-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          overflow: hidden;
        }

        .p6-bottom-card {
          border-radius: 12px;
          border: 1px solid var(--p6-card-border);
          background: var(--p6-card-bg);
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .p6-bottom-body {
          flex: 1;
          padding: 12px;
          overflow-y: auto;
        }

        .p6-list-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 12px;
          margin-bottom: 6px;
          background: rgba(70, 95, 130, 0.12);
          border: 1px solid rgba(70, 95, 130, 0.2);
          border-radius: 6px;
        }

        .p6-list-left {
          font-size: 12px;
          color: var(--p6-text-muted);
        }

        .p6-list-right {
          font-size: 13px;
          font-weight: 700;
          color: var(--p6-text);
        }

        .p6-section-title {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--p6-amber);
          margin: 12px 0 8px;
        }

        .p6-matrix {
          display: grid;
          gap: 6px;
        }

        .p6-matrix-header,
        .p6-matrix-row {
          display: grid;
          grid-template-columns: 1.2fr repeat(4, 0.8fr);
          gap: 6px;
          padding: 0 4px;
        }

        .p6-matrix-header {
          font-size: 9px;
          font-weight: 700;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--p6-text-dim);
        }

        .p6-matrix-cell {
          padding: 8px;
          background: rgba(70, 95, 130, 0.12);
          border: 1px solid rgba(70, 95, 130, 0.2);
          border-radius: 5px;
          text-align: center;
          font-size: 11px;
          font-weight: 700;
          color: var(--p6-text);
        }

        .p6-matrix-cell.breed {
          text-align: left;
          color: var(--p6-text-muted);
        }

        .p6-matrix-cell.empty {
          color: var(--p6-text-dim);
          font-weight: 500;
          background: transparent;
          border-radius: 3px;
        }

        .p6-bottom-body::-webkit-scrollbar {
          width: 5px;
        }

        .p6-bottom-body::-webkit-scrollbar-track {
          background: transparent;
        }

        .p6-bottom-body::-webkit-scrollbar-thumb {
          background: rgba(70, 95, 130, 0.4);
          border-radius: 3px;
        }

        .p6-bottom-body::-webkit-scrollbar-thumb:hover {
          background: rgba(70, 95, 130, 0.6);
        }

        @media (max-width: 1400px) {
          .p6-kpi-row,
          .p6-chart-row,
          .p6-bottom-row {
            grid-template-columns: 1fr;
          }
          .p6-page {
            overflow-y: auto;
          }
          .p6-grid {
            height: auto;
            grid-template-rows: auto auto auto;
          }
        }
      `}</style>

      <div className="p6-page">
        <div className="p6-grid">
          <div className="p6-kpi-row">
            {data.kpis.map((kpi, i) => (
              <div key={i} className="p6-kpi">
                <div className={`p6-kpi-icon ${kpi.accent}`}>
                  {kpi.icon}
                </div>
                <div className="p6-kpi-content">
                  <div className="p6-kpi-value">
                    {kpi.value}
                    {kpi.unit && <span className="unit">{kpi.unit}</span>}
                  </div>
                  <div className="p6-kpi-label">{kpi.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p6-chart-row">
            {data.charts.map((chart, i) => (
              <div key={i} className="p6-chart">
                <div className="p6-chart-header">
                  <div className={`p6-chart-dot ${chart.accent}`} />
                  <div className="p6-chart-title">{chart.title}</div>
                </div>
                <div className="p6-chart-body">
                  {chart.labels.map((label, j) => {
                    const max = Math.max(...chart.values);
                    const height = (chart.values[j] / max) * 100;
                    return (
                      <div key={j} className="p6-bar-group">
                        <div className="p6-bar-value">{chart.displayValues[j]}</div>
                        <div className="p6-bar-track">
                          <div
                            className={`p6-bar-fill ${chart.accent}`}
                            style={{ height: `${height}%` }}
                          />
                        </div>
                        <div className="p6-bar-label">{label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p6-bottom-row">
            <div className="p6-bottom-card">
              <div className="p6-chart-header">
                <div className="p6-chart-dot blue" />
                <div className="p6-chart-title">Earnings by Breed</div>
              </div>
              <div className="p6-bottom-body">
                {data.earningsByBreed.map((row, i) => (
                  <div key={i} className="p6-list-row">
                    <div className="p6-list-left">{row.left}</div>
                    <div className="p6-list-right">{row.right}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p6-bottom-card">
              <div className="p6-chart-header">
                <div className="p6-chart-dot amber" />
                <div className="p6-chart-title">{data.combos.topTitle}</div>
              </div>
              <div className="p6-bottom-body">
                {data.combos.topRows.map((row, i) => (
                  <div key={i} className="p6-list-row">
                    <div className="p6-list-left">{row.left}</div>
                    <div className="p6-list-right">{row.right}</div>
                  </div>
                ))}
                <div className="p6-section-title">{data.combos.bottomTitle}</div>
                {data.combos.bottomRows.map((row, i) => (
                  <div key={i} className="p6-list-row">
                    <div className="p6-list-left">{row.left}</div>
                    <div className="p6-list-right">{row.right}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p6-bottom-card">
              <div className="p6-chart-header">
                <div className="p6-chart-dot amber" />
                <div className="p6-chart-title">RPM by Breed & Size</div>
              </div>
              <div className="p6-bottom-body">
                <div className="p6-matrix">
                  <div className="p6-matrix-header">
                    <div>Breed</div>
                    {data.rpmMatrix.cols.map((col, i) => (
                      <div key={i}>{col}</div>
                    ))}
                  </div>
                  {data.rpmMatrix.rows.map((row, i) => (
                    <div key={i} className="p6-matrix-row">
                      <div className="p6-matrix-cell breed">{row.name}</div>
                      {row.cells.map((cell, j) => (
                        <div
                          key={j}
                          className={`p6-matrix-cell ${cell === "--" ? "empty" : ""}`}
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
