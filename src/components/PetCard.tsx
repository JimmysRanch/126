import { useState } from "react"
import { PawPrint, PencilSimple, Calendar, Scissors, Star } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EditPetDialog } from "@/components/EditPetDialog"

interface PetCardProps {
  id: string
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
  haircut?: string
  shampoo?: string
  addOns?: string[]
  specialInstructions?: string
  favoriteGroomer?: string
}

export function PetCard({
  id,
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
  index,
  haircut,
  shampoo,
  addOns = [],
  specialInstructions,
  favoriteGroomer
}: PetCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className="h-full min-h-[320px] relative"
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative w-full h-full cursor-pointer z-10"
        style={{ transformStyle: "preserve-3d" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className="w-full h-full relative transition-transform duration-600"
          style={{ 
            transformStyle: "preserve-3d",
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          <Card 
            className="p-3 border-border bg-card hover:border-primary/50 transition-all duration-200 h-full"
            style={{ 
              backfaceVisibility: "hidden",
              position: isFlipped ? "absolute" : "relative",
              opacity: isFlipped ? 0 : 1
            }}
          >
            <div 
              className="absolute top-2 right-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <EditPetDialog
                petId={id}
                petName={name}
                breed={breed}
                age={age || ''}
                weight={weight || ''}
                color={color || ''}
                sex={sex || ''}
                haircut={haircut}
                shampoo={shampoo}
                favoriteGroomer={favoriteGroomer}
                specialInstructions={specialInstructions}
                temperament={temperament}
              />
            </div>

            <div className="mb-3">
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
                variant="secondary"
                className="font-semibold text-xs transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                Add Note
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="font-semibold text-xs transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                Upload Photo
              </Button>
            </div>

            <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground italic">
              Click to flip
            </div>
          </Card>

          <Card 
            className="p-3 border-border bg-card h-full"
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              position: isFlipped ? "relative" : "absolute",
              top: 0,
              left: 0,
              right: 0,
              opacity: isFlipped ? 1 : 0
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Scissors size={18} className="text-primary" weight="fill" />
                Grooming Preferences
              </h3>
              <div onClick={(e) => e.stopPropagation()}>
                <EditPetDialog
                  petId={id}
                  petName={name}
                  breed={breed}
                  age={age || ''}
                  weight={weight || ''}
                  color={color || ''}
                  sex={sex || ''}
                  haircut={haircut}
                  shampoo={shampoo}
                  favoriteGroomer={favoriteGroomer}
                  specialInstructions={specialInstructions}
                  temperament={temperament}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-secondary/30 rounded-md p-2 border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                    Preferred Cut
                  </p>
                  <p className="text-sm font-semibold">{haircut || "Not specified"}</p>
                </div>
                <div className="bg-secondary/30 rounded-md p-2 border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                    Shampoo
                  </p>
                  <p className="text-sm font-semibold">{shampoo || "Standard"}</p>
                </div>
              </div>

              {favoriteGroomer && (
                <div className="bg-secondary/30 rounded-md p-2 border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5 flex items-center gap-1">
                    <Star size={12} className="text-primary" weight="fill" />
                    Favorite Groomer
                  </p>
                  <p className="text-sm font-semibold">{favoriteGroomer}</p>
                </div>
              )}

              {specialInstructions && (
                <div className="bg-secondary/30 rounded-md p-2 border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Special Instructions
                  </p>
                  <p className="text-xs text-foreground">{specialInstructions}</p>
                </div>
              )}
            </div>

            <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground italic">
              Click to flip back
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
