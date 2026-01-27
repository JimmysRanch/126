import { useState, type CSSProperties } from "react"
import { motion } from "framer-motion"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type KPI = {
  icon?: string
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

type CardDetail = {
  title: string
  description: string
  items?: string[]
}

type MatrixData = {
  cols: string[]
  rows: Array<{ name: string; cells: Array<string | null> }>
}

type PerformanceData = {
  kpis: KPI[]
  charts: BarData[]
  earningsByBreed: ListItem[]
  topCombos: ListItem[]
  bottomCombos: ListItem[]
  matrixData: MatrixData
}

export const groomerPerformanceData: PerformanceData = {
  kpis: [
    { value: "$3.75", label: "REVENUE PER MIN | RPM", accent: "amber" },
    { icon: "⏱", value: "64", unit: "mins", label: "AVG MINUTES / APPOINTMENT", accent: "blue" },
    { value: "75", label: "COMPLETED APPOINTMENTS", accent: "green" },
  ],
  charts: [
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
      labels: ["Small", "Medium", "Large", "XL"],
      values: [1.56, 1.95, 2.24, 2.48],
      prefix: "$",
    },
  ],
  earningsByBreed: [
    { left: "Golden Retrievers", right: "$1.77" },
    { left: "Cavaliers", right: "$1.72" },
    { left: "Dachshunds", right: "$1.65" },
    { left: "Poodles", right: "$1.58" },
    { left: "Maltese", right: "$1.52" },
    { left: "Shih Tzus", right: "$1.49" },
    { left: "Yorkies", right: "$1.46" },
    { left: "Cocker Spaniels", right: "$1.44" },
    { left: "Schnauzers", right: "$1.41" },
    { left: "French Bulldogs", right: "$1.38" },
  ],
  topCombos: [
    { left: "Golden Retrievers Large", right: "$1.77" },
    { left: "Cavaliers Small", right: "$1.72" },
    { left: "Dachshunds Small", right: "$1.65" },
    { left: "Poodles Medium", right: "$1.62" },
    { left: "Shih Tzus Small", right: "$1.59" },
    { left: "Yorkies Small", right: "$1.56" },
    { left: "Cocker Spaniels Medium", right: "$1.53" },
    { left: "Schnauzers Medium", right: "$1.50" },
    { left: "Labradors Large", right: "$1.48" },
    { left: "French Bulldogs Small", right: "$1.46" },
  ],
  bottomCombos: [
    { left: "Goldendoodles Large", right: "$1.22" },
    { left: "Labradors Large", right: "$1.18" },
    { left: "Mixed Breed XL", right: "$1.05" },
    { left: "Great Danes XL", right: "$1.02" },
    { left: "Saint Bernards XL", right: "$1.00" },
    { left: "Bernese Mountain Dogs XL", right: "$0.98" },
    { left: "Newfoundlands XL", right: "$0.96" },
    { left: "Mastiffs XL", right: "$0.94" },
    { left: "Akitas Large", right: "$0.92" },
    { left: "Huskies Large", right: "$0.90" },
  ],
  matrixData: {
    cols: ["Small", "Medium", "Large", "XL"],
    rows: [
      { name: "Cavalier", cells: ["$1.72", null, null, null] },
      { name: "Dachshund", cells: ["$1.65", null, null, null] },
      { name: "Bichon Frise", cells: ["$1.58", "$1.41", "$1.41", "$1.48"] },
      { name: "Golden Retriever", cells: ["$1.58", "$1.52", "$1.60", "$1.61"] },
      { name: "Goldendoodle", cells: [null, "$1.55", "$1.60", null] },
      { name: "Labrador", cells: [null, "$1.42", "$1.48", "$1.50"] },
      { name: "Poodle", cells: ["$1.60", "$1.54", "$1.58", "$1.56"] },
      { name: "Shih Tzu", cells: ["$1.49", null, null, null] },
      { name: "Schnauzer", cells: ["$1.46", "$1.50", "$1.44", null] },
      { name: "French Bulldog", cells: ["$1.38", "$1.40", null, null] },
    ],
  },
}

