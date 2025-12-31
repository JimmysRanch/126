import { ArrowLeft, PencilSimple, DotsThree, PawPrint } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

function App() {
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
          <Card 
            className="p-4 border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 cursor-pointer active:scale-[0.98]"
            onClick={() => console.log('Lifetime Spend clicked')}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                LIFETIME SPEND
              </p>
              <p className="text-2xl font-bold">$0</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                TOTAL APPTS
              </p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </Card>

          <Card 
            className="p-4 border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 cursor-pointer active:scale-[0.98]"
            onClick={() => console.log('Average per visit clicked')}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                AVG PER VISIT
              </p>
              <p className="text-2xl font-bold">$0</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                AVG TIP
              </p>
              <p className="text-2xl font-bold">$0</p>
            </div>
          </Card>

          <Card 
            className="p-4 border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 cursor-pointer active:scale-[0.98]"
            onClick={() => console.log('Avg Interval clicked')}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                AVG INTERVAL
              </p>
              <p className="text-2xl font-bold">—</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                SINCE LAST VISIT
              </p>
              <p className="text-2xl font-bold">—</p>
            </div>
          </Card>

          <Card 
            className="p-4 border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 cursor-pointer active:scale-[0.98]"
            onClick={() => console.log('No-shows clicked')}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                NO-SHOWS
              </p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                CANCELS
              </p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </Card>

          <Card 
            className="p-4 border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 cursor-pointer active:scale-[0.98]"
            onClick={() => console.log('Late arrivals clicked')}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                LATE
              </p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                LATE CANCELS
              </p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-4 border-border bg-card">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Last visit</h2>
              <Button
                variant="secondary"
                className="font-semibold transition-all duration-200 hover:scale-[1.02]"
              >
                REBOOK VISIT
              </Button>
            </div>
            <p className="text-muted-foreground mt-3">No completed visits yet</p>
          </Card>

          <Card className="p-4 border-border bg-card relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-secondary transition-all duration-200"
              >
                <PencilSimple size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-secondary transition-all duration-200"
              >
                <DotsThree size={16} />
              </Button>
            </div>

            <div className="flex items-start gap-4 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/20 text-primary">
                  <PawPrint size={24} weight="fill" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <PawPrint size={20} weight="fill" className="text-primary" />
                  Trying
                </h2>
                <p className="text-sm text-muted-foreground">Lab • Active</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Temperament:
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold transition-all duration-200">
                Rebook appointment
              </Button>
              <Button
                variant="secondary"
                className="font-semibold transition-all duration-200 hover:scale-[1.02]"
              >
                Add journal entry
              </Button>
              <Button
                variant="secondary"
                className="font-semibold transition-all duration-200 hover:scale-[1.02]"
              >
                Upload media
              </Button>
            </div>

            <div className="border border-dashed border-border rounded-lg p-3 mb-3"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div className="bg-secondary/30 rounded-lg p-3 border border-border">
                <p className="text-sm font-medium mb-1">Last appointment</p>
                <p className="text-muted-foreground">—</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3 border border-border">
                <p className="text-sm font-medium mb-1">Next visit</p>
                <p className="text-muted-foreground font-bold">—</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Auto loads last visit playbook
                </p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3 border border-border">
                <p className="text-sm font-medium mb-1">Cadence</p>
                <p className="text-muted-foreground mt-1">Status: Active</p>
              </div>
            </div>

            <div className="bg-secondary/30 rounded-lg p-3 border border-border">
              <p className="text-sm font-medium">Favorite notes</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App