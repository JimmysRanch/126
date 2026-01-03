import { motion } from 'framer-motion'
import { recentActivity } from '../data/dashboardMockData'
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

export function RecentActivity() {
  const groupedActivities = {
    today: recentActivity.filter(a => a.category === 'today'),
    yesterday: recentActivity.filter(a => a.category === 'yesterday'),
    thisWeek: recentActivity.filter(a => a.category === 'thisWeek'),
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedActivities).map(([category, activities]) => {
        if (activities.length === 0) return null
        
        const categoryTitle = category === 'today' ? 'Today' : category === 'yesterday' ? 'Yesterday' : 'This Week'
        
        return (
          <div key={category} className="space-y-3">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {categoryTitle}
            </div>
            
            <div className="space-y-2">
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
                    className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border cursor-pointer"
                  >
                    <div className={`mt-0.5 ${iconColor}`}>
                      <Icon size={20} weight="duotone" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{activity.description}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {activity.client}
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
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
