import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlass, Plus, PawPrint, Phone, Envelope } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useIsMobile } from "@/hooks/use-mobile"
import { useKV } from "@github/spark/hooks"
import { ClientRecord, SEED_CLIENTS } from "@/lib/seed-data"

export function ClientsList() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const isMobile = useIsMobile()
  const [clients] = useKV<ClientRecord[]>("clients", SEED_CLIENTS)

  const filteredClients = (clients || []).filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.pets.some(pet => pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 max-w-full sm:max-w-md relative">
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
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200 hover:scale-[1.02] w-full sm:w-auto"
            onClick={() => navigate('/clients/new')}
          >
            <Plus size={18} className="mr-2" />
            {isMobile ? "Add Client" : "Add New Client"}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredClients.map((client) => (
            <Card
              key={client.id}
              className="p-3 sm:p-5 bg-card border-border hover:border-primary/50 transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/clients/${client.id}`)}
            >
              {isMobile ? (
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold mb-1.5">{client.name}</h3>
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        {client.pets.map((pet, index) => (
                          <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
                            <PawPrint size={12} weight="fill" />
                            {pet.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                    <div className="bg-secondary/30 rounded-md p-2">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                        Last Visit
                      </div>
                      <div className="text-xs font-semibold">{client.lastVisit ?? "Not yet"}</div>
                    </div>
                    <div className="bg-secondary/30 rounded-md p-2">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                        Next Visit
                      </div>
                      <div className="text-xs font-semibold">{client.nextVisit ?? "Not scheduled"}</div>
                    </div>
                  </div>
                </div>
              ) : (
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
                  </div>

                  <div className="flex items-center gap-8 text-sm">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Last Visit
                      </div>
                      <div className="font-semibold">{client.lastVisit ?? "Not yet"}</div>
                    </div>

                    <div className="text-center">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Next Visit
                      </div>
                      <div className="font-semibold">{client.nextVisit ?? "Not scheduled"}</div>
                    </div>
                  </div>
                </div>
              )}
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
