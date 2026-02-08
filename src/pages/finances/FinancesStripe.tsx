import { useEffect, useState } from "react";
import { useKV } from "@github/spark/hooks";
import { StripeConnectProvider } from "../../stripe/connect";
import { ConnectNotificationBanner, ConnectPayments, ConnectPayouts } from "@stripe/react-connect-js";
import { getJSON } from "../../stripe/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Warning, Check, CreditCard, Wallet, Receipt, ArrowSquareOut } from "@phosphor-icons/react";

interface StripeStatus {
  exists: boolean;
  stripeAccountId?: string;
  details_submitted?: boolean;
  charges_enabled?: boolean;
  payouts_enabled?: boolean;
  currently_due?: string[];
}

export default function FinancesStripe() {
  const [salonId, setSalonId] = useKV<string>("salonId", "");
  const [status, setStatus] = useState<StripeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const nav = useNavigate();

  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string;

  useEffect(() => {
    if (!salonId) setSalonId(`salon_${crypto.randomUUID()}`);
  }, [salonId, setSalonId]);

  useEffect(() => {
    if (!salonId) return;
    
    async function checkStatus() {
      try {
        const s = await getJSON<StripeStatus>(`/api/stripe/connect/status?salonId=${salonId}`);
        setStatus(s);
      } catch {
        setStatus({ exists: false });
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
  }, [salonId]);

  if (!publishableKey) {
    return (
      <Card className="p-4 border-destructive bg-destructive/10">
        <div className="flex items-center gap-2 text-destructive">
          <Warning size={20} />
          <span>Missing VITE_STRIPE_PUBLISHABLE_KEY - Stripe features disabled</span>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not onboarded yet
  if (!status?.exists || !status.details_submitted) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 text-amber-600 mb-4">
          <Warning size={24} />
          <span className="text-lg font-semibold">Stripe Setup Required</span>
        </div>
        <p className="text-muted-foreground mb-4">
          Complete Stripe onboarding to start accepting payments and manage your finances.
        </p>
        <Button onClick={() => nav("/stripe/onboarding")}>
          <ArrowSquareOut size={16} className="mr-2" />
          Complete Stripe Setup
        </Button>
      </Card>
    );
  }

  // Account exists but not fully enabled
  if (!status.charges_enabled) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 text-amber-600 mb-4">
          <Warning size={24} />
          <span className="text-lg font-semibold">Action Required</span>
        </div>
        <p className="text-muted-foreground mb-4">
          Your Stripe account needs additional information before you can accept payments.
        </p>
        {status.currently_due && status.currently_due.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Required information:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {status.currently_due.map((item) => (
                <li key={item}>{item.replace(/_/g, " ")}</li>
              ))}
            </ul>
          </div>
        )}
        <Button onClick={() => nav("/stripe/onboarding")}>
          <ArrowSquareOut size={16} className="mr-2" />
          Complete Setup
        </Button>
      </Card>
    );
  }

  return (
    <StripeConnectProvider salonId={salonId} mode="dashboard">
      <div className="space-y-4">
        <ConnectNotificationBanner />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <Check size={16} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <CreditCard size={16} />
              Payments
            </TabsTrigger>
            <TabsTrigger value="payouts" className="gap-2">
              <Wallet size={16} />
              Payouts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <Check size={24} weight="bold" />
                <span className="text-lg font-semibold">Stripe Account Active</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Charges</p>
                  <Badge variant={status.charges_enabled ? "default" : "secondary"} className="mt-1">
                    {status.charges_enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Payouts</p>
                  <Badge variant={status.payouts_enabled ? "default" : "secondary"} className="mt-1">
                    {status.payouts_enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Details</p>
                  <Badge variant={status.details_submitted ? "default" : "secondary"} className="mt-1">
                    {status.details_submitted ? "Submitted" : "Pending"}
                  </Badge>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Account ID</p>
                  <p className="text-xs font-mono mt-1 truncate">{status.stripeAccountId}</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Your Stripe account is connected and ready. Use the tabs above to view payments, manage disputes, and configure payouts.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Receipt size={20} />
                Payments & Transactions
              </h3>
              <ConnectPayments />
            </Card>
          </TabsContent>

          <TabsContent value="payouts" className="mt-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Wallet size={20} />
                Payouts
              </h3>
              <ConnectPayouts />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StripeConnectProvider>
  );
}
