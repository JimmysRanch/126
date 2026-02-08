import { Router, raw } from "express";
import { getStripe } from "../stripe.js";
import { pushEvent } from "../storage.js";

export const webhookRouter = Router();

webhookRouter.post(
  "/webhook",
  // IMPORTANT: raw body required for signature verification
  raw({ type: "application/json" }),
  (req, res) => {
    const stripe = getStripe();
    const sig = req.headers["stripe-signature"];
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) return res.status(500).send("Missing STRIPE_WEBHOOK_SECRET");

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig as string, secret);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return res.status(400).send(`Webhook Error: ${message}`);
    }

    // Try to associate to salonId via metadata if present.
    // Many objects include metadata; for account.updated you may not have it.
    const anyObj = event.data.object as Record<string, unknown>;
    const metadata = anyObj?.metadata as Record<string, unknown> | undefined;
    const salonId = metadata?.salonId;

    if (!salonId) {
      console.warn(`Webhook event ${event.type} (${event.id}) has no salonId in metadata`);
    }

    pushEvent(String(salonId || "unknown"), { id: event.id, type: event.type, created: event.created });

    // TODO: later: handle dispute created, payment succeeded, etc.
    res.json({ received: true });
  }
);
