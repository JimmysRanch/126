import { Card } from "@/components/ui/card"
import { Clock, CurrencyDollar, PawPrint } from "@phosphor-icons/react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const avgMinutesData = [
  { month: 'JAN', minutes: 42, rpm: 1.92 },
  { month: 'FEB', minutes: 45, rpm: 1.92 },
  { month: 'MAR', minutes: 46, rpm: 1.34 },
  { month: 'MAR', minutes: 46, rpm: 1.99 },
  { month: 'MAR', minutes: 46, rpm: 1.96 },
  { month: 'MAY', minutes: 47, rpm: 1.97 },
]

const rpmMonthlyData = [
  { month: 'JAN', rpm: 1.92 },
  { month: 'FEB', rpm: 1.92 },
  { month: 'MAR', rpm: 1.34 },
  { month: 'MAR', rpm: 1.99 },
  { month: 'MAR', rpm: 1.96 },
  { month: 'MAY', rpm: 1.97 },
]

const rpmBySizeData = [
  { size: 'Small Dogs', rpm: 1.56 },
  { size: 'Medium Dogs', rpm: 1.95 },
  { size: 'Large Dogs', rpm: 2.24 },
]

const earningsByBreedData = [
  { breed: 'Golden Retrievers', rpm: 1.77 },
  { breed: 'Cavaliers', rpm: 1.72 },
  { breed: 'Dachshunds', rpm: 1.65 },
  { breed: 'Poodles', rpm: 1.58 },
  { breed: 'Maltese', rpm: 1.58 },
  { breed: 'Goldendoodles', rpm: 1.52 },
  { breed: 'Labradors', rpm: 1.35 },
]

const topPerformingData = [
  { breed: 'Golden Retrievers Large', rpm: 1.77 },
  { breed: 'Cavaliers Small', rpm: 1.72 },
  { breed: 'Dachshunds Small', rpm: 1.65 },
]

const lowestPerformingData = [
  { breed: 'Golden Retrievers Large', rpm: 1.77 },
  { breed: 'Cavaliers Small', rpm: 1.72 },
  { breed: 'Dachshunds Small', rpm: 1.65 },
]

const rpmByBreedSizeData = [
  { breed: 'Poodle', small: null, medium: 1.72, large: null, xl: null },
  { breed: 'Cavalier', small: 1.72, medium: null, large: null, xl: null },
  { breed: 'Dachshund', small: 1.65, medium: null, large: null, xl: null },
  { breed: 'Bichon Frise', small: 1.58, medium: 1.41, large: 1.41, xl: 1.48 },
  { breed: 'Golden Retriever', small: 1.58, medium: 1.52, large: 1.60, xl: 1.61 },
  { breed: 'Goldendoodle', small: null, medium: 1.55, large: 1.60, xl: null },
  { breed: 'Labradoodle', small: 1.35, medium: 1.35, large: 1.60, xl: null },
  { breed: 'Labrador', small: 1.35, medium: 1.65, large: 1.60, xl: null },
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 border border-border rounded-lg p-2 shadow-lg backdrop-blur-sm">
        <p className="text-xs font-semibold text-foreground">
          {payload[0].payload.month || payload[0].payload.size || payload[0].payload.breed}
        </p>
        <p className="text-xs text-primary font-bold">
          {payload[0].dataKey === 'minutes' 
            ? `${payload[0].value} mins` 
            : `$${payload[0].value.toFixed(2)}`}
        </p>
      </div>
    )
  }
  return null
}

