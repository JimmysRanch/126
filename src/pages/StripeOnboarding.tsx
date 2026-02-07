import { useEffect, useState } from "react";
import { useKV } from "@github/spark/hooks";
import { postJSON, getJSON } from "../stripe/api";
import { StripeConnectProvider } from "../stripe/connect";
import { ConnectAccountOnboarding, ConnectNotificationBanner } from "@stripe/react-connect-js";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Warning } from "@phosphor-icons/react";

interface StripeStatus {
  exists: boolean;
  stripeAccountId?: string;
  details_submitted?: boolean;
  charges_enabled?: boolean;
  payouts_enabled?: boolean;
  currently_due?: string[];
}

export default function StripeOnboardingPage() {
  const [salonId, setSalonId] = useKV<string>("salonId", "");
  const [accountReady, setAccountReady] = useState(false);
  const [status, setStatus] = useState<StripeStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string;

  useEffect(() => {
    if (!salonId) setSalonId(`salon_${crypto.randomUUID()}`);
  }, [salonId, setSalonId]);

  useEffect(() => {
    if (!salonId) return;

    async function ensureAccount() {
      try {
        await postJSON("/api/stripe/connect/accounts", { salonId, country: "US" });
        setAccountReady(true);
        // Check status
        const s = await getJSON<StripeStatus>(`/api/stripe/connect/status?salonId=${salonId}`);
        setStatus(s);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    }
    ensureAccount();
  }, [salonId]);

  if (!publishableKey) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Card className="max-w-2xl mx-auto p-6 border-destructive bg-destructive/10">
          <div className="flex items-center gap-2 text-destructive">
            <Warning size={24} />
            <span className="text-lg font-semibold">Missing VITE_STRIPE_PUBLISHABLE_KEY</span>
          </div>
          <p className="mt-2 text-muted-foreground">
            Configure your Stripe publishable key in the environment variables to enable Stripe Connect.
          </p>
          <Button variant="outline" onClick={() => nav("/settings")} className="mt-4">
            <ArrowLeft size={16} className="mr-2" />
            Back to Settings
          </Button>
        </Card>
      </div>
    );
  }

  if (!salonId || !accountReady) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Setting up Stripe account...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Card className="max-w-2xl mx-auto p-6 border-destructive bg-destructive/10">
          <div className="flex items-center gap-2 text-destructive">
            <Warning size={24} />
            <span className="text-lg font-semibold">Error</span>
          </div>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <Button variant="outline" onClick={() => nav("/settings")} className="mt-4">
            <ArrowLeft size={16} className="mr-2" />
            Back to Settings
          </Button>
        </Card>
      </div>
    );
  }

  // If already fully onboarded, show status and button to go back
  if (status?.details_submitted && status?.charges_enabled) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Card className="max-w-2xl mx-auto p-6">
          <div className="flex items-center gap-2 text-green-600 mb-4">
            <Check size={24} weight="bold" />
            <span className="text-lg font-semibold">Stripe Account Active</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Your Stripe account is fully set up and ready to accept payments.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => nav("/finances?tab=stripe")}>
              Go to Finances
            </Button>
            <Button variant="outline" onClick={() => nav("/settings")}>
              Back to Settings
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => nav("/settings")}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold">Stripe Onboarding</h1>
        </div>

        <StripeConnectProvider salonId={salonId} mode="onboarding">
          <div className="space-y-4">
            <ConnectNotificationBanner />
            <Card className="p-6">
              <ConnectAccountOnboarding
                onExit={() => {
                  nav("/settings");
                }}
              />
            </Card>
          </div>
        </StripeConnectProvider>
      </div>
    </div>
  );
}
