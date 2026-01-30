import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Receipt, Download, PawPrint } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useKV } from "@github/spark/hooks"
import { Appointment, Client, Transaction } from "@/lib/types"
import { formatInBusinessTimezone } from "@/lib/date-utils"

interface PaymentRecord {
  id: string
  date: string
  total: string
  paid: string
  tip: string
  method: string
  status: string
  pets: {
    name: string
    services: string[]
    cost: string
  }[]
}

export function PaymentHistory() {
  const navigate = useNavigate()
  const { clientId } = useParams()
  const [clients] = useKV<Client[]>("clients", [])
  const [transactions] = useKV<Transaction[]>("transactions", [])
  const [appointments] = useKV<Appointment[]>("appointments", [])

  const client = (clients || []).find(item => item.id === clientId)

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

  const formatPaymentMethod = (method?: string) => {
    if (!method) return "Unknown"
    return method
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  }

  const formatDate = (dateString: string) => {
    try {
      return formatInBusinessTimezone(dateString, 'MMM d, yyyy')
    } catch (error) {
      return dateString
    }
  }

  const paymentHistory: PaymentRecord[] = (transactions || [])
    .filter(transaction => transaction.clientId === clientId)
    .map((transaction) => {
      const appointment = transaction.appointmentId
        ? (appointments || []).find(item => item.id === transaction.appointmentId)
        : undefined

      const serviceItems = transaction.items.filter(item => item.type === 'service')
      const allItems = transaction.items.map(item => item.name)
      const services = serviceItems.length > 0 ? serviceItems.map(item => item.name) : allItems

      const pets = appointment
        ? [
            {
              name: appointment.petName || "Pet",
              services: services.length > 0 ? services : ["Service"],
              cost: formatCurrency(transaction.subtotal)
            }
          ]
        : [
            {
              name: transaction.type === 'retail' ? "Retail Purchase" : "Service",
              services: services.length > 0 ? services : ["Service"],
              cost: formatCurrency(transaction.subtotal)
            }
          ]

      return {
        id: transaction.id,
        date: formatDate(transaction.date),
        total: formatCurrency(transaction.total),
        paid: formatCurrency(transaction.subtotal),
        tip: formatCurrency(transaction.tipAmount || 0),
        method: formatPaymentMethod(transaction.paymentMethod),
        status: transaction.status === 'completed' ? "Paid" : "Pending",
        pets
      }
    })

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-secondary transition-all duration-200"
            onClick={() => navigate(`/clients/${clientId}`)}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Receipt size={22} className="text-primary" />
              Payment History
            </h1>
            <p className="text-xs text-muted-foreground">{client?.name || "Client"}</p>
          </div>
        </div>

        <div className="space-y-2">
          {paymentHistory.length === 0 ? (
            <Card className="p-6 bg-card border-border text-center text-sm text-muted-foreground">
              No payments recorded for this client yet.
            </Card>
          ) : (
            paymentHistory.map((payment) => (
              <Card key={payment.id} className="p-2.5 bg-card border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold">{payment.date}</p>
                    <Badge 
                      variant={payment.status === "Paid" ? "default" : "secondary"}
                      className={payment.status === "Paid" ? "bg-primary/20 text-primary text-[10px] px-1.5 py-0" : "text-[10px] px-1.5 py-0"}
                    >
                      {payment.status}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{payment.method}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2">
                    <Download size={12} className="mr-1" />
                    Download
                  </Button>
                </div>

                <div className="space-y-1.5 mb-2">
                  {payment.pets.map((pet, index) => (
                    <div key={index}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold mb-1 flex items-center gap-1">
                            <PawPrint size={12} weight="fill" className="text-primary flex-shrink-0" />
                            {pet.name}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {pet.services.map((service, sIndex) => (
                              <span key={sIndex} className="text-[10px] text-muted-foreground bg-secondary/30 rounded px-1.5 py-0.5">
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs font-semibold flex-shrink-0">{pet.cost}</p>
                      </div>
                      {index < payment.pets.length - 1 && <Separator className="my-1.5" />}
                    </div>
                  ))}
                </div>

                <Separator className="mb-1.5" />

                <div className="space-y-0.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">{payment.paid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tip</span>
                    <span className="font-semibold">{payment.tip}</span>
                  </div>
                  <Separator className="my-1" />
                  <div className="flex justify-between text-xs font-bold">
                    <span>Total</span>
                    <span className="text-primary">{payment.total}</span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
