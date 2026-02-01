import { ArrowLeft, PencilSimple, Plus, PawPrint } from "@phosphor-icons/react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { StatWidget } from "@/components/StatWidget"
import { PetCard } from "@/components/PetCard"
import { ServiceHistoryCard } from "@/components/ServiceHistoryCard"
import { MedicalInfoCard } from "@/components/MedicalInfoCard"
import { PhotoGalleryCard } from "@/components/PhotoGalleryCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useKV } from "@github/spark/hooks"
import { Client } from "@/lib/types"
import { formatInBusinessTimezone } from "@/lib/date-utils"

export function ClientProfile() {
  const navigate = useNavigate()
  const { clientId } = useParams()
  const isMobile = useIsMobile()
  const [clients] = useKV<Client[]>("clients", [])
  
  // Find the actual client data from the KV store
  const client = clients?.find(c => c.id === clientId)
  
  const pets = client ? client.pets.map(pet => ({
    id: pet.id,
    name: pet.name,
    breed: pet.breed,
    mixedBreed: pet.mixedBreed ?? "",
    status: "Active",
    temperament: pet.temperament ?? ([] as string[]),
    weight: pet.weight ? `${pet.weight} lbs` : "",
    color: pet.color ?? "",
    gender: pet.gender ?? "",
    birthday: pet.birthday ?? "",
    overallLength: pet.overallLength ?? "",
    faceStyle: pet.faceStyle ?? "",
    skipEarTrim: pet.skipEarTrim ?? false,
    skipTailTrim: pet.skipTailTrim ?? false,
    desiredStylePhoto: pet.desiredStylePhoto ?? "",
    groomingNotes: pet.groomingNotes ?? ""
  })) : []

  const [selectedPet, setSelectedPet] = useState(pets.length > 0 ? pets[0].id : "")

  interface MedicalRecord {
    type: string
    name: string
    date: string
    nextDue?: string
  }

  // Create data structure for each pet
  const petData: Record<string, {
    serviceHistory: any[]
    vaccinations: MedicalRecord[]
    groomingPhotos: any[]
    allergies: string[]
    medications: MedicalRecord[]
    notes: string
  }> = {}
  
  // Initialize data for each pet
  pets.forEach(pet => {
    const sourcePet = client.pets.find(item => item.id === pet.id)
    petData[pet.id] = {
      serviceHistory: [],
      vaccinations: [],
      groomingPhotos: [],
      allergies: [],
      medications: [],
      notes: ""
    }
  })
  
  // If client not found, show error message
  if (!client) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6">
        <div className="max-w-[1400px] mx-auto">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate('/clients')}
          >
            <ArrowLeft size={24} className="mr-2" />
            Back to Clients
          </Button>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Client Not Found</h1>
            <p className="text-muted-foreground">The client you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="bg-card/60 border-b border-border/50">
        <div className="max-w-[1400px] mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
          <header className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
              <Button
                variant="ghost"
                size="icon"
                className="mt-0.5 sm:mt-1 hover:bg-secondary transition-all duration-200 shrink-0"
                onClick={() => navigate('/clients')}
              >
                <ArrowLeft size={24} />
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-[32px] font-bold tracking-tight leading-none">
                  {client.name}
                </h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1">
                  Client Since {client.createdAt ? formatInBusinessTimezone(client.createdAt, 'M/d/yyyy') : "—"}
                </p>
              </div>
            </div>
            
            {isMobile ? (
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-colors duration-200 text-sm"
                  onClick={() => navigate(`/appointments/new?clientId=${clientId}`)}
                >
                  Add Appt
                </Button>
                <Button
                  variant="secondary"
                  className="font-semibold transition-colors duration-200 text-sm"
                  onClick={() => navigate(`/clients/${clientId}/add-pet`)}
                >
                  <Plus size={16} className="mr-1" />
                  Add Pet
                </Button>
                <Button
                  variant="secondary"
                  className="font-semibold transition-colors duration-200 text-sm"
                  onClick={() => navigate(`/clients/${clientId}/payment-history`)}
                >
                  Payment History
                </Button>
                <Button
                  variant="secondary"
                  className="font-semibold transition-colors duration-200 text-sm"
                  onClick={() => navigate(`/clients/${clientId}/contact`)}
                >
                  Contact
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-colors duration-200"
                  onClick={() => navigate(`/appointments/new?clientId=${clientId}`)}
                >
                  Add Appointment
                </Button>
                <Button
                  variant="secondary"
                  className="font-semibold transition-colors duration-200"
                  onClick={() => navigate(`/clients/${clientId}/add-pet`)}
                >
                  <Plus size={18} className="mr-2" />
                  Add Pet
                </Button>
                <Button
                  variant="secondary"
                  className="font-semibold transition-colors duration-200"
                  onClick={() => navigate(`/clients/${clientId}/payment-history`)}
                >
                  Payment History
                </Button>
                <Button
                  variant="secondary"
                  className="font-semibold transition-colors duration-200"
                  onClick={() => navigate(`/clients/${clientId}/contact`)}
                >
                  Contact
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-secondary transition-colors duration-200"
                  onClick={() => navigate(`/clients/${clientId}/edit`)}
                >
                  <PencilSimple size={20} />
                </Button>
              </div>
            )}
          </header>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
            <StatWidget
              stats={[
                { label: "LIFETIME", value: "$0" },
                { label: "APPTS", value: "0" }
              ]}
              onClick={() => console.log('Lifetime Spend clicked')}
            />

            <StatWidget
              stats={[
                { label: "AVG VISIT", value: "$0" },
                { label: "AVG TIP", value: "$0" }
              ]}
              onClick={() => console.log('Average per visit clicked')}
            />

            <StatWidget
              stats={[
                { label: "INTERVAL", value: "-" },
                { label: "LAST VISIT", value: "-" }
              ]}
              onClick={() => console.log('Avg Interval clicked')}
            />

            <StatWidget
              stats={[
                { label: "NO-SHOWS", value: "0" },
                { label: "CANCELS", value: "0" }
              ]}
              onClick={() => console.log('No-shows clicked')}
            />

            <StatWidget
              stats={[
                { label: "LATE", value: "0" },
                { label: "LATE CANCELS", value: "0" }
              ]}
              onClick={() => console.log('Late arrivals clicked')}
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">

        {pets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No pets added yet</p>
            <Button
              onClick={() => navigate(`/clients/${clientId}/add-pet`)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus size={18} className="mr-2" />
              Add First Pet
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 pet-card-grid mb-6 sm:mb-8">
              {pets.map((pet, index) => (
                <PetCard 
                  key={pet.id} 
                  {...pet} 
                  index={index}
                />
              ))}
            </div>

            <div className="pt-3 sm:pt-4 border-t border-border">
              <Tabs value={selectedPet} onValueChange={setSelectedPet} className="w-full relative z-0">
              <div className="flex items-center justify-between mb-3">
                <TabsList className="bg-secondary/50 w-full sm:w-auto overflow-x-auto">
                  {pets.map((pet) => (
                    <TabsTrigger 
                      key={pet.id} 
                      value={pet.id} 
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm"
                    >
                      <PawPrint size={14} weight="fill" className="mr-1 sm:mr-1.5" />
                      {pet.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {pets.map((pet) => (
                <TabsContent key={pet.id} value={pet.id} className="space-y-3 sm:space-y-4 mt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    <ServiceHistoryCard petName={pet.name} services={petData[pet.id]?.serviceHistory || []} />
                    
                    <PhotoGalleryCard petName={pet.name} petId={pet.id} photos={petData[pet.id]?.groomingPhotos || []} />
                  </div>

                  <MedicalInfoCard
                    petName={pet.name}
                    vaccinations={petData[pet.id]?.vaccinations || []}
                    allergies={petData[pet.id]?.allergies || []}
                    medications={petData[pet.id]?.medications || []}
                    notes={petData[pet.id]?.notes || ""}
                  />
                </TabsContent>
              ))}
              </Tabs>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
