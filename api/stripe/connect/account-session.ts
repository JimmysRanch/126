import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { accountId } = req.body;

    if (!accountId) {
      res.status(400).json({ error: "Missing accountId" });
      return;
    }

    const accountSession = await stripe.accountSessions.create({
      account: accountId,
      components: {
        account_onboarding: {
          enabled: true,
        },
      },
    });

    res.status(200).json({
      clientSecret: accountSession.client_secret,
    });
  } catch (error: any) {
    console.error("Stripe account session error:", error);
    res.status(500).json({ error: error.message });
  }
}
