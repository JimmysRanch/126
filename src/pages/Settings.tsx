import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash } from "@phosphor-icons/react"
import { useKV } from "@github/spark/hooks"
import { toast } from "sonner"

export function Settings() {
  const [activeTab, setActiveTab] = useState("staff")
  const [staffPositions, setStaffPositions] = useKV<string[]>("staff-positions", ["Owner", "Groomer", "Front Desk", "Bather"])
  const [newPosition, setNewPosition] = useState("")

  const handleAddPosition = () => {
    if (!newPosition.trim()) {
      toast.error("Position name cannot be empty")
      return
    }

    if ((staffPositions || []).includes(newPosition.trim())) {
      toast.error("This position already exists")
      return
    }

    setStaffPositions((current) => [...(current || []), newPosition.trim()])
    setNewPosition("")
    toast.success("Position added successfully")
  }

  const handleDeletePosition = (position: string) => {
    setStaffPositions((current) => (current || []).filter(p => p !== position))
    toast.success("Position removed successfully")
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-8">
          <h1 className="text-[32px] font-bold tracking-tight leading-none">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your PawHub application settings.
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-secondary/50 mb-6">
            <TabsTrigger 
              value="staff" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Staff
            </TabsTrigger>
            <TabsTrigger 
              value="business" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Business
            </TabsTrigger>
            <TabsTrigger 
              value="services" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Services
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="staff" className="mt-0">
            <Card className="p-6 bg-card border-border">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Staff Positions</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Manage the available positions for your staff members. These will appear in the dropdown when adding or editing staff.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Label htmlFor="new-position" className="sr-only">New Position</Label>
                      <Input
                        id="new-position"
                        placeholder="Enter new position (e.g., Senior Groomer)"
                        value={newPosition}
                        onChange={(e) => setNewPosition(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddPosition()
                          }
                        }}
                      />
                    </div>
                    <Button
                      onClick={handleAddPosition}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                    >
                      <Plus size={18} className="mr-2" />
                      Add Position
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {(staffPositions || []).length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        No positions configured. Add your first position above.
                      </div>
                    ) : (
                      (staffPositions || []).map((position) => (
                        <div
                          key={position}
                          className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border hover:border-primary/50 transition-colors"
                        >
                          <span className="font-medium">{position}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeletePosition(position)}
                          >
                            <Trash size={18} />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="mt-0">
            <Card className="p-12 bg-card border-border text-center">
              <p className="text-muted-foreground">
                Business settings will appear here.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="mt-0">
            <Card className="p-12 bg-card border-border text-center">
              <p className="text-muted-foreground">
                Service settings will appear here.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <Card className="p-12 bg-card border-border text-center">
              <p className="text-muted-foreground">
                Notification settings will appear here.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
