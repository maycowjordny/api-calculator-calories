export interface StripeRepository {
  createCheckoutSession(): Promise<string>;
}
