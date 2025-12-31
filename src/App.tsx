import { ArrowLeft, PencilSimple } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { StatWidget } from "@/components/StatWidget"
import { PetCard } from "@/components/PetCard"
import { ServiceHistoryCard } from "@/components/ServiceHistoryCard"
import { MedicalInfoCard } from "@/components/MedicalInfoCard"
import { GroomingPreferencesCard } from "@/components/GroomingPreferencesCard"

function App() {
  const pets = [
    {
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
    }
  ]

  const serviceHistory = [
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
  ]

  const vaccinations = [
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
  ]

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pets.map((pet, index) => (
            <PetCard key={pet.name} {...pet} index={index} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ServiceHistoryCard petName="Trying" services={serviceHistory} />
          
          <div className="space-y-4">
            <MedicalInfoCard
              petName="Trying"
              vaccinations={vaccinations}
              allergies={["Chicken", "Corn"]}
              medications={[]}
              notes="Sensitive skin - use hypoallergenic products only"
            />
            
            <GroomingPreferencesCard
              petName="Trying"
              haircut="Short summer cut"
              shampoo="Hypoallergenic"
              addOns={["Teeth brushing", "Paw balm", "De-shedding treatment"]}
              specialInstructions="Prefers gentle handling around ears. Give treats frequently during grooming."
              favoriteGroomer="Sarah J."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App