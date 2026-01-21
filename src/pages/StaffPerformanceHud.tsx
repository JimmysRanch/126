import '../styles/hud.css'

const rpmMonthly = [
  { label: 'Jan', value: 68 },
  { label: 'Feb', value: 54 },
  { label: 'Mar', value: 76 },
  { label: 'Apr', value: 62 },
  { label: 'May', value: 88 },
]

const minutesMonthly = [
  { label: 'Jan', value: 62 },
  { label: 'Feb', value: 74 },
  { label: 'Mar', value: 66 },
  { label: 'Apr', value: 58 },
  { label: 'May', value: 71 },
]

const rpmBySize = [
  { label: 'Small', value: 78 },
  { label: 'Medium', value: 58 },
  { label: 'Large', value: 88 },
]

const earningsByBreed = [
  { breed: 'Golden Retriever', value: '$1,240' },
  { breed: 'French Bulldog', value: '$1,080' },
  { breed: 'Australian Shepherd', value: '$980' },
  { breed: 'Poodle', value: '$910' },
  { breed: 'Shiba Inu', value: '$820' },
]

const topCombos = [
  { label: 'Golden Retriever • Large', value: '$4.20 RPM' },
  { label: 'Poodle • Medium', value: '$4.05 RPM' },
  { label: 'French Bulldog • Small', value: '$3.92 RPM' },
]

const lowCombos = [
  { label: 'Husky • Large', value: '$2.65 RPM' },
  { label: 'Beagle • Medium', value: '$2.58 RPM' },
  { label: 'Boxer • Large', value: '$2.44 RPM' },
]

const rpmTable = [
  { breed: 'Retriever', small: '$3.22', medium: '$3.68', large: '$4.05' },
  { breed: 'Bulldog', small: '$3.75', medium: '$3.41', large: '$3.12' },
  { breed: 'Shepherd', small: '$3.08', medium: '$3.52', large: '$3.88' },
  { breed: 'Poodle', small: '$3.60', medium: '$3.95', large: '$4.10' },
]

export function StaffPerformanceHud() {
  return (
    <div className="hud-page">
      <div className="hud-shell">
        <header className="flex flex-col gap-3 mb-8">
          <p className="hud-subtitle">Staff Performance</p>
          <h1 className="hud-title">Cyber Glass HUD Dashboard</h1>
        </header>

        <section className="hud-grid grid-cols-1 md:grid-cols-3">
          <article className="hud-card hud-glow-cyan flex items-center justify-between gap-4">
            <div>
              <p className="hud-label">Avg Minutes / Appointment</p>
              <p className="hud-value">64 mins</p>
            </div>
            <div className="hud-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-cyan-200">
                <circle cx="12" cy="12" r="8" />
                <path d="M12 7v5l3 2" />
              </svg>
            </div>
          </article>

          <article className="hud-card hud-glow-amber flex items-center justify-between gap-4">
            <div>
              <p className="hud-label">Revenue per min | RPM</p>
              <p className="hud-value">$3.75</p>
            </div>
            <div className="hud-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-amber-200">
                <path d="M12 2v20" />
                <path d="M16.5 7.5c0-2-1.8-3.5-4.5-3.5S7.5 5.5 7.5 7.5s2 3 4.5 3 4.5 1 4.5 3-1.8 3.5-4.5 3.5-4.5-1.5-4.5-3.5" />
              </svg>
            </div>
          </article>

          <article className="hud-card hud-glow-emerald flex items-center justify-between gap-4">
            <div>
              <p className="hud-label">Completed Appointments</p>
              <p className="hud-value">75</p>
            </div>
            <div className="hud-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-emerald-200">
                <path d="M8 11c1.5-1.5 3-1.5 4.5 0M11.5 11c1.5-1.5 3-1.5 4.5 0" />
                <path d="M6 9c-1.5 0-2.5 1-2.5 2.5S4.5 14 6 14c.8 0 1.5-.2 2-.6" />
                <path d="M18 9c1.5 0 2.5 1 2.5 2.5S19.5 14 18 14c-.8 0-1.5-.2-2-.6" />
                <path d="M9 18c1.2 1 2.6 1.5 3 1.5s1.8-.5 3-1.5" />
              </svg>
            </div>
          </article>
        </section>

        <section className="hud-grid grid-cols-1 md:grid-cols-3 mt-6">
          <article className="hud-card hud-glow-cyan">
            <div className="hud-chart">
              <div>
                <p className="hud-label">RPM (Monthly)</p>
                <p className="hud-value">$3.85</p>
              </div>
              <div className="hud-bars">
                {rpmMonthly.map((item) => (
                  <div key={item.label} className="hud-bar" style={{ height: `${item.value}%` }} />
                ))}
              </div>
              <div className="hud-bar-labels">
                {rpmMonthly.map((item) => (
                  <span key={item.label}>{item.label}</span>
                ))}
              </div>
            </div>
          </article>

          <article className="hud-card hud-glow-amber">
            <div className="hud-chart">
              <div>
                <p className="hud-label">Average Minutes per Appointment</p>
                <p className="hud-value">64.2</p>
              </div>
              <div className="hud-bars">
                {minutesMonthly.map((item) => (
                  <div key={item.label} className="hud-bar hud-bar-amber" style={{ height: `${item.value}%` }} />
                ))}
              </div>
              <div className="hud-bar-labels">
                {minutesMonthly.map((item) => (
                  <span key={item.label}>{item.label}</span>
                ))}
              </div>
            </div>
          </article>

          <article className="hud-card hud-glow-emerald">
            <div className="hud-chart">
              <div>
                <p className="hud-label">RPM by Dog Size</p>
                <p className="hud-value">$4.05</p>
              </div>
              <div className="hud-bars">
                {rpmBySize.map((item) => (
                  <div key={item.label} className="hud-bar hud-bar-emerald" style={{ height: `${item.value}%` }} />
                ))}
              </div>
              <div className="hud-bar-labels">
                {rpmBySize.map((item) => (
                  <span key={item.label}>{item.label}</span>
                ))}
              </div>
            </div>
          </article>
        </section>

        <section className="hud-stage mt-8">
          <div className="hud-pedestal" aria-hidden="true" />
          <div className="hud-grid grid-cols-1 md:grid-cols-3 relative z-10">
            <article className="hud-card">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="hud-label">Earnings by Breed</p>
                  <p className="hud-value">$5,030</p>
                </div>
                <div className="hud-list">
                  {earningsByBreed.map((item) => (
                    <div key={item.breed} className="hud-list-item">
                      <span>{item.breed}</span>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="hud-card">
              <div className="flex flex-col gap-5">
                <div>
                  <p className="hud-label">Top Performing Breed + Size</p>
                  <p className="hud-value">$4.20 RPM</p>
                </div>
                <div className="hud-list">
                  {topCombos.map((item) => (
                    <div key={item.label} className="hud-list-item">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="hud-label">Lowest Performing</p>
                </div>
                <div className="hud-list">
                  {lowCombos.map((item) => (
                    <div key={item.label} className="hud-list-item">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="hud-card">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="hud-label">RPM by Breed &amp; Size</p>
                  <p className="hud-value">Tier Matrix</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="hud-table">
                    <thead>
                      <tr>
                        <th>Breed</th>
                        <th>Small</th>
                        <th>Medium</th>
                        <th>Large</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rpmTable.map((row) => (
                        <tr key={row.breed}>
                          <td>{row.breed}</td>
                          <td>{row.small}</td>
                          <td>{row.medium}</td>
                          <td>{row.large}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  )
}
