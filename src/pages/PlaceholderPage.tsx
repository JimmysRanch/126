interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-8">
          <h1 className="text-[32px] font-bold tracking-tight leading-none">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            This page is under construction.
          </p>
        </header>

        <div className="bg-card rounded-lg p-12 border border-border text-center">
          <p className="text-muted-foreground">
            Content for {title.toLowerCase()} will appear here.
          </p>
        </div>
      </div>
    </div>
  )
}
