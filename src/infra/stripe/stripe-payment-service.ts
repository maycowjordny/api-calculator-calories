import { stripe } from "@/lib/stripe/stripe";
import Stripe from "stripe";
import { StripeRepository } from "./repositories/stripe-repository";

export class StripePaymentService implements StripeRepository {
  async createCheckoutSession(): Promise<
    Stripe.Response<Stripe.Checkout.Session>
  > {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.BASE_URL}/`,
      cancel_url: `${process.env.BASE_URL}/`,
    });

    return session;
  }
}
