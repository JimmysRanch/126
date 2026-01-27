import { motion } from 'framer-motion'
import { useKV } from "@github/spark/hooks"
import { groomerData } from '../data/dashboardMockData'

interface GroomerWorkloadItemProps {
  groomer: typeof groomerData[0]
  delay: number
}

function GroomerWorkloadItem({ groomer, delay }: GroomerWorkloadItemProps) {
  const totalMinutesInDay = 480
  const bookedMinutes = Math.round((groomer.bookedPercentage / 100) * totalMinutesInDay)

  const getBarColor = (groomerId: number) => {
    if (groomerId === 1) return 'from-pink-500 to-purple-500'
    if (groomerId === 2) return 'from-blue-500 to-cyan-500'
    return 'from-green-500 to-teal-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="space-y-0.5"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold truncate">{groomer.name}</div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span>{groomer.appointmentCount} appointments</span>
            <span>•</span>
            <span>{bookedMinutes}/{totalMinutesInDay} min</span>
          </div>
        </div>
        <div className="text-sm font-bold text-primary flex-shrink-0">
          {groomer.bookedPercentage}%
        </div>
      </div>

      <div className="relative h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${getBarColor(groomer.id)} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${groomer.bookedPercentage}%` }}
          transition={{ duration: 1, delay: delay + 0.2, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  )
}

export function GroomersWorkloadCard() {
  const [groomers] = useKV<typeof groomerData>("dashboard-groomer-data", groomerData)
  return (
    <div className="space-y-1.5 h-full flex flex-col justify-center">
      {(groomers || []).slice(0, 3).map((groomer, index) => (
        <GroomerWorkloadItem
          key={groomer.id}
          groomer={groomer}
          delay={index * 0.1}
        />
      ))}
    </div>
  )
}
