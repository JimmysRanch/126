import { Syringe, FirstAid, Warning, PencilSimple, PawPrint } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface MedicalRecord {
  type: string
  name: string
  date: string
  nextDue?: string
}

interface MedicalInfoCardProps {
  petName: string
  vaccinations: MedicalRecord[]
  allergies: string[]
  medications: MedicalRecord[]
  notes?: string
}

export function MedicalInfoCard({
  petName,
  vaccinations,
  allergies,
  medications,
  notes
}: MedicalInfoCardProps) {
  return (
    <Card className="p-3 border-border bg-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <FirstAid size={18} className="text-primary" weight="fill" />
          Medical Info - <PawPrint size={16} weight="fill" className="text-primary" />{petName}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-secondary transition-all duration-200"
        >
          <PencilSimple size={14} />
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 flex items-center gap-1">
            <Syringe size={12} className="text-primary" />
            Vaccinations
          </p>
          {vaccinations.length === 0 ? (
            <p className="text-sm text-muted-foreground">None recorded</p>
          ) : (
            <div className="space-y-1.5">
              {vaccinations.map((vax, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-secondary/30 rounded-md p-2 border border-border"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{vax.name}</p>
                      <p className="text-xs text-muted-foreground">Last: {vax.date}</p>
                    </div>
                    {vax.nextDue && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-primary/20 text-primary"
                      >
                        Due: {vax.nextDue}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 flex items-center gap-1">
            <Warning size={12} className="text-destructive" />
            Allergies & Sensitivities
          </p>
          {allergies.length === 0 ? (
            <p className="text-sm text-muted-foreground">None recorded</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {allergies.map((allergy) => (
                <Badge
                  key={allergy}
                  variant="destructive"
                  className="text-xs"
                >
                  {allergy}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {medications.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
              Current Medications
            </p>
            <div className="space-y-1.5">
              {medications.map((med, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-secondary/30 rounded-md p-2 border border-border"
                >
                  <p className="text-sm font-medium">{med.name}</p>
                  <p className="text-xs text-muted-foreground">Started: {med.date}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {notes && (
          <div className="bg-secondary/30 rounded-md p-2 border border-border">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Special Notes
            </p>
            <p className="text-sm text-foreground">{notes}</p>
          </div>
        )}
      </div>
    </Card>
  )
}