export const teamPerformanceData: PerformanceData = {
  kpis: [
    { value: "$3.58", label: "TEAM RPM AVERAGE", accent: "amber" },
    { icon: "⏱", value: "67", unit: "mins", label: "TEAM AVG MINUTES", accent: "blue" },
    { value: "412", label: "TOTAL COMPLETED APPOINTMENTS", accent: "green" },
  ],
  charts: [
    {
      title: "RPM (Monthly)",
      accent: "blue",
      labels: ["JAN", "FEB", "MAR", "APR", "MAY"],
      values: [1.92, 1.88, 1.95, 2.01, 2.08],
      prefix: "$",
    },
    {
      title: "Average Minutes per Appointment",
      accent: "blue",
      labels: ["JAN", "FEB", "MAR", "APR", "MAY"],
      values: [45, 46, 44, 43, 42],
      suffix: "m",
    },
    {
      title: "RPM by Dog Size",
      accent: "amber",
      labels: ["Small", "Medium", "Large", "XL"],
      values: [1.48, 1.86, 2.12, 2.32],
      prefix: "$",
    },
  ],
  earningsByBreed: [
    { left: "Golden Retrievers", right: "$1.70" },
    { left: "Cavaliers", right: "$1.66" },
    { left: "Dachshunds", right: "$1.59" },
    { left: "Poodles", right: "$1.54" },
    { left: "Maltese", right: "$1.49" },
    { left: "Shih Tzus", right: "$1.45" },
    { left: "Yorkies", right: "$1.42" },
    { left: "Cocker Spaniels", right: "$1.40" },
    { left: "Schnauzers", right: "$1.37" },
    { left: "French Bulldogs", right: "$1.34" },
  ],
  topCombos: [
    { left: "Golden Retrievers Large", right: "$1.72" },
    { left: "Cavaliers Small", right: "$1.68" },
    { left: "Dachshunds Small", right: "$1.61" },
    { left: "Poodles Medium", right: "$1.58" },
    { left: "Shih Tzus Small", right: "$1.55" },
    { left: "Yorkies Small", right: "$1.52" },
    { left: "Cocker Spaniels Medium", right: "$1.49" },
    { left: "Schnauzers Medium", right: "$1.46" },
    { left: "Labradors Large", right: "$1.44" },
    { left: "French Bulldogs Small", right: "$1.41" },
  ],
  bottomCombos: [
    { left: "Goldendoodles Large", right: "$1.18" },
    { left: "Labradors Large", right: "$1.14" },
    { left: "Mixed Breed XL", right: "$1.02" },
    { left: "Great Danes XL", right: "$1.00" },
    { left: "Saint Bernards XL", right: "$0.98" },
    { left: "Bernese Mountain Dogs XL", right: "$0.96" },
    { left: "Newfoundlands XL", right: "$0.94" },
    { left: "Mastiffs XL", right: "$0.92" },
    { left: "Akitas Large", right: "$0.90" },
    { left: "Huskies Large", right: "$0.88" },
  ],
  matrixData: {
    cols: ["Small", "Medium", "Large", "XL"],
    rows: [
      { name: "Cavalier", cells: ["$1.68", null, null, null] },
      { name: "Dachshund", cells: ["$1.61", null, null, null] },
      { name: "Bichon Frise", cells: ["$1.52", "$1.36", "$1.38", "$1.40"] },
      { name: "Golden Retriever", cells: ["$1.55", "$1.48", "$1.56", "$1.58"] },
      { name: "Goldendoodle", cells: [null, "$1.50", "$1.55", null] },
      { name: "Labrador", cells: [null, "$1.40", "$1.44", "$1.46"] },
      { name: "Poodle", cells: ["$1.56", "$1.50", "$1.52", "$1.54"] },
      { name: "Shih Tzu", cells: ["$1.45", null, null, null] },
      { name: "Schnauzer", cells: ["$1.42", "$1.46", "$1.40", null] },
      { name: "French Bulldog", cells: ["$1.34", "$1.36", null, null] },
    ],
  },
}

