import { StripeRepository } from "@/infra/stripe/repositories/stripe-repository";
import { CreateCheckoutException } from "./errors/create-checkout-exception";

export class CreateCheckoutUseCase {
  constructor(private stripeRepository: StripeRepository) {}

  async execute(): Promise<string> {
    try {
      return this.stripeRepository.createCheckoutSession();
    } catch (err) {
      throw new CreateCheckoutException(err);
    }
  }
}
