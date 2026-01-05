import { motion } from 'framer-motion'
import { groomerData } from '../data/dashboardMockData'

interface GroomerAvgItemProps {
  groomer: typeof groomerData[0]
  delay: number
  dogsPerDay: number
  revenuePerDay: number
}

function GroomerAvgItem({ groomer, delay, dogsPerDay, revenuePerDay }: GroomerAvgItemProps) {
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
      className="flex items-center gap-6"
    >
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getBarColor(groomer.id)}`} />
      <div className="flex-shrink-0">
        <div className="text-xs font-semibold whitespace-nowrap">{groomer.name}</div>
      </div>
      <div className="flex items-center gap-3 text-xs ml-auto">
        <div className="text-right">
          <div className="font-bold">{dogsPerDay}</div>
          <div className="text-[10px] text-muted-foreground">dogs/day</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-primary">${revenuePerDay}</div>
          <div className="text-[10px] text-muted-foreground">revenue/day</div>
        </div>
      </div>
    </motion.div>
  )
}

export function GroomerAvgCard() {
  const groomerStats = groomerData.map(groomer => ({
    ...groomer,
    dogsPerDay: groomer.appointmentCount,
    revenuePerDay: Math.round(groomer.appointmentCount * 85 * (groomer.bookedPercentage / 100))
  }))

  return (
    <div className="space-y-3">
      {groomerStats.map((groomer, index) => (
        <GroomerAvgItem
          key={groomer.id}
          groomer={groomer}
          delay={index * 0.1}
          dogsPerDay={groomer.dogsPerDay}
          revenuePerDay={groomer.revenuePerDay}
        />
      ))}
    </div>
  )
}
