import { Syringe, FirstAid, Warning, PencilSimple, PawPrint } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useIsMobile } from "@/hooks/use-mobile"

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
  const isMobile = useIsMobile()
  
  return (
    <motion.div className="relative">
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 blur-xl pointer-events-none"
        animate={{
          opacity: [0.05, 0.09, 0.05],
          background: [
            "radial-gradient(circle at 60% 40%, oklch(0.75 0.15 195 / 0.26), transparent 65%)",
            "radial-gradient(circle at 40% 60%, oklch(0.75 0.15 195 / 0.31), transparent 65%)",
            "radial-gradient(circle at 50% 50%, oklch(0.75 0.15 195 / 0.28), transparent 65%)",
            "radial-gradient(circle at 60% 40%, oklch(0.75 0.15 195 / 0.26), transparent 65%)"
          ]
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <Card className="p-3 border-border bg-card relative z-10">
        <div className="flex items-center justify-between mb-3">
        <h3 className={`${isMobile ? "text-base" : "text-lg"} font-bold flex items-center gap-1.5 sm:gap-2 min-w-0`}>
          <FirstAid size={isMobile ? 16 : 18} className="text-primary shrink-0" weight="fill" />
          <span className="flex items-center gap-1 sm:gap-1.5 min-w-0">
            <span className={isMobile ? "hidden" : "inline"}>Medical Info - </span>
            <PawPrint size={isMobile ? 14 : 16} weight="fill" className="text-primary shrink-0" />
            <span className="truncate">{petName}</span>
          </span>
        </h3>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-secondary transition-all duration-200 shrink-0"
          >
            <PencilSimple size={14} />
          </Button>
        )}
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
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{vax.name}</p>
                      <p className="text-xs text-muted-foreground">Last: {vax.date}</p>
                    </div>
                    {vax.nextDue && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-primary/20 text-primary shrink-0"
                      >
                        {isMobile ? vax.nextDue : `Due: ${vax.nextDue}`}
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
            Allergies
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
    </motion.div>
  )
}
