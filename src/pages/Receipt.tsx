import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Receipt as ReceiptIcon, ArrowLeft, Printer, EnvelopeSimple, ChatText } from "@phosphor-icons/react"
import { useKV } from "@github/spark/hooks"
import { Appointment, Transaction } from "@/lib/types"
import { ReceiptView } from "@/components/ReceiptView"

export function Receipt() {
  const navigate = useNavigate()
  const { receiptId } = useParams()
  const [transactions] = useKV<Transaction[]>("transactions", [])
  const [appointments] = useKV<Appointment[]>("appointments", [])

  const transaction = useMemo(
    () => (transactions || []).find((item) => item.id === receiptId),
    [transactions, receiptId]
  )

  const appointment = useMemo(
    () =>
      transaction?.appointmentId
        ? (appointments || []).find((item) => item.id === transaction.appointmentId)
        : undefined,
    [appointments, transaction?.appointmentId]
  )

  if (!transaction) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft size={16} />
            Back
          </Button>
          <Card className="p-6 text-center text-sm text-muted-foreground">
            Receipt not found.
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft size={16} />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <ReceiptIcon size={22} className="text-primary" />
                Receipt
              </h1>
              <p className="text-xs text-muted-foreground">Read-only receipt view</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Printer size={14} />
              Print
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <EnvelopeSimple size={14} />
              Email
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <ChatText size={14} />
              Text
            </Button>
          </div>
        </div>

        <Card className="p-4 sm:p-6 flex justify-center">
          <ReceiptView transaction={transaction} appointment={appointment} />
        </Card>
      </div>
    </div>
  )
}
