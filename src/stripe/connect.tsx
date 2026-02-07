import React, { useMemo } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import { ConnectComponentsProvider } from "@stripe/react-connect-js";
import { postJSON } from "./api";

export function StripeConnectProvider({
  salonId,
  mode,
  children,
}: {
  salonId: string;
  mode: "onboarding" | "dashboard";
  children: React.ReactNode;
}) {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string;

  const connectInstancePromise = useMemo(() => {
    if (!publishableKey) return null;
    return loadConnectAndInitialize({
      publishableKey,
      fetchClientSecret: async () => {
        const { client_secret } = await postJSON<{ client_secret: string }>(
          "/api/stripe/connect/account-session",
          { salonId, mode }
        );
        return client_secret;
      },
      // Optional appearance can be added later
    });
  }, [publishableKey, salonId, mode]);

  if (!publishableKey || !connectInstancePromise) {
    return <div style={{ padding: 16 }}>Missing VITE_STRIPE_PUBLISHABLE_KEY</div>;
  }

  return (
    <ConnectComponentsProvider connectInstance={connectInstancePromise}>
      {children}
    </ConnectComponentsProvider>
  );
}
