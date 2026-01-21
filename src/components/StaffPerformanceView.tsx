import { motion } from "framer-motion"

type KPI = {
  icon: string
  value: string
  unit?: string
  label: string
  accent: "blue" | "amber" | "green"
}

type BarData = {
  title: string
  accent: "blue" | "amber"
  labels: string[]
  values: number[]
  prefix?: string
  suffix?: string
}

type ListItem = {
  left: string
  right: string
}

export function StaffPerformanceView() {
  const kpis: KPI[] = [
    { icon: "⏱", value: "64", unit: "mins", label: "AVG MINUTES / APPOINTMENT", accent: "blue" },
    { icon: "$", value: "$3.75", label: "REVENUE PER MIN | RPM", accent: "amber" },
    { icon: "🐾", value: "75", label: "COMPLETED APPOINTMENTS", accent: "green" },
  ]

  const charts: BarData[] = [
    {
      title: "RPM (Monthly)",
      accent: "blue",
      labels: ["JAN", "FEB", "MAR", "APR", "MAY"],
      values: [2.02, 1.92, 1.94, 1.96, 1.97],
      prefix: "$",
    },
    {
      title: "Average Minutes per Appointment",
      accent: "blue",
      labels: ["JAN", "FEB", "MAR", "APR", "MAY"],
      values: [42, 45, 46, 46, 47],
      suffix: "m",
    },
    {
      title: "RPM by Dog Size",
      accent: "amber",
      labels: ["Small", "Medium", "Large"],
      values: [1.56, 1.95, 2.24],
      prefix: "$",
    },
  ]

  const earningsByBreed: ListItem[] = [
    { left: "Golden Retrievers", right: "$1.77" },
    { left: "Cavaliers", right: "$1.72" },
    { left: "Dachshunds", right: "$1.65" },
    { left: "Poodles", right: "$1.58" },
    { left: "Maltese", right: "$1.52" },
  ]

  const topCombos: ListItem[] = [
    { left: "Golden Retrievers Large", right: "$1.77" },
    { left: "Cavaliers Small", right: "$1.72" },
    { left: "Dachshunds Small", right: "$1.65" },
  ]

  const bottomCombos: ListItem[] = [
    { left: "Goldendoodles Large", right: "$1.22" },
    { left: "Labradors Large", right: "$1.18" },
    { left: "Mixed Breed XL", right: "$1.05" },
  ]

  const matrixData = {
    cols: ["Small", "Medium", "Large", "XL"],
    rows: [
      { name: "Cavalier", cells: ["$1.72", null, null, null] },
      { name: "Dachshund", cells: ["$1.65", null, null, null] },
      { name: "Bichon Frise", cells: ["$1.58", "$1.41", "$1.41", "$1.48"] },
      { name: "Golden Retriever", cells: ["$1.58", "$1.52", "$1.60", "$1.61"] },
      { name: "Goldendoodle", cells: [null, "$1.55", "$1.60", null] },
    ],
  }

  return (
    <>
      <style>{`
        .perf-wrap {
          padding: 0.75rem 0 0.5rem;
          height: calc(100vh - 9.25rem);
          max-height: calc(100vh - 9.25rem);
        }

        .perf-layout {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: 1fr 2fr 2fr 2fr;
          gap: 1.125rem;
          height: 100%;
        }

        .perf-card {
          height: 100%;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 0.75rem;
          box-shadow: none;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        .perf-slot-1 {
          grid-column: 1;
          grid-row: 1;
        }

        .perf-slot-2 {
          grid-column: 2;
          grid-row: 1;
        }

        .perf-slot-3 {
          grid-column: 3;
          grid-row: 1;
        }

        .perf-slot-4 {
          grid-column: 1;
          grid-row: 2;
        }

        .perf-slot-5 {
          grid-column: 2;
          grid-row: 2;
        }

        .perf-slot-6 {
          grid-column: 3;
          grid-row: 2;
        }

        .perf-slot-7 {
          grid-column: 1;
          grid-row: 3 / span 2;
        }

        .perf-slot-8 {
          grid-column: 2;
          grid-row: 3;
        }

        .perf-slot-9 {
          grid-column: 2;
          grid-row: 4;
        }

        .perf-slot-10 {
          grid-column: 3;
          grid-row: 3 / span 2;
        }

        .perf-kpi-card {
          position: relative;
          overflow: hidden;
        }

        .perf-kpi-inner {
          position: relative;
          border-radius: 0.75rem;
          background: hsl(var(--card));
          border: none;
          box-shadow: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.375rem;
          height: 100%;
        }

        .perf-kpi-top {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .perf-icon {
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          display: grid;
          place-items: center;
          background: hsl(var(--secondary));
          border: none;
          box-shadow: none;
          color: hsl(var(--foreground));
        }

        .perf-value {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          font-weight: 800;
          letter-spacing: 0.019rem;
          font-size: 2rem;
          line-height: 1;
        }

        .perf-unit {
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.019rem;
          opacity: 0.75;
        }

        .perf-label {
          font-size: 0.6875rem;
          letter-spacing: 0.04rem;
          text-transform: none;
          color: hsl(var(--muted-foreground));
        }

        .perf-chart-card {
          position: relative;
          overflow: hidden;
        }

        .perf-chart-inner {
          position: relative;
          border-radius: 0.75rem;
          background: hsl(var(--card));
          border: none;
          box-shadow: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          height: 100%;
        }

        .perf-header {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.0125rem;
          color: hsl(var(--foreground));
          padding: 0;
        }

        .perf-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 0.1875rem;
          background: hsl(var(--primary));
          box-shadow: none;
        }

        .amber .perf-dot {
          background: hsl(var(--secondary));
          box-shadow: none;
        }

        .perf-chart-slot {
          flex: 1;
          border-radius: 0.75rem;
          background: hsl(var(--secondary));
          border: none;
          box-shadow: none;
          margin: 0;
          padding: 0.5rem;
          display: flex;
          align-items: flex-end;
          gap: 0.625rem;
        }

        .perf-chart-value {
          font-size: 0.6875rem;
          text-align: center;
          color: hsl(var(--muted-foreground));
        }

        .perf-chart-bar {
          height: 4.375rem;
          border-radius: 0.625rem;
          border: none;
          background: hsl(var(--card));
          overflow: hidden;
          display: flex;
          align-items: flex-end;
        }

        .perf-chart-bar-fill {
          width: 100%;
          border-radius: 0.625rem 0.625rem 0 0;
          background: hsl(var(--primary));
          opacity: 0.6;
        }

        .perf-chart-label {
          font-size: 0.625rem;
          text-align: center;
          letter-spacing: 0.0625rem;
          color: hsl(var(--muted-foreground));
        }

        .perf-list-card {
          position: relative;
          overflow: hidden;
        }

        .perf-list-inner {
          position: relative;
          border-radius: 0.75rem;
          background: hsl(var(--card));
          border: none;
          box-shadow: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          height: 100%;
        }

        .perf-list-slot {
          flex: 1;
          border-radius: 0.75rem;
          background: hsl(var(--secondary));
          border: none;
          box-shadow: none;
          margin: 0;
          padding: 0.5rem;
          overflow-y: auto;
        }

        .perf-list {
          display: grid;
          gap: 0.625rem;
        }

        .perf-list-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0.75rem;
          align-items: center;
          padding: 0.5rem 0.75rem;
          border-radius: 0.625rem;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
        }

        .perf-list-left {
          color: hsl(var(--foreground));
        }

        .perf-list-right {
          color: hsl(var(--foreground));
          font-weight: 900;
          letter-spacing: 0.0125rem;
        }

        .perf-section-title {
          margin: 0.5rem 0 0.25rem;
          font-size: 0.6875rem;
          letter-spacing: 0.0625rem;
          text-transform: uppercase;
          color: hsl(var(--muted-foreground));
        }

        .perf-matrix {
          display: grid;
          gap: 0.625rem;
        }

        .perf-matrix-head,
        .perf-matrix-row {
          display: grid;
          grid-template-columns: 1.45fr repeat(4, 0.75fr);
          gap: 0.625rem;
          align-items: center;
        }

        .perf-matrix-head {
          color: hsl(var(--muted-foreground));
          font-size: 0.6875rem;
          letter-spacing: 0.0625rem;
          text-transform: uppercase;
        }

        .perf-matrix-breed,
        .perf-matrix-cell {
          padding: 0.5rem 0.75rem;
          border-radius: 0.625rem;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
        }

        .perf-matrix-breed {
          color: hsl(var(--foreground));
        }

        .perf-matrix-cell {
          text-align: center;
          font-weight: 900;
          color: hsl(var(--foreground));
        }

        .perf-matrix-cell.muted {
          color: hsl(var(--muted-foreground));
          font-weight: 700;
        }

        @media (max-width: 1100px) {
          .perf-wrap {
            height: auto;
          }

          .perf-layout {
            grid-template-columns: 1fr;
            grid-template-rows: none;
            height: auto;
          }

          .perf-card {
            grid-column: auto;
            grid-row: auto;
            min-height: 12rem;
          }
        }
      `}</style>

      <div className="perf-wrap">
        <motion.div
          className="perf-layout"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {kpis.map((kpi, i) => (
            <div key={i} className={`perf-kpi-card perf-card perf-slot-${i + 1} ${kpi.accent}`}>
              <div className="perf-kpi-inner">
                <div className="perf-kpi-top">
                  <div className="perf-icon">{kpi.icon}</div>
                  <div className="perf-value">
                    {kpi.value}
                    {kpi.unit && <span className="perf-unit">{kpi.unit}</span>}
                  </div>
                </div>
                <div className="perf-label">{kpi.label}</div>
              </div>
            </div>
          ))}

          {charts.map((chart, i) => (
            <div key={i} className={`perf-chart-card perf-card perf-slot-${i + 4} ${chart.accent}`}>
              <div className="perf-chart-inner">
                <div className="perf-header">
                  <div className="perf-dot" />
                  <div>{chart.title}</div>
                </div>
                <div className="perf-chart-slot">
                  {chart.labels.map((label, j) => {
                    const value = chart.values[j]
                    const max = Math.max(...chart.values)
                    const height = Math.max(0.18, value / max)
                    return (
                      <div key={j} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                        <div className="perf-chart-value">
                          {chart.prefix ?? ""}{chart.prefix ? value.toFixed(2) : value.toFixed(0)}{chart.suffix ?? ""}
                        </div>
                        <div className="perf-chart-bar">
                          <div className="perf-chart-bar-fill" style={{ height: `${height * 100}%` }} />
                        </div>
                        <div className="perf-chart-label">{label}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}

          <div className="perf-list-card perf-card perf-slot-7 blue">
            <div className="perf-list-inner">
              <div className="perf-header">
                <div className="perf-dot" />
                <div>Earnings by Breed</div>
              </div>
              <div className="perf-list-slot">
                <div className="perf-list">
                  {earningsByBreed.map((item, i) => (
                    <div key={i} className="perf-list-row">
                      <div className="perf-list-left">{item.left}</div>
                      <div className="perf-list-right">{item.right}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="perf-list-card perf-card perf-slot-8 amber">
            <div className="perf-list-inner">
              <div className="perf-header">
                <div className="perf-dot" />
                <div>Top Performing Breed & Size</div>
              </div>
              <div className="perf-list-slot">
                <div className="perf-list">
                  {topCombos.map((item, i) => (
                    <div key={i} className="perf-list-row">
                      <div className="perf-list-left">{item.left}</div>
                      <div className="perf-list-right">{item.right}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="perf-list-card perf-card perf-slot-9 amber">
            <div className="perf-list-inner">
              <div className="perf-header">
                <div className="perf-dot" />
                <div>Lowest Performing Breed & Size</div>
              </div>
              <div className="perf-list-slot">
                <div className="perf-list">
                  {bottomCombos.map((item, i) => (
                    <div key={i} className="perf-list-row">
                      <div className="perf-list-left">{item.left}</div>
                      <div className="perf-list-right">{item.right}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="perf-list-card perf-card perf-slot-10 amber">
            <div className="perf-list-inner">
              <div className="perf-header">
                <div className="perf-dot" />
                <div>RPM by Breed & Size</div>
              </div>
              <div className="perf-list-slot">
                <div className="perf-matrix">
                  <div className="perf-matrix-head">
                    <div>Breed</div>
                    {matrixData.cols.map((col) => (
                      <div key={col}>{col}</div>
                    ))}
                  </div>
                  {matrixData.rows.map((row) => (
                    <div key={row.name} className="perf-matrix-row">
                      <div className="perf-matrix-breed">{row.name}</div>
                      {row.cells.map((cell, i) => (
                        <div key={i} className={`perf-matrix-cell ${cell ? "" : "muted"}`}>
                          {cell ?? "—"}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
