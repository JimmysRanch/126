import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  // Use latest installed stripe-node. Keep apiVersion default unless your codebase pins it.
  return new Stripe(key, { typescript: true });
}
