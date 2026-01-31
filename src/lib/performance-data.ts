import { PerformanceData } from "@/lib/performance-types"

export const DEFAULT_PERFORMANCE_DATA: PerformanceData = {
  kpis: [
    {
      value: "64",
      unit: "mins",
      label: "AVG MINUTES / APPOINTMENT",
      accent: "blue",
      icon: "⏱️",
    },
    {
      value: "$3.75",
      label: "REVENUE PER MIN | RPM",
      accent: "amber",
      icon: "💵",
    },
    {
      value: "75",
      label: "COMPLETED APPOINTMENTS",
      accent: "green",
      icon: "🐾",
    },
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
      title: "Average Minutes per Appointment (Monthly)",
      accent: "blue",
      labels: ["JAN", "FEB", "MAR", "APR", "MAY"],
      values: [42, 45, 46, 46, 47],
      suffix: " mins",
    },
    {
      title: "RPM by Dog Size",
      accent: "amber",
      labels: ["Small Dogs", "Medium Dogs", "Large Dogs"],
      values: [1.56, 1.95, 2.24],
      prefix: "$",
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
  topCombos: [
    { left: "Golden Retrievers Large", right: "$1.77" },
    { left: "Cavaliers Small", right: "$1.72" },
    { left: "Dachshunds Small", right: "$1.65" },
  ],
  bottomCombos: [
    { left: "Goldendoodles Large", right: "$1.22" },
    { left: "Labradors Large", right: "$1.18" },
    { left: "Mixed Breed XL", right: "$1.05" },
  ],
  matrixData: {
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
}
