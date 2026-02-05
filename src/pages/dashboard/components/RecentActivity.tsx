import { motion } from 'framer-motion'
import { Calendar, XCircle, CurrencyDollar, Tag, Users } from '@phosphor-icons/react'

const iconMap = {
  booking: Calendar,
  cancellation: XCircle,
  pricing: CurrencyDollar,
  discount: Tag,
  staff: Users,
}

const colorMap = {
  booking: 'text-primary',
  cancellation: 'text-destructive',
  pricing: 'text-yellow-500',
  discount: 'text-green-500',
  staff: 'text-purple-500',
}

interface RecentActivityProps {
  data: Array<{
    id: string
    type: string
    category: string
    description: string
    client: string
    time: string
  }>
}

export function RecentActivity({ data }: RecentActivityProps) {
  const activity = data || []
  const groupedActivities = {
    today: activity.filter(a => a.category === 'today'),
    yesterday: activity.filter(a => a.category === 'yesterday'),
    thisWeek: activity.filter(a => a.category === 'thisWeek'),
  }

  return (
    <div className="space-y-2">
      {Object.entries(groupedActivities).map(([category, activities]) => {
        if (activities.length === 0) return null
        
        return (
          <div key={category} className="space-y-1">
            <div className="space-y-1">
              {activities.map((activity, index) => {
                const Icon = iconMap[activity.type as keyof typeof iconMap]
                const iconColor = colorMap[activity.type as keyof typeof colorMap]
                
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-2 p-1.5 rounded-lg bg-card border border-border cursor-pointer"
                  >
                    <div className={`mt-0.5 flex-shrink-0 ${iconColor}`}>
                      <Icon size={14} weight="duotone" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium leading-tight">{activity.description}</div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {activity.client}
                      </div>
                    </div>
                    
                    <div className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0">
                      {activity.time}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