export function StaffPerformanceView() {
  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        <Card className="p-3 bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 bg-primary/15 rounded-lg">
                <Clock className="text-primary" size={18} weight="duotone" />
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Avg Minutes / Appointment
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">64 <span className="text-base text-muted-foreground">mins</span></div>
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-card via-card to-amber-500/5 border-2 border-amber-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 bg-amber-500/15 rounded-lg">
                <CurrencyDollar className="text-amber-500" size={18} weight="duotone" />
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Revenue Per Min | RPM
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">$3.75</div>
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-card via-card to-emerald-500/5 border-2 border-emerald-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 bg-emerald-500/15 rounded-lg">
                <PawPrint className="text-emerald-500" size={18} weight="duotone" />
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Completed Appointments
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">75</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
        <Card className="p-3 bg-card border-2 border-primary/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-2 h-2 bg-primary/50 rounded-sm" />
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">RPM (Monthly)</h3>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={rpmMonthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.35 0.05 250)" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: 'oklch(0.65 0.02 250)', fontSize: 9 }}
                  axisLine={{ stroke: 'oklch(0.35 0.05 250)' }}
                />
                <YAxis 
                  tick={{ fill: 'oklch(0.65 0.02 250)', fontSize: 9 }}
                  axisLine={{ stroke: 'oklch(0.35 0.05 250)' }}
                  domain={[1.90, 2.02]}
                  ticks={[1.90, 1.93, 1.96, 1.99, 2.02]}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="rpm" radius={[4, 4, 0, 0]}>
                  {rpmMonthlyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === rpmMonthlyData.length - 1 
                        ? 'oklch(0.75 0.15 195)' 
                        : 'oklch(0.50 0.12 240)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center mt-1.5 gap-1.5 text-[10px]">
              {rpmMonthlyData.map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="font-bold text-foreground">${item.rpm.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-card border-2 border-amber-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-2 h-2 bg-amber-500/50 rounded-full" />
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">Avg Minutes / Appt (Monthly)</h3>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={avgMinutesData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.35 0.05 250)" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: 'oklch(0.65 0.02 250)', fontSize: 9 }}
                  axisLine={{ stroke: 'oklch(0.35 0.05 250)' }}
                />
                <YAxis 
                  tick={{ fill: 'oklch(0.65 0.02 250)', fontSize: 9 }}
                  axisLine={{ stroke: 'oklch(0.35 0.05 250)' }}
                  domain={[30, 50]}
                  ticks={[30, 35, 40, 45, 50]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                  {avgMinutesData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === avgMinutesData.length - 1 
                        ? 'oklch(0.75 0.15 195)' 
                        : 'oklch(0.50 0.12 240)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center mt-1.5 gap-1.5 text-[10px]">
              {avgMinutesData.map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="font-bold text-foreground">{item.minutes} <span className="text-[9px] text-muted-foreground">ms</span></div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-card border-2 border-emerald-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-2 h-2 bg-emerald-500/50 rounded-sm" />
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">RPM by Dog Size</h3>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={rpmBySizeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.35 0.05 250)" opacity={0.3} />
                <XAxis 
                  dataKey="size" 
                  tick={{ fill: 'oklch(0.65 0.02 250)', fontSize: 9 }}
                  axisLine={{ stroke: 'oklch(0.35 0.05 250)' }}
                />
                <YAxis 
                  tick={{ fill: 'oklch(0.65 0.02 250)', fontSize: 9 }}
                  axisLine={{ stroke: 'oklch(0.35 0.05 250)' }}
                  domain={[1.90, 2.30]}
                  ticks={[1.90, 1.90, 1.90, 1.90, 2.30]}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="rpm" radius={[4, 4, 0, 0]}>
                  {rpmBySizeData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === rpmBySizeData.length - 1 
                        ? 'oklch(0.75 0.15 195)' 
                        : 'oklch(0.50 0.12 240)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center mt-1.5 gap-1.5 text-[10px]">
              {rpmBySizeData.map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="font-bold text-foreground">${item.rpm.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
        <Card className="p-3 bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20">
          <h3 className="text-sm font-bold text-foreground mb-2 tracking-wide">Earnings by Breed</h3>
          <div className="space-y-1.5">
            {earningsByBreedData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
                <span className="text-xs text-foreground font-medium">{item.breed}</span>
                <span className="text-sm font-bold text-foreground">${item.rpm.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-card via-card to-amber-500/5 border border-amber-500/20">
          <h3 className="text-sm font-bold text-amber-400 mb-1.5 tracking-wide">Top Performing Breed & Size</h3>
          <div className="space-y-1 mb-3">
            {topPerformingData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-1">
                <span className="text-xs text-foreground">{item.breed}</span>
                <span className="text-sm font-bold text-foreground">${item.rpm.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <h3 className="text-sm font-bold text-amber-400 mb-1.5 mt-3 tracking-wide">Lowest Performing Breed & Size</h3>
          <div className="space-y-1">
            {lowestPerformingData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-1">
                <span className="text-xs text-foreground">{item.breed}</span>
                <span className="text-sm font-bold text-foreground">${item.rpm.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-card via-card to-card border border-border">
          <h3 className="text-sm font-bold text-foreground mb-2 tracking-wide">RPM by Breed & Size</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-1 px-0.5 font-semibold text-muted-foreground">Breed</th>
                  <th className="text-center py-1 px-0.5 font-semibold text-muted-foreground">S</th>
                  <th className="text-center py-1 px-0.5 font-semibold text-muted-foreground">M</th>
                  <th className="text-center py-1 px-0.5 font-semibold text-muted-foreground">L</th>
                  <th className="text-center py-1 px-0.5 font-semibold text-muted-foreground">XL</th>
                </tr>
              </thead>
              <tbody>
                {rpmByBreedSizeData.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className={`border-b border-border/30 ${
                      row.breed.includes('Golden') ? 'bg-amber-500/10' : 
                      row.breed.includes('Labradoo') ? 'bg-amber-500/10' : 
                      row.breed.includes('Labrador') && !row.breed.includes('Labradoo') ? 'bg-amber-500/10' : ''
                    }`}
                  >
                    <td className="py-1 px-0.5 font-medium text-foreground text-[10px]">{row.breed}</td>
                    <td className="text-center py-1 px-0.5 text-foreground font-semibold">
                      {row.small ? `$${row.small.toFixed(2)}` : '--'}
                    </td>
                    <td className="text-center py-1 px-0.5 text-foreground font-semibold">
                      {row.medium ? `$${row.medium.toFixed(2)}` : '--'}
                    </td>
                    <td className="text-center py-1 px-0.5 text-foreground font-semibold">
                      {row.large ? `$${row.large.toFixed(2)}` : '--'}
                    </td>
                    <td className="text-center py-1 px-0.5 text-foreground font-semibold">
                      {row.xl ? `$${row.xl.toFixed(2)}` : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
