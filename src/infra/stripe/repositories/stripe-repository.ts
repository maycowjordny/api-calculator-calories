import Stripe from 'stripe';

export interface StripeRepository {
  createCheckoutSession(): Promise<Stripe.Response<Stripe.Checkout.Session>>;
}
