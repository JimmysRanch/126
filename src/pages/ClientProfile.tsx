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

export function ClientProfile() {
  const navigate = useNavigate()
  const { clientId } = useParams()
  const isMobile = useIsMobile()

  const pets = [
    {
      id: "1",
      name: "Luna",
      breed: "Golden Retriever",
      status: "Active",
      temperament: ["Playful", "Gentle", "Water lover"],
      age: "5 yrs",
      weight: "58 lbs",
      color: "Golden",
      sex: "Female",
      lastAppointment: "Jan 10, 2025",
      nextVisit: "Feb 8, 2025"
    },
    {
      id: "2",
      name: "Max",
      breed: "Poodle Mix",
      status: "Active",
      temperament: ["Smart", "Anxious", "Food motivated"],
      age: "2 yrs",
      weight: "42 lbs",
      color: "Brown",
      sex: "Male",
      lastAppointment: "Jan 18, 2025",
      nextVisit: "Feb 15, 2025"
    }
  ]

  const [selectedPet, setSelectedPet] = useState(pets[0].id)

  interface MedicalRecord {
    type: string
    name: string
    date: string
    nextDue?: string
  }

  const petData: Record<string, {
    serviceHistory: any[]
    vaccinations: MedicalRecord[]
    groomingPhotos: any[]
    allergies: string[]
    medications: MedicalRecord[]
    notes: string
    haircut: string
    shampoo: string
    addOns: string[]
    specialInstructions: string
    favoriteGroomer: string
  }> = {
    "1": {
      serviceHistory: [
        {
          name: "Luxury Spa Package",
          date: "Jan 10, 2025",
          groomer: "Emma R.",
          startTime: "11:00 AM",
          cost: "$120",
          services: ["Bath", "Haircut", "Nail Trim", "Ear Cleaning", "Massage", "Blueberry Facial"],
          notes: "Absolutely loved the spa treatment. Very relaxed throughout."
        },
        {
          name: "Full Groom Package",
          date: "Dec 5, 2024",
          groomer: "Emma R.",
          startTime: "1:00 PM",
          cost: "$85",
          services: ["Bath", "Haircut", "Nail Trim", "Ear Cleaning"]
        }
      ],
      vaccinations: [
        {
          type: "vaccine",
          name: "Rabies",
          date: "Apr 2024",
          nextDue: "Apr 2027"
        },
        {
          type: "vaccine",
          name: "DHPP",
          date: "Apr 2024",
          nextDue: "Apr 2025"
        }
      ],
      groomingPhotos: [
        {
          id: "1",
          beforeUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop",
          afterUrl: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&h=400&fit=crop",
          date: "Jan 10, 2025",
          service: "Luxury Spa Package",
          groomer: "Emma R."
        },
        {
          id: "2",
          beforeUrl: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=400&fit=crop",
          afterUrl: "https://images.unsplash.com/photo-1612536981611-7687656ef8fc?w=400&h=400&fit=crop",
          date: "Dec 5, 2024",
          service: "Full Groom Package",
          groomer: "Emma R."
        }
      ],
      allergies: [],
      medications: [],
      notes: "Loves water and bath time. Very cooperative.",
      haircut: "Teddy bear cut",
      shampoo: "Oatmeal & Honey",
      addOns: ["Blueberry facial", "Massage", "Cologne"],
      specialInstructions: "Loves being pampered. Can add extra spa treatments anytime.",
      favoriteGroomer: "Emma R."
    },
    "2": {
      serviceHistory: [
        {
          name: "Full Groom Package",
          date: "Jan 18, 2025",
          groomer: "Mike T.",
          startTime: "3:45 PM",
          cost: "$75",
          services: ["Bath", "Haircut", "Nail Trim", "Ear Cleaning"],
          notes: "Needed extra patience. Treats helped a lot with anxiety."
        },
        {
          name: "Bath Only",
          date: "Jan 2, 2025",
          groomer: "Mike T.",
          startTime: "4:30 PM",
          cost: "$35",
          services: ["Bath", "Brush"],
          notes: "Quick bath to help with allergies. Did well."
        }
      ],
      vaccinations: [
        {
          type: "vaccine",
          name: "Rabies",
          date: "Jan 2024",
          nextDue: "Jan 2027"
        },
        {
          type: "vaccine",
          name: "DHPP",
          date: "Jan 2024",
          nextDue: "Jan 2025"
        },
        {
          type: "vaccine",
          name: "Bordetella",
          date: "Jul 2024",
          nextDue: "Jul 2025"
        }
      ],
      groomingPhotos: [
        {
          id: "1",
          beforeUrl: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&h=400&fit=crop",
          afterUrl: "https://images.unsplash.com/photo-1624395213043-fa2e123b2656?w=400&h=400&fit=crop",
          date: "Jan 18, 2025",
          service: "Full Groom Package",
          groomer: "Mike T."
        }
      ],
      allergies: ["Grass pollen", "Dust mites"],
      medications: [
        {
          type: "medication",
          name: "Apoquel 5mg daily",
          date: "Jan 2024"
        }
      ],
      notes: "Anxious around loud noises. Seasonal allergies require regular baths.",
      haircut: "Puppy cut (fluffy)",
      shampoo: "Medicated (prescribed)",
      addOns: ["Teeth brushing"],
      specialInstructions: "Needs calm environment. Take breaks if stressed. Use lots of treats and praise.",
      favoriteGroomer: "Mike T."
    }
  }

  const currentData = petData[selectedPet]

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
                  George moodys
                </h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1">
                  CLIENT SINCE DEC 5, 2025
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
                { label: "LIFETIME", value: "$8,520" },
                { label: "APPTS", value: "24" }
              ]}
              onClick={() => console.log('Lifetime Spend clicked')}
            />

            <StatWidget
              stats={[
                { label: "AVG VISIT", value: "$355" },
                { label: "AVG TIP", value: "$45" }
              ]}
              onClick={() => console.log('Average per visit clicked')}
            />

            <StatWidget
              stats={[
                { label: "INTERVAL", value: "29" },
                { label: "LAST VISIT", value: "12" }
              ]}
              onClick={() => console.log('Avg Interval clicked')}
            />

            <StatWidget
              stats={[
                { label: "NO-SHOWS", value: "2" },
                { label: "CANCELS", value: "4" }
              ]}
              onClick={() => console.log('No-shows clicked')}
            />

            <StatWidget
              stats={[
                { label: "LATE", value: "3" },
                { label: "LATE CANCELS", value: "1" }
              ]}
              onClick={() => console.log('Late arrivals clicked')}
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 pet-card-grid mb-6 sm:mb-8">
          {pets.map((pet, index) => (
            <PetCard 
              key={pet.id} 
              {...pet} 
              index={index}
              haircut={petData[pet.id].haircut}
              shampoo={petData[pet.id].shampoo}
              addOns={petData[pet.id].addOns}
              specialInstructions={petData[pet.id].specialInstructions}
              favoriteGroomer={petData[pet.id].favoriteGroomer}
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
                <ServiceHistoryCard petName={pet.name} services={petData[pet.id].serviceHistory} />
                
                <PhotoGalleryCard petName={pet.name} petId={pet.id} photos={petData[pet.id].groomingPhotos} />
              </div>

              <MedicalInfoCard
                petName={pet.name}
                vaccinations={petData[pet.id].vaccinations}
                allergies={petData[pet.id].allergies}
                medications={petData[pet.id].medications}
                notes={petData[pet.id].notes}
              />
            </TabsContent>
          ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