type StaffPerformanceViewProps = {
  data?: PerformanceData
  scopeLabel?: string
  headerBackground?: string
}

export function StaffPerformanceView({
  data = groomerPerformanceData,
  scopeLabel = "this groomer",
  headerBackground,
}: StaffPerformanceViewProps) {
  const [selectedCard, setSelectedCard] = useState<CardDetail | null>(null)

  const { kpis, charts, earningsByBreed, topCombos, bottomCombos, matrixData } = data

  return (
    <>
      <style>{`
        .perf-wrap {
          padding: 0.75rem 0.75rem 0.5rem;
          height: calc(100vh - 9rem);
          max-height: calc(100vh - 9rem);
          overflow-x: visible;
          overflow-y: hidden;
          --perf-header-bg: #fde68a;
        }

        .perf-layout {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: 1fr 2fr 2fr 2fr;
          gap: 0.75rem;
          height: 100%;
        }

        .perf-card {
          height: 100%;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 0.75rem;
          box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.25), 0 0 18px rgba(56, 189, 248, 0.18);
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        .perf-card-button {
          cursor: pointer;
          transition: transform 150ms ease, box-shadow 150ms ease;
        }

        .perf-card-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.3), 0 0 24px rgba(56, 189, 248, 0.25);
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
          text-align: center;
          align-items: center;
        }

        .perf-kpi-top {
          display: flex;
          align-items: center;
          justify-content: center;
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
          text-align: center;
        }

        .perf-chart-card {
          position: relative;
          overflow: visible;
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
          padding: 0.35rem 0.6rem;
          border-radius: 0.6rem;
          background: var(--perf-header-bg);
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
          min-height: 0;
        }

        .perf-chart-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .perf-chart-value {
          font-size: 0.6875rem;
          text-align: center;
          color: hsl(var(--muted-foreground));
        }

        .perf-chart-bar {
          height: 6rem;
          border-radius: 0.625rem;
          border: none;
          background: hsl(var(--background));
          overflow: hidden;
          display: flex;
          align-items: flex-end;
        }

        .perf-chart-bar-fill {
          width: 100%;
          border-radius: 0.625rem 0.625rem 0 0;
          background: linear-gradient(180deg, rgba(56, 189, 248, 0.9), rgba(56, 189, 248, 0.35));
          box-shadow: 0 0.5rem 1.25rem rgba(56, 189, 248, 0.35);
          opacity: 1;
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
          padding: 0.35rem;
          overflow-y: auto;
        }

        .perf-list {
          display: grid;
          gap: 0.35rem;
        }

        .perf-list-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0.45rem;
          align-items: center;
          padding: 0.3rem 0.5rem;
          border-radius: 0.625rem;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          font-size: 0.8rem;
          line-height: 1.15;
        }

        .perf-list-row.rpm-breed {
          font-size: 0.9rem;
          line-height: 1.2;
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
          grid-template-columns: minmax(0, 1.6fr) repeat(4, minmax(0, 0.85fr));
          gap: 0.4rem;
          align-items: stretch;
        }

        .perf-matrix-head {
          color: hsl(var(--muted-foreground));
          font-size: 0.6875rem;
          letter-spacing: 0.0625rem;
          text-transform: uppercase;
          text-align: center;
        }

        .perf-matrix-head div:first-child {
          text-align: left;
        }

        .perf-matrix-breed,
        .perf-matrix-cell {
          padding: 0.35rem 0.5rem;
          border-radius: 0.625rem;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          min-height: 2.1rem;
        }

        .perf-matrix-breed {
          color: hsl(var(--foreground));
          text-align: left;
          font-weight: 600;
          font-size: 0.8rem;
        }

        .perf-matrix-cell {
          font-weight: 900;
          color: hsl(var(--foreground));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
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

      <div
        className="perf-wrap"
        style={
          headerBackground
            ? ({ "--perf-header-bg": headerBackground } as CSSProperties)
            : undefined
        }
      >
        <motion.div
          className="perf-layout"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {kpis.map((kpi, i) => (
            <div
              key={i}
              className={`perf-kpi-card perf-card perf-card-button perf-slot-${i + 1} ${kpi.accent}`}
              onClick={() =>
                setSelectedCard({
                  title: kpi.label,
                  description: `Current ${scopeLabel} value: ${kpi.value}${kpi.unit ? ` ${kpi.unit}` : ""}.`,
                })
              }
            >
              <div className="perf-kpi-inner">
                <div className="perf-kpi-top">
                  {kpi.icon && <div className="perf-icon">{kpi.icon}</div>}
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
            <div
              key={i}
              className={`perf-chart-card perf-card perf-card-button perf-slot-${i + 4} ${chart.accent}`}
              onClick={() =>
                setSelectedCard({
                  title: chart.title,
                  description: `Monthly performance snapshot for ${scopeLabel}.`,
                  items: chart.labels.map((label, index) => {
                    const value = chart.values[index]
                    const formattedValue = chart.prefix
                      ? `${chart.prefix}${value.toFixed(2)}`
                      : `${value.toFixed(0)}${chart.suffix ?? ""}`
                    return `${label}: ${formattedValue}`
                  }),
                })
              }
            >
              <div className="perf-chart-inner">
                <div className="perf-header">
                  <div className="perf-dot" />
                  <div>{chart.title}</div>
                </div>
                <div className="perf-chart-slot">
                  {chart.labels.map((label, j) => {
                    const value = chart.values[j]
                    const min = Math.min(...chart.values)
                    const max = Math.max(...chart.values)
                    const range = Math.max(0.01, max - min)
                    const height = Math.max(0.15, (value - min) / range)
                    return (
                      <div key={j} className="perf-chart-column">
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

          <div
            className="perf-list-card perf-card perf-card-button perf-slot-7 blue"
            onClick={() =>
              setSelectedCard({
                title: "RPM by Breed",
                description: `Average RPM contribution by breed for ${scopeLabel}.`,
                items: earningsByBreed.map((item) => `${item.left}: ${item.right}`),
              })
            }
          >
            <div className="perf-list-inner">
              <div className="perf-header">
                <div className="perf-dot" />
                <div>RPM by Breed</div>
              </div>
              <div className="perf-list-slot">
                <div className="perf-list">
                  {earningsByBreed.map((item, i) => (
                    <div key={i} className="perf-list-row rpm-breed">
                      <div className="perf-list-left">{item.left}</div>
                      <div className="perf-list-right">{item.right}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className="perf-list-card perf-card perf-card-button perf-slot-8 amber"
            onClick={() =>
              setSelectedCard({
                title: "Top Performing Breed & Size",
                description: `Highest RPM combinations for ${scopeLabel}.`,
                items: topCombos.map((item) => `${item.left}: ${item.right}`),
              })
            }
          >
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

          <div
            className="perf-list-card perf-card perf-card-button perf-slot-9 amber"
            onClick={() =>
              setSelectedCard({
                title: "Lowest Performing Breed & Size",
                description: `Lowest RPM combinations for ${scopeLabel}.`,
                items: bottomCombos.map((item) => `${item.left}: ${item.right}`),
              })
            }
          >
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

          <div
            className="perf-list-card perf-card perf-card-button perf-slot-10 amber"
            onClick={() =>
              setSelectedCard({
                title: "RPM by Breed & Size",
                description: `RPM matrix across breeds and size categories for ${scopeLabel}.`,
                items: matrixData.rows.map((row) => `${row.name}: ${row.cells.map((cell) => cell ?? "—").join(" | ")}`),
              })
            }
          >
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

      <Dialog open={Boolean(selectedCard)} onOpenChange={(open) => !open && setSelectedCard(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>{selectedCard?.title}</DialogTitle>
            <DialogDescription>{selectedCard?.description}</DialogDescription>
          </DialogHeader>
          {selectedCard?.items && (
            <ul className="space-y-2 text-sm text-foreground">
              {selectedCard.items.map((item) => (
                <li key={item} className="rounded-md border border-border bg-background/50 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
