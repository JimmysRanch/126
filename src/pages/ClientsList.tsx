import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlass, Plus, PawPrint } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const mockClients = [
  {
    id: "1",
    name: "George moodys",
    email: "george.moodys@email.com",
    phone: "(555) 123-4567",
    pets: [
      { name: "Trying", breed: "Labrador Retriever" },
      { name: "Luna", breed: "Golden Retriever" },
      { name: "Max", breed: "Poodle Mix" }
    ],
    lastVisit: "Jan 15, 2025",
    nextVisit: "Feb 12, 2025",
    lifetimeSpend: "$8,520"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 234-5678",
    pets: [
      { name: "Bella", breed: "French Bulldog" }
    ],
    lastVisit: "Jan 20, 2025",
    nextVisit: "Feb 17, 2025",
    lifetimeSpend: "$3,240"
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "m.chen@email.com",
    phone: "(555) 345-6789",
    pets: [
      { name: "Charlie", breed: "Beagle" },
      { name: "Daisy", breed: "Cavalier King Charles" }
    ],
    lastVisit: "Jan 18, 2025",
    nextVisit: "Feb 15, 2025",
    lifetimeSpend: "$5,890"
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    phone: "(555) 456-7890",
    pets: [
      { name: "Rocky", breed: "German Shepherd" }
    ],
    lastVisit: "Jan 22, 2025",
    nextVisit: "Feb 19, 2025",
    lifetimeSpend: "$2,150"
  },
  {
    id: "5",
    name: "David Thompson",
    email: "d.thompson@email.com",
    phone: "(555) 567-8901",
    pets: [
      { name: "Coco", breed: "Pomeranian" },
      { name: "Milo", breed: "Shih Tzu" }
    ],
    lastVisit: "Jan 12, 2025",
    nextVisit: "Feb 9, 2025",
    lifetimeSpend: "$4,620"
  },
  {
    id: "6",
    name: "Jessica Martinez",
    email: "jess.martinez@email.com",
    phone: "(555) 678-9012",
    pets: [
      { name: "Buddy", breed: "Labrador Mix" }
    ],
    lastVisit: "Jan 25, 2025",
    nextVisit: "Feb 22, 2025",
    lifetimeSpend: "$1,840"
  },
  {
    id: "7",
    name: "Robert Kim",
    email: "rob.kim@email.com",
    phone: "(555) 789-0123",
    pets: [
      { name: "Zeus", breed: "Rottweiler" },
      { name: "Apollo", breed: "Doberman" }
    ],
    lastVisit: "Jan 8, 2025",
    nextVisit: "Feb 5, 2025",
    lifetimeSpend: "$6,310"
  },
  {
    id: "8",
    name: "Amanda Lee",
    email: "amanda.lee@email.com",
    phone: "(555) 890-1234",
    pets: [
      { name: "Princess", breed: "Maltese" }
    ],
    lastVisit: "Jan 19, 2025",
    nextVisit: "Feb 16, 2025",
    lifetimeSpend: "$3,890"
  }
]

export function ClientsList() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredClients = mockClients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.pets.some(pet => pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex-1 max-w-md relative">
            <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search clients or pets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200 hover:scale-[1.02]"
            onClick={() => navigate('/clients/new')}
          >
            <Plus size={18} className="mr-2" />
            Add New Client
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredClients.map((client) => (
            <Card
              key={client.id}
              className="p-5 bg-card border-border hover:border-primary/50 transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/clients/${client.id}`)}
            >
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold">{client.name}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      {client.pets.map((pet, index) => (
                        <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
                          <PawPrint size={12} weight="fill" />
                          {pet.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>{client.email}</span>
                    <span>{client.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-8 text-sm">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Last Visit
                    </div>
                    <div className="font-semibold">{client.lastVisit}</div>
                  </div>

                  <div className="text-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Next Visit
                    </div>
                    <div className="font-semibold">{client.nextVisit}</div>
                  </div>

                  <div className="text-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Lifetime Spend
                    </div>
                    <div className="font-semibold text-primary">{client.lifetimeSpend}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No clients found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  )
}
