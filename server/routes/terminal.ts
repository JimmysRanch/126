import { Router } from "express";
import { z } from "zod";
import { getStripe } from "../stripe.js";
import { getSalon } from "../storage.js";

export const terminalRouter = Router();

const tokenBody = z.object({ salonId: z.string().min(1), locationId: z.string().optional() });

terminalRouter.post("/connection-token", async (req, res) => {
  try {
    const stripe = getStripe();
    const parsed = tokenBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { locationId } = parsed.data;

    // For destination charges model, create token using platform secret key.
    const ct = await stripe.terminal.connectionTokens.create(
      locationId ? { location: locationId } : {}
    );
    return res.json({ secret: ct.secret });
  } catch (err) {
    console.error("Error creating connection token:", err);
    const message = err instanceof Error ? err.message : "Failed to create connection token";
    return res.status(500).json({ error: message });
  }
});

const piBody = z.object({
  salonId: z.string().min(1),
  amountCents: z.number().int().positive(),
  currency: z.string().default("usd"),
  tipCents: z.number().int().min(0).default(0),
  taxCents: z.number().int().min(0).default(0),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

/**
 * Calculate platform application fee in cents.
 * Platform takes 1% of the total charged amount, rounded to the nearest cent.
 * The salon receives the remainder after Stripe processing fees.
 */
function calcAppFeeCents(totalCents: number): number {
  return Math.round(totalCents * 0.01);
}

terminalRouter.post("/payment-intents", async (req, res) => {
  try {
    const stripe = getStripe();
    const parsed = piBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { salonId, amountCents, currency, tipCents, taxCents, description, metadata } = parsed.data;

    const salon = getSalon(salonId);
    if (!salon.stripeAccountId) return res.status(400).json({ error: "No connected account" });

    const total = amountCents + tipCents + taxCents;
    const applicationFee = calcAppFeeCents(total);

    const pi = await stripe.paymentIntents.create({
      amount: total,
      currency,
      description,
      metadata: { ...(metadata ?? {}), salonId },
      payment_method_types: ["card_present"],
      capture_method: "manual",
      application_fee_amount: applicationFee,
      on_behalf_of: salon.stripeAccountId,
      transfer_data: { destination: salon.stripeAccountId },
    });

    return res.json({ client_secret: pi.client_secret, payment_intent_id: pi.id });
  } catch (err) {
    console.error("Error creating payment intent:", err);
    const message = err instanceof Error ? err.message : "Failed to create payment intent";
    return res.status(500).json({ error: message });
  }
});

const captureBody = z.object({ paymentIntentId: z.string().min(1) });

terminalRouter.post("/capture", async (req, res) => {
  try {
    const stripe = getStripe();
    const parsed = captureBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const pi = await stripe.paymentIntents.capture(parsed.data.paymentIntentId);
    return res.json({ payment_intent: pi });
  } catch (err) {
    console.error("Error capturing payment:", err);
    const message = err instanceof Error ? err.message : "Failed to capture payment";
    return res.status(500).json({ error: message });
  }
});
