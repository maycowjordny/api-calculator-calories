import { StripeRepository } from "@/infra/stripe/repositories/stripe-repository";
import Stripe from "stripe";
import { CreateCheckoutException } from "./errors/create-checkout-exception";

export class CreateCheckoutUseCase {
  constructor(private stripeRepository: StripeRepository) {}

  async execute(): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    try {
      return this.stripeRepository.createCheckoutSession();
    } catch (err) {
      throw new CreateCheckoutException(err);
    }
  }
}
