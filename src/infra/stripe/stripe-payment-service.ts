import Stripe from "stripe";
import { StripeRepository } from "./repositories/stripe-repository";

export class StripePaymentService implements StripeRepository {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-09-30.acacia",
      appInfo: {
        name: "Fit-Caloria",
      },
    });
  }

  async createCheckoutSession(): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1Q7H4wJMMqaVQXpHifnZRv1N",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel",
    });

    return session.url!;
  }
}
