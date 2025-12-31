import { ArrowLeft, PencilSimple, Plus } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { StatWidget } from "@/components/StatWidget"
import { PetCard } from "@/components/PetCard"
import { ServiceHistoryCard } from "@/components/ServiceHistoryCard"
import { MedicalInfoCard } from "@/components/MedicalInfoCard"
import { GroomingPreferencesCard } from "@/components/GroomingPreferencesCard"
import { PhotoGalleryCard } from "@/components/PhotoGalleryCard"
import { PaymentHistoryDialog } from "@/components/PaymentHistoryDialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

function App() {
  const pets = [
    {
      id: "1",
      name: "Trying",
      breed: "Labrador Retriever",
      status: "Active",
      temperament: ["Friendly", "Energetic", "Loves treats"],
      age: "3 yrs",
      weight: "65 lbs",
      color: "Yellow",
      sex: "Male",
      lastAppointment: "Jan 15, 2025",
      nextVisit: "Feb 12, 2025"
    },
    {
      id: "2",
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
      id: "3",
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

  const paymentHistory = [
    {
      id: "1",
      date: "Jan 15, 2025",
      total: "$175.00",
      paid: "$130.00",
      tip: "$45.00",
      method: "Credit Card",
      status: "Paid",
      pets: [
        {
          name: "Trying",
          services: ["Full Groom Package", "Bath", "Haircut", "Nail Trim"],
          cost: "$85.00"
        },
        {
          name: "Max",
          services: ["Bath Only", "Brush"],
          cost: "$45.00"
        }
      ]
    },
    {
      id: "2",
      date: "Jan 10, 2025",
      total: "$165.00",
      paid: "$120.00",
      tip: "$45.00",
      method: "Credit Card",
      status: "Paid",
      pets: [
        {
          name: "Luna",
          services: ["Luxury Spa Package", "Massage", "Blueberry Facial"],
          cost: "$120.00"
        }
      ]
    },
    {
      id: "3",
      date: "Dec 10, 2024",
      total: "$95.00",
      paid: "$50.00",
      tip: "$45.00",
      method: "Cash",
      status: "Paid",
      pets: [
        {
          name: "Trying",
          services: ["Bath & Brush", "Nail Trim"],
          cost: "$50.00"
        }
      ]
    },
    {
      id: "4",
      date: "Dec 5, 2024",
      total: "$125.00",
      paid: "$85.00",
      tip: "$40.00",
      method: "Credit Card",
      status: "Paid",
      pets: [
        {
          name: "Luna",
          services: ["Full Groom Package", "Ear Cleaning"],
          cost: "$85.00"
        }
      ]
    },
    {
      id: "5",
      date: "Nov 5, 2024",
      total: "$180.00",
      paid: "$130.00",
      tip: "$50.00",
      method: "Credit Card",
      status: "Paid",
      pets: [
        {
          name: "Trying",
          services: ["Full Groom Package", "Teeth Brushing"],
          cost: "$85.00"
        },
        {
          name: "Max",
          services: ["Bath & Brush", "Nail Trim"],
          cost: "$45.00"
        }
      ]
    }
  ]

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
          name: "Full Groom Package",
          date: "Jan 15, 2025",
          groomer: "Sarah J.",
          duration: "2h 30m",
          cost: "$85",
          services: ["Bath", "Haircut", "Nail Trim", "Ear Cleaning"],
          notes: "Did great! Very cooperative during nail trim."
        },
        {
          name: "Bath & Brush",
          date: "Dec 10, 2024",
          groomer: "Mike T.",
          duration: "1h 15m",
          cost: "$45",
          services: ["Bath", "Brush", "Nail Trim"],
          notes: "A bit anxious at first but settled down quickly."
        },
        {
          name: "Full Groom Package",
          date: "Nov 5, 2024",
          groomer: "Sarah J.",
          duration: "2h 45m",
          cost: "$85",
          services: ["Bath", "Haircut", "Nail Trim", "Ear Cleaning", "Teeth Brushing"]
        }
      ],
      vaccinations: [
        {
          type: "vaccine",
          name: "Rabies",
          date: "Mar 2024",
          nextDue: "Mar 2027"
        },
        {
          type: "vaccine",
          name: "DHPP",
          date: "Mar 2024",
          nextDue: "Mar 2025"
        },
        {
          type: "vaccine",
          name: "Bordetella",
          date: "Sep 2024",
          nextDue: "Sep 2025"
        }
      ],
      groomingPhotos: [
        {
          id: "1",
          beforeUrl: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400&h=400&fit=crop",
          afterUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop",
          date: "Jan 15, 2025",
          service: "Full Groom Package",
          groomer: "Sarah J."
        },
        {
          id: "2",
          beforeUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
          afterUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop",
          date: "Dec 10, 2024",
          service: "Bath & Brush",
          groomer: "Mike T."
        },
        {
          id: "3",
          beforeUrl: "https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=400&h=400&fit=crop",
          afterUrl: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400&h=400&fit=crop",
          date: "Nov 5, 2024",
          service: "Full Groom Package",
          groomer: "Sarah J."
        },
        {
          id: "4",
          beforeUrl: "https://images.unsplash.com/photo-1597633425046-08f5110420b5?w=400&h=400&fit=crop",
          afterUrl: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=400&h=400&fit=crop",
          date: "Oct 1, 2024",
          service: "Summer Cut Special",
          groomer: "Sarah J."
        }
      ],
      allergies: ["Chicken", "Corn"],
      medications: [],
      notes: "Sensitive skin - use hypoallergenic products only",
      haircut: "Short summer cut",
      shampoo: "Hypoallergenic",
      addOns: ["Teeth brushing", "Paw balm", "De-shedding treatment"],
      specialInstructions: "Prefers gentle handling around ears. Give treats frequently during grooming.",
      favoriteGroomer: "Sarah J."
    },
    "2": {
      serviceHistory: [
        {
          name: "Luxury Spa Package",
          date: "Jan 10, 2025",
          groomer: "Emma R.",
          duration: "3h 00m",
          cost: "$120",
          services: ["Bath", "Haircut", "Nail Trim", "Ear Cleaning", "Massage", "Blueberry Facial"],
          notes: "Absolutely loved the spa treatment. Very relaxed throughout."
        },
        {
          name: "Full Groom Package",
          date: "Dec 5, 2024",
          groomer: "Emma R.",
          duration: "2h 15m",
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
    "3": {
      serviceHistory: [
        {
          name: "Full Groom Package",
          date: "Jan 18, 2025",
          groomer: "Mike T.",
          duration: "2h 00m",
          cost: "$75",
          services: ["Bath", "Haircut", "Nail Trim", "Ear Cleaning"],
          notes: "Needed extra patience. Treats helped a lot with anxiety."
        },
        {
          name: "Bath Only",
          date: "Jan 2, 2025",
          groomer: "Mike T.",
          duration: "45m",
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

  const currentPet = pets.find(p => p.id === selectedPet)!
  const currentData = petData[selectedPet]

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-[1400px] mx-auto space-y-4">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="mt-1 hover:bg-secondary transition-all duration-200"
            >
              <ArrowLeft size={24} />
            </Button>
            <div>
              <h1 className="text-[32px] font-bold tracking-tight leading-none">
                George moodys
              </h1>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                CLIENT SINCE DEC 5, 2025
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200 hover:scale-[1.02]">
              Add Appointment
            </Button>
            <Button
              variant="secondary"
              className="font-semibold transition-all duration-200 hover:scale-[1.02]"
            >
              <Plus size={18} className="mr-2" />
              Add Pet
            </Button>
            <PaymentHistoryDialog clientName="George moodys" payments={paymentHistory} />
            <Button
              variant="secondary"
              className="font-semibold transition-all duration-200 hover:scale-[1.02]"
            >
              Contact
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-secondary transition-all duration-200"
            >
              <PencilSimple size={20} />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatWidget
            stats={[
              { label: "LIFETIME SPEND", value: "$8,520" },
              { label: "TOTAL APPTS", value: "24" }
            ]}
            onClick={() => console.log('Lifetime Spend clicked')}
          />

          <StatWidget
            stats={[
              { label: "AVG PER VISIT", value: "$355" },
              { label: "AVG TIP", value: "$45" }
            ]}
            onClick={() => console.log('Average per visit clicked')}
          />

          <StatWidget
            stats={[
              { label: "AVG INTERVAL", value: "29" },
              { label: "SINCE LAST VISIT", value: "12" }
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {pets.map((pet, index) => (
            <PetCard key={pet.id} {...pet} index={index} />
          ))}
        </div>

        <Tabs value={selectedPet} onValueChange={setSelectedPet} className="w-full">
          <div className="flex items-center justify-between mb-3">
            <TabsList className="bg-secondary/50">
              {pets.map((pet) => (
                <TabsTrigger key={pet.id} value={pet.id} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  {pet.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {pets.map((pet) => (
            <TabsContent key={pet.id} value={pet.id} className="space-y-4 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ServiceHistoryCard petName={pet.name} services={petData[pet.id].serviceHistory} />
                
                <PhotoGalleryCard petName={pet.name} photos={petData[pet.id].groomingPhotos} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <MedicalInfoCard
                  petName={pet.name}
                  vaccinations={petData[pet.id].vaccinations}
                  allergies={petData[pet.id].allergies}
                  medications={petData[pet.id].medications}
                  notes={petData[pet.id].notes}
                />
                
                <GroomingPreferencesCard
                  petName={pet.name}
                  haircut={petData[pet.id].haircut}
                  shampoo={petData[pet.id].shampoo}
                  addOns={petData[pet.id].addOns}
                  specialInstructions={petData[pet.id].specialInstructions}
                  favoriteGroomer={petData[pet.id].favoriteGroomer}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

export default App