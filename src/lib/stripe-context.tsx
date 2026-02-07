import { createContext, useContext, useMemo, ReactNode } from 'react'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useKV } from "@github/spark/hooks"
import { StripeSettings } from './types'

// Default Stripe settings
export const DEFAULT_STRIPE_SETTINGS: StripeSettings = {
  enabled: false,
  publishableKey: '',
  testMode: true,
  onboardingComplete: false,
  payoutsEnabled: false,
  chargesEnabled: false,
}

interface StripeContextValue {
  stripeSettings: StripeSettings
  setStripeSettings: (settings: StripeSettings | ((current: StripeSettings) => StripeSettings)) => void
  isStripeReady: boolean
  stripePromise: Promise<Stripe | null> | null
}

const StripeContext = createContext<StripeContextValue | null>(null)

export function useStripeContext() {
  const context = useContext(StripeContext)
  if (!context) {
    throw new Error('useStripeContext must be used within a StripeProvider')
  }
  return context
}

interface StripeProviderProps {
  children: ReactNode
}

export function StripeProvider({ children }: StripeProviderProps) {
  const [stripeSettings, setStripeSettings] = useKV<StripeSettings>(
    'stripe-settings',
    DEFAULT_STRIPE_SETTINGS
  )

  // Load Stripe when settings are available
  const stripePromise = useMemo(() => {
    if (!stripeSettings?.enabled || !stripeSettings?.publishableKey) {
      return null
    }
    return loadStripe(stripeSettings.publishableKey)
  }, [stripeSettings?.enabled, stripeSettings?.publishableKey])

  const isStripeReady = Boolean(
    stripeSettings?.enabled &&
    stripeSettings?.publishableKey &&
    stripeSettings?.onboardingComplete &&
    stripeSettings?.chargesEnabled
  )

  const value: StripeContextValue = {
    stripeSettings: stripeSettings || DEFAULT_STRIPE_SETTINGS,
    setStripeSettings,
    isStripeReady,
    stripePromise,
  }

  return (
    <StripeContext.Provider value={value}>
      {children}
    </StripeContext.Provider>
  )
}

// Wrapper component for Stripe Elements
interface StripeElementsWrapperProps {
  children: ReactNode
  clientSecret?: string
}

export function StripeElementsWrapper({ children, clientSecret }: StripeElementsWrapperProps) {
  const { stripePromise, isStripeReady } = useStripeContext()

  if (!isStripeReady || !stripePromise) {
    return <>{children}</>
  }

  const options = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: 'night' as const,
          variables: {
            colorPrimary: '#5dd9e8',
            colorBackground: '#141b3d',
            colorText: '#ffffff',
            colorDanger: '#ef4444',
            fontFamily: 'Inter, system-ui, sans-serif',
            borderRadius: '8px',
          },
        },
      }
    : undefined

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  )
}
