import { PawPrint, PencilSimple, DotsThree, Calendar, Syringe, Scissors, Heart } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface PetCardProps {
  name: string
  breed: string
  status: string
  temperament: string[]
  lastAppointment?: string
  nextVisit?: string
  age?: string
  weight?: string
  color?: string
  sex?: string
  index: number
}

export function PetCard({
  name,
  breed,
  status,
  temperament,
  lastAppointment,
  nextVisit,
  age,
  weight,
  color,
  sex,
  index
}: PetCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="p-3 border-border bg-card hover:border-primary/50 transition-all duration-200">
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-secondary transition-all duration-200"
          >
            <PencilSimple size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-secondary transition-all duration-200"
          >
            <DotsThree size={14} />
          </Button>
        </div>

        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-primary/20 text-primary">
              <PawPrint size={28} weight="fill" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <PawPrint size={18} weight="fill" className="text-primary" />
              {name}
            </h3>
            <p className="text-sm text-muted-foreground">{breed} • {status}</p>
            {temperament.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {temperament.map((trait) => (
                  <Badge
                    key={trait}
                    variant="secondary"
                    className="text-xs px-2 py-0.5 bg-secondary/50"
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {age && (
            <div className="bg-secondary/30 rounded-md p-2 border border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Age</p>
              <p className="text-sm font-semibold">{age}</p>
            </div>
          )}
          {weight && (
            <div className="bg-secondary/30 rounded-md p-2 border border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Weight</p>
              <p className="text-sm font-semibold">{weight}</p>
            </div>
          )}
          {color && (
            <div className="bg-secondary/30 rounded-md p-2 border border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Color</p>
              <p className="text-sm font-semibold">{color}</p>
            </div>
          )}
          {sex && (
            <div className="bg-secondary/30 rounded-md p-2 border border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Sex</p>
              <p className="text-sm font-semibold">{sex}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-secondary/30 rounded-md p-2 border border-border">
            <p className="text-xs font-medium mb-0.5 flex items-center gap-1">
              <Calendar size={12} className="text-primary" />
              Last appointment
            </p>
            <p className="text-sm text-muted-foreground">{lastAppointment || "—"}</p>
          </div>
          <div className="bg-secondary/30 rounded-md p-2 border border-border">
            <p className="text-xs font-medium mb-0.5 flex items-center gap-1">
              <Calendar size={12} className="text-primary" />
              Next visit
            </p>
            <p className="text-sm font-bold text-foreground">{nextVisit || "—"}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs transition-all duration-200 hover:scale-[1.02]"
          >
            Book Appointment
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="font-semibold text-xs transition-all duration-200 hover:scale-[1.02]"
          >
            Add Note
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="font-semibold text-xs transition-all duration-200 hover:scale-[1.02]"
          >
            Upload Photo
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
