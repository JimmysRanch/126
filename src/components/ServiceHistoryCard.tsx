import { Scissors, Calendar, Clock, User } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface Service {
  name: string
  date: string
  groomer: string
  duration: string
  cost: string
  services: string[]
  notes?: string
}

interface ServiceHistoryCardProps {
  petName: string
  services: Service[]
}

export function ServiceHistoryCard({ petName, services }: ServiceHistoryCardProps) {
  return (
    <Card className="p-3 border-border bg-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Scissors size={18} className="text-primary" weight="fill" />
          Service History - {petName}
        </h3>
      </div>

      <div className="space-y-2">
        {services.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No service history yet</p>
        ) : (
          services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-secondary/30 rounded-md p-2.5 border border-border hover:border-primary/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{service.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar size={12} />
                      {service.date}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <User size={12} />
                      {service.groomer}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={12} />
                      {service.duration}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-primary">{service.cost}</p>
              </div>

              <div className="flex flex-wrap gap-1 mb-1">
                {service.services.map((svc) => (
                  <Badge
                    key={svc}
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 bg-secondary/70"
                  >
                    {svc}
                  </Badge>
                ))}
              </div>

              {service.notes && (
                <p className="text-xs text-muted-foreground italic mt-1.5 border-t border-border/50 pt-1.5">
                  {service.notes}
                </p>
              )}
            </motion.div>
          ))
        )}
      </div>
    </Card>
  )
}
