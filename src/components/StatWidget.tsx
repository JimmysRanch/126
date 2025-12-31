import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

interface Stat {
  label: string
  value: string | number
}

interface StatWidgetProps {
  stats: Stat[]
  onClick?: () => void
}

export function StatWidget({ 
  stats, 
  onClick 
}: StatWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card 
        className="p-2 border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 cursor-pointer active:scale-[0.98]"
        onClick={onClick}
      >
        <div className="space-y-0.5">
          {stats.map((stat, index) => (
            <div key={stat.label}>
              <motion.div 
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
                <motion.p 
                  className="text-2xl font-bold"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.2 + index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  {stat.value}
                </motion.p>
              </motion.div>
              {index < stats.length - 1 && (
                <div className="h-px bg-primary/30 my-0.5" />
              )}
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
