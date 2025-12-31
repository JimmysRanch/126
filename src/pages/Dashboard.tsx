export function Dashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-8">
          <h1 className="text-[32px] font-bold tracking-tight leading-none">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back! Here's an overview of your business.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
              Today's Appointments
            </div>
            <div className="text-3xl font-bold">12</div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
              Revenue This Month
            </div>
            <div className="text-3xl font-bold">$24,580</div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
              Active Clients
            </div>
            <div className="text-3xl font-bold">156</div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
              Pets Groomed
            </div>
            <div className="text-3xl font-bold">289</div>
          </div>
        </div>

        <div className="mt-6 bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <p className="text-muted-foreground">
            Your dashboard content will appear here with charts, upcoming appointments, and business insights.
          </p>
        </div>
      </div>
    </div>
  )
}
