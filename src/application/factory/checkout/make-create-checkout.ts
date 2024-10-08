import { CreateCheckoutUseCase } from "@/application/use-cases/checkout/create-checkout-use-case";
import { StripePaymentService } from "@/infra/stripe/stripe-payment-service";

export function makeCreateCheckout() {
  const checkoutRepository = new StripePaymentService();
  const createCheckoutUseCase = new CreateCheckoutUseCase(checkoutRepository);

  return createCheckoutUseCase;
}
