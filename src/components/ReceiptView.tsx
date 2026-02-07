import { useMemo } from "react"
import { useKV } from "@github/spark/hooks"
import { Separator } from "@/components/ui/separator"
import { Appointment, Transaction } from "@/lib/types"
import { formatInBusinessTimezone } from "@/lib/date-utils"

interface BusinessInfo {
  companyName: string
  businessPhone: string
  businessEmail: string
  address: string
  city: string
  state: string
  zipCode: string
  timezone: string
  website: string
}

interface PaymentLine {
  method: string
  amount: number
  cardLast4?: string
  cashTendered?: number
  change?: number
}

interface ReceiptLineItem {
  label: string
  amount: number
  isAddon?: boolean
}

interface ReceiptViewProps {
  transaction: Transaction
  appointment?: Appointment
  payments?: PaymentLine[]
  taxAmount?: number
}

const DEFAULT_BUSINESS_INFO: BusinessInfo = {
  companyName: "Scruffy Butts",
  businessPhone: "",
  businessEmail: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  timezone: "America/New_York",
  website: ""
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)

const formatMethodLabel = (method?: string) => {
  if (!method) return "Payment"
  return method
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function ReceiptView({ transaction, appointment, payments, taxAmount = 0 }: ReceiptViewProps) {
  const [businessInfo] = useKV<BusinessInfo>("business-info", DEFAULT_BUSINESS_INFO)

  const contactLine = useMemo(() => {
    const parts = [businessInfo.address, businessInfo.city, businessInfo.state, businessInfo.zipCode]
      .filter(Boolean)
      .join(", ")
    return parts
  }, [businessInfo.address, businessInfo.city, businessInfo.state, businessInfo.zipCode])

  const receiptDate = useMemo(() => {
    try {
      return formatInBusinessTimezone(transaction.date, "MMM d, yyyy h:mm a")
    } catch (error) {
      return transaction.date
    }
  }, [transaction.date])

  const serviceLines: ReceiptLineItem[] = []
  let hasServices = false

  if (appointment?.services?.length) {
    appointment.services.forEach((service) => {
      if (service.type === "main") {
        hasServices = true
        serviceLines.push({
          label: `${service.serviceName}${appointment.petName ? ` (${appointment.petName})` : ""}`,
          amount: service.price
        })
        return
      }

      serviceLines.push({
        label: service.serviceName,
        amount: service.price,
        isAddon: true
      })
    })
  } else {
    const fallbackServices = transaction.items.filter((item) => item.type === "service")
    fallbackServices.forEach((item) => {
      hasServices = true
      serviceLines.push({ label: item.name, amount: item.total })
    })
  }

  const retailLines: ReceiptLineItem[] = transaction.items
    .filter((item) => item.type === "product")
    .map((item) => ({
      label: `${item.name}${item.quantity > 1 ? ` x ${item.quantity}` : ""}`,
      amount: item.total
    }))

  const adjustmentLines: ReceiptLineItem[] = []

  if (transaction.discount > 0) {
    adjustmentLines.push({
      label: `Discount${transaction.discountDescription ? ` (${transaction.discountDescription})` : ""}`,
      amount: -transaction.discount
    })
  }

  if (transaction.additionalFees > 0) {
    adjustmentLines.push({
      label: `Additional Fees${transaction.additionalFeesDescription ? ` (${transaction.additionalFeesDescription})` : ""}`,
      amount: transaction.additionalFees
    })
  }

  const fallbackPayments = useMemo(() => {
    if (payments?.length) return payments

    const tipAmount = transaction.tipAmount || 0
    const primaryMethod = formatMethodLabel(transaction.paymentMethod)
    const tipMethod = transaction.tipPaymentMethod
      ? formatMethodLabel(transaction.tipPaymentMethod)
      : undefined

    // Include Stripe card details if available
    const cardLast4 = transaction.cardLast4
    const cardBrand = transaction.cardBrand

    // Helper function to format card brand
    const formatCardBrand = (brand: string | undefined) => {
      if (!brand || brand.length === 0) return null
      return `${brand.charAt(0).toUpperCase() + brand.slice(1)} Card`
    }

    const formattedCardBrand = formatCardBrand(cardBrand)

    if (tipAmount > 0 && tipMethod && tipMethod !== primaryMethod) {
      return [
        { 
          method: formattedCardBrand || primaryMethod, 
          amount: transaction.total - tipAmount,
          cardLast4 
        },
        { method: `${tipMethod} (Tip)`, amount: tipAmount }
      ]
    }

    return [{ 
      method: formattedCardBrand || primaryMethod, 
      amount: transaction.total,
      cardLast4 
    }]
  }, [payments, transaction.paymentMethod, transaction.tipAmount, transaction.tipPaymentMethod, transaction.total, transaction.cardLast4, transaction.cardBrand])

  return (
    <div className="w-full max-w-[380px] mx-auto text-[11px] text-foreground font-mono">
      <div className="text-center space-y-1">
        <div className="text-lg font-bold tracking-wide">
          {businessInfo.companyName || DEFAULT_BUSINESS_INFO.companyName}
        </div>
        {businessInfo.businessPhone && (
          <div className="text-[10px] text-muted-foreground">{businessInfo.businessPhone}</div>
        )}
        {contactLine && (
          <div className="text-[10px] text-muted-foreground">{contactLine}</div>
        )}
        {businessInfo.website && (
          <div className="text-[10px] text-muted-foreground">{businessInfo.website}</div>
        )}
      </div>

      <Separator className="my-3" />

      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Receipt ID</span>
          <span className="font-semibold">{transaction.id}</span>
        </div>
        {transaction.appointmentId && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Appt. ID</span>
            <span className="font-semibold">{transaction.appointmentId}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Date & Time</span>
          <span className="font-semibold">{receiptDate}</span>
        </div>
      </div>

      <Separator className="my-3" />

      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Customer</span>
          <span className="font-semibold">{transaction.clientName || "Walk-in"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Pet</span>
          <span className="font-semibold">{appointment?.petName || "Walk-in"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Staff</span>
          <span className="font-semibold">{appointment?.groomerName || "-"}</span>
        </div>
      </div>

      <Separator className="my-3" />

      <div className="space-y-2">
        {hasServices && (
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Services</div>
        )}
        {serviceLines.map((item, index) => (
          <div key={`service-${index}`} className="flex justify-between gap-3">
            <span className={item.isAddon ? "pl-3 text-muted-foreground" : ""}>
              {item.isAddon ? `+ ${item.label}` : item.label}
            </span>
            <span className="font-semibold">{formatCurrency(item.amount)}</span>
          </div>
        ))}
        {retailLines.length > 0 && (
          <>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2">Retail</div>
            {retailLines.map((item, index) => (
              <div key={`retail-${index}`} className="flex justify-between gap-3">
                <span>{item.label}</span>
                <span className="font-semibold">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </>
        )}
        {adjustmentLines.map((item, index) => (
          <div key={`adjustment-${index}`} className="flex justify-between gap-3">
            <span>{item.label}</span>
            <span className="font-semibold">{formatCurrency(item.amount)}</span>
          </div>
        ))}
      </div>

      <Separator className="my-3" />

      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold">{formatCurrency(transaction.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span className="font-semibold">{formatCurrency(taxAmount)}</span>
        </div>
        {transaction.tipAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tip</span>
            <span className="font-semibold">{formatCurrency(transaction.tipAmount)}</span>
          </div>
        )}
        <Separator className="my-2" />
        <div className="flex justify-between text-sm font-bold">
          <span>Grand Total</span>
          <span className="text-primary">{formatCurrency(transaction.total)}</span>
        </div>
      </div>

      <Separator className="my-3" />

      <div className="space-y-1">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Payment Breakdown</div>
        {fallbackPayments.map((payment, index) => (
          <div key={`payment-${index}`} className="space-y-1">
            <div className="flex justify-between">
              <span>{payment.method}</span>
              <span className="font-semibold">{formatCurrency(payment.amount)}</span>
            </div>
            {payment.cardLast4 && (
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Card •••• {payment.cardLast4}</span>
                <span></span>
              </div>
            )}
            {typeof payment.cashTendered === "number" && (
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Cash Tendered</span>
                <span>{formatCurrency(payment.cashTendered)}</span>
              </div>
            )}
            {typeof payment.change === "number" && (
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Change</span>
                <span>{formatCurrency(payment.change)}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <Separator className="my-3" />

      <div className="text-center text-[10px] text-muted-foreground">
        Thanks for trusting Scruffy Butts — see you next time!
      </div>
    </div>
  )
}
