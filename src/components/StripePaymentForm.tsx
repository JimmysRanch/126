import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Spinner, CreditCard, CheckCircle, Warning } from "@phosphor-icons/react"
import { toast } from "sonner"

interface StripePaymentFormProps {
  amount: number
  onSuccess: (paymentDetails: StripePaymentResult) => void
  onCancel: () => void
  clientName?: string
}

export interface StripePaymentResult {
  paymentIntentId: string
  cardBrand: string
  cardLast4: string
  status: 'succeeded' | 'processing' | 'requires_action'
}

export function StripePaymentForm({ 
  amount, 
  onSuccess, 
  onCancel,
  clientName 
}: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardComplete, setCardComplete] = useState(false)
  const [cardError, setCardError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      toast.error('Stripe is not loaded. Please try again.')
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      toast.error('Card element not found')
      return
    }

    setIsProcessing(true)
    setCardError(null)

    try {
      // In a production app, you would:
      // 1. Call your backend to create a PaymentIntent with the amount
      // 2. Receive the client_secret from your backend
      // 3. Confirm the payment with Stripe
      
      // For this demo, we'll simulate the payment process
      // In production, this would use stripe.confirmCardPayment with a real client_secret
      
      // Create a payment method to validate the card
      const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: clientName || 'Customer',
        },
      })

      if (methodError) {
        setCardError(methodError.message || 'An error occurred')
        setIsProcessing(false)
        return
      }

      // Simulate a successful payment for demo purposes
      // In production, you would call stripe.confirmCardPayment here
      const simulatedResult: StripePaymentResult = {
        paymentIntentId: `pi_simulated_${Date.now()}`,
        cardBrand: paymentMethod?.card?.brand || 'unknown',
        cardLast4: paymentMethod?.card?.last4 || '****',
        status: 'succeeded',
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      toast.success('Payment successful!')
      onSuccess(simulatedResult)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed'
      setCardError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif',
        '::placeholder': {
          color: '#6b7280',
        },
        iconColor: '#5dd9e8',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
    hidePostalCode: true,
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="p-4 bg-muted/50 border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard size={20} className="text-primary" />
            <span className="font-medium">Card Payment</span>
          </div>
          <span className="text-lg font-bold text-primary">
            ${amount.toFixed(2)}
          </span>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-element">Card Details</Label>
            <div className="p-3 rounded-md border border-border bg-background">
              <CardElement
                id="card-element"
                options={cardElementOptions}
                onChange={(event) => {
                  setCardComplete(event.complete)
                  setCardError(event.error?.message || null)
                }}
              />
            </div>
          </div>

          {cardError && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <Warning size={16} />
              <span>{cardError}</span>
            </div>
          )}

          {cardComplete && !cardError && (
            <div className="flex items-center gap-2 text-sm text-green-500">
              <CheckCircle size={16} />
              <span>Card details valid</span>
            </div>
          )}
        </div>
      </Card>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || !cardComplete || isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <Spinner size={18} className="mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard size={18} className="mr-2" />
              Pay ${amount.toFixed(2)}
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Payments are securely processed by Stripe. Your card details are never stored on our servers.
      </p>
    </form>
  )
}

// Placeholder component when Stripe is not available
export function StripePaymentPlaceholder({ 
  onCancel 
}: { 
  onCancel: () => void 
}) {
  return (
    <Card className="p-6 bg-muted/50 border-border">
      <div className="text-center space-y-4">
        <Warning size={48} className="mx-auto text-yellow-500" />
        <div>
          <h3 className="font-semibold text-lg">Stripe Not Configured</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Stripe payments are not set up. Please configure Stripe in Settings to accept card payments.
          </p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          Choose Another Payment Method
        </Button>
      </div>
    </Card>
  )
}
