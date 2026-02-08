import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { accountId } = req.query;

    if (!accountId) {
      res.status(400).json({ error: "Missing accountId" });
      return;
    }

    const account = await stripe.accounts.retrieve(accountId as string);

    res.status(200).json({
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
    });
  } catch (error: any) {
    console.error("Stripe account status error:", error);
    res.status(500).json({ error: error.message });
  }
}
