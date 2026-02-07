import { Router } from "express";
import { z } from "zod";
import { getStripe } from "../stripe.js";
import { getSalon, upsertSalon } from "../storage.js";
import Stripe from "stripe";

export const connectRouter = Router();

const ensureAccountBody = z.object({ salonId: z.string().min(1), country: z.string().default("US") });

connectRouter.post("/accounts", async (req, res) => {
  try {
    const stripe = getStripe();
    const parsed = ensureAccountBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { salonId, country } = parsed.data;

    const salon = getSalon(salonId);
    if (salon.stripeAccountId) return res.json({ stripeAccountId: salon.stripeAccountId });

    // Use Express accounts for fastest operational path. Embedded components work with this.
    const acct = await stripe.accounts.create({
      type: "express",
      country,
      capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
      // Optional: business_profile prefill if you have it later
    });

    upsertSalon(salonId, { stripeAccountId: acct.id });
    return res.json({ stripeAccountId: acct.id });
  } catch (err) {
    console.error("Error creating Stripe account:", err);
    const message = err instanceof Error ? err.message : "Failed to create Stripe account";
    return res.status(500).json({ error: message });
  }
});

const accountSessionBody = z.object({
  salonId: z.string().min(1),
  components: z.record(z.any()).optional(), // we will build from flags below
  mode: z.enum(["onboarding", "dashboard"]).default("dashboard"),
});

connectRouter.post("/account-session", async (req, res) => {
  try {
    const stripe = getStripe();
    const parsed = accountSessionBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { salonId, mode } = parsed.data;

    const salon = getSalon(salonId);
    if (!salon.stripeAccountId) return res.status(400).json({ error: "No connected account. Call POST /accounts first." });
    const account = salon.stripeAccountId;

    // Enable components based on our app needs.
    // Stripe enforces these parameters for any embedded component for this session.
    const components: Stripe.AccountSessionCreateParams.Components = mode === "onboarding"
      ? {
          account_onboarding: { enabled: true },
          notification_banner: { enabled: true },
        }
      : {
          notification_banner: { enabled: true },
          payouts: {
            enabled: true,
            features: {
              instant_payouts: true,
              standard_payouts: true,
              edit_payout_schedule: true,
              external_account_collection: true,
            },
          },
          payments: {
            enabled: true,
            features: {
              refund_management: true,
              dispute_management: true,
              capture_payments: true,
              // destination_on_behalf_of_charge_management only if you use on_behalf_of destination charges
              destination_on_behalf_of_charge_management: true,
            },
          },
        };

    const session = await stripe.accountSessions.create({
      account,
      components,
    });

    return res.json({ client_secret: session.client_secret });
  } catch (err) {
    console.error("Error creating account session:", err);
    const message = err instanceof Error ? err.message : "Failed to create account session";
    return res.status(500).json({ error: message });
  }
});

connectRouter.get("/status", async (req, res) => {
  try {
    const stripe = getStripe();
    const salonId = String(req.query.salonId || "");
    if (!salonId) return res.status(400).json({ error: "Missing salonId" });
    const salon = getSalon(salonId);
    if (!salon.stripeAccountId) return res.json({ exists: false });

    const acct = await stripe.accounts.retrieve(salon.stripeAccountId);
    const requirements = acct.requirements;
    return res.json({
      exists: true,
      stripeAccountId: acct.id,
      details_submitted: acct.details_submitted ?? false,
      charges_enabled: acct.charges_enabled ?? false,
      payouts_enabled: acct.payouts_enabled ?? false,
      currently_due: requirements?.currently_due ?? [],
      eventually_due: requirements?.eventually_due ?? [],
      disabled_reason: requirements?.disabled_reason ?? null,
      capabilities: acct.capabilities ?? {},
    });
  } catch (err) {
    console.error("Error getting account status:", err);
    const message = err instanceof Error ? err.message : "Failed to get account status";
    return res.status(500).json({ error: message });
  }
});
