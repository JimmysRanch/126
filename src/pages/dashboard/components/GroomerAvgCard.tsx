import { motion } from 'framer-motion'

type GroomerLifetimeDataItem = {
  id: number
  groomerId: string
  name: string
  totalAppointments: number
  totalRevenue: number
  daysWorked: number
  avgDogsPerDay: number
  avgRevenuePerDay: number
}

interface GroomerAvgItemProps {
  groomer: GroomerLifetimeDataItem
  delay: number
}

function GroomerAvgItem({ groomer, delay }: GroomerAvgItemProps) {
  const getBarColor = (groomerId: number) => {
    if (groomerId === 1) return 'bg-pink-500'
    if (groomerId === 2) return 'bg-blue-500'
    return 'bg-green-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-center gap-1.5"
    >
      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getBarColor(groomer.id)}`} />
      <div className="flex-shrink-0 min-w-0 flex-1">
        <div className="text-[11px] font-semibold truncate">{groomer.name}</div>
      </div>
      <div className="flex items-center gap-1.5 text-[11px] flex-shrink-0">
        <div className="text-right">
          <div className="font-bold">{groomer.avgDogsPerDay}</div>
          <div className="text-[9px] text-muted-foreground">dogs/day</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-primary">${groomer.avgRevenuePerDay}</div>
          <div className="text-[9px] text-muted-foreground">revenue/day</div>
        </div>
      </div>
    </motion.div>
  )
}

interface GroomerAvgCardProps {
  data: GroomerLifetimeDataItem[]
}

export function GroomerAvgCard({ data }: GroomerAvgCardProps) {
  const groomers = data || []

  return (
    <div className="space-y-1.5 h-full flex flex-col justify-center">
      {groomers.slice(0, 3).map((groomer, index) => (
        <GroomerAvgItem
          key={groomer.id}
          groomer={groomer}
          delay={index * 0.1}
        />
      ))}
    </div>
  )
}
