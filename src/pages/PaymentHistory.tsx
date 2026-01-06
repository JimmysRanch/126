import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Receipt, Download, PawPrint } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

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

  const paymentHistory: PaymentRecord[] = [
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
            <p className="text-xs text-muted-foreground">George moodys</p>
          </div>
        </div>

        <div className="space-y-3">
          {paymentHistory.map((payment) => (
            <Card key={payment.id} className="p-3 sm:p-4 bg-card border-border">
              <div className="flex flex-col sm:flex-row items-start justify-between mb-3 gap-2">
                <div>
                  <p className="text-sm font-semibold">{payment.date}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant={payment.status === "Paid" ? "default" : "secondary"}
                      className={payment.status === "Paid" ? "bg-primary/20 text-primary text-xs" : "text-xs"}
                    >
                      {payment.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{payment.method}</span>
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="font-semibold text-xs h-8">
                  <Download size={14} className="mr-1.5" />
                  Download
                </Button>
              </div>

              <div className="space-y-2 mb-3">
                {payment.pets.map((pet, index) => (
                  <div key={index}>
                    <p className="text-sm font-bold mb-1.5 flex items-center gap-1.5">
                      <PawPrint size={14} weight="fill" className="text-primary" />
                      {pet.name}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 mb-1.5">
                      {pet.services.map((service, sIndex) => (
                        <div key={sIndex} className="text-xs text-muted-foreground flex items-center gap-1.5 bg-secondary/30 rounded px-2 py-1">
                          <span className="w-1 h-1 rounded-full bg-primary"></span>
                          {service}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm font-semibold text-right">{pet.cost}</p>
                    {index < payment.pets.length - 1 && <Separator className="mt-2" />}
                  </div>
                ))}
              </div>

              <Separator className="mb-2" />

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{payment.paid}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tip</span>
                  <span className="font-semibold">{payment.tip}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">{payment.total}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
