export type KPI = {
  icon?: string
  value: string
  unit?: string
  label: string
  accent: "blue" | "amber" | "green"
}

export type BarData = {
  title: string
  accent: "blue" | "amber"
  labels: string[]
  values: number[]
  prefix?: string
  suffix?: string
}

export type ListItem = {
  left: string
  right: string
}

export type MatrixData = {
  cols: string[]
  rows: Array<{ name: string; cells: Array<string | null> }>
}

export type PerformanceData = {
  kpis: KPI[]
  charts: BarData[]
  earningsByBreed: ListItem[]
  topCombos: ListItem[]
  bottomCombos: ListItem[]
  matrixData: MatrixData
}

export const SEED_GROOMER_PERFORMANCE: PerformanceData = {
  kpis: [
    { icon: "$", value: "$3.75", label: "REVENUE PER MIN | RPM", accent: "amber" },
    { icon: "⏱", value: "64", unit: "mins", label: "AVG MINUTES / APPOINTMENT", accent: "blue" },
    { icon: "🐾", value: "75", label: "COMPLETED APPOINTMENTS", accent: "green" },
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

export const SEED_TEAM_PERFORMANCE: PerformanceData = {
  kpis: [
    { icon: "$", value: "$3.58", label: "TEAM RPM AVERAGE", accent: "amber" },
    { icon: "⏱", value: "67", unit: "mins", label: "TEAM AVG MINUTES", accent: "blue" },
    { icon: "🐾", value: "412", label: "TOTAL COMPLETED APPOINTMENTS", accent: "green" },
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
