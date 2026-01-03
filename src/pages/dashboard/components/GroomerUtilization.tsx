import { motion } from 'framer-motion'
import { groomerData } from '../data/dashboardMockData'
import { formatTime } from '../utils/dashboardCalculations'

export function GroomerUtilization() {
  const workdayStart = 8
  const workdayEnd = 18
  const workdayHours = workdayEnd - workdayStart

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {groomerData.map((groomer, index) => (
          <motion.div
            key={groomer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-secondary/50 rounded-lg p-4 border border-border"
          >
            <div className="font-semibold text-sm mb-2">{groomer.name}</div>
            <div className="flex items-baseline gap-3 mb-1">
              <div className="text-2xl font-bold text-primary">{groomer.bookedPercentage}%</div>
              <div className="text-sm text-muted-foreground">{groomer.appointmentCount} appts</div>
            </div>
            <div className="text-xs text-muted-foreground">Last ends at {groomer.lastAppointmentEnd}</div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Daily Schedule
        </div>
        
        <div className="space-y-4">
          {groomerData.map((groomer, groomerIndex) => (
            <div key={groomer.id} className="space-y-2">
              <div className="text-sm font-medium">{groomer.name}</div>
              
              <div className="relative h-10 bg-secondary/30 rounded-lg">
                <div className="absolute inset-0 flex items-center px-2">
                  <div className="flex w-full justify-between text-[10px] text-muted-foreground">
                    <span>8am</span>
                    <span>10am</span>
                    <span>12pm</span>
                    <span>2pm</span>
                    <span>4pm</span>
                    <span>6pm</span>
                  </div>
                </div>
                
                {groomer.schedule.map((appointment, apptIndex) => {
                  const leftPercent = ((appointment.start - workdayStart) / workdayHours) * 100
                  const widthPercent = (appointment.duration / workdayHours) * 100
                  
                  return (
                    <motion.div
                      key={apptIndex}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: groomerIndex * 0.2 + apptIndex * 0.05,
                        ease: 'easeOut'
                      }}
                      className="absolute top-1 bottom-1 bg-primary rounded flex items-center justify-center overflow-hidden group origin-left"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    >
                      <div className="text-[9px] font-medium text-primary-foreground px-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {appointment.client}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
