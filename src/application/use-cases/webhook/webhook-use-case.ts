import { stripe } from "@/lib/stripe/stripe";
import Stripe from "stripe";
import { CreatePaymentSessionUseCase } from "../payment-session/create-payment-session";
import { SecretException } from "./errors/secret-exception";
import { WebhookException } from "./errors/webhook-exception";

export class WebHookUseCase {
  constructor(
    private createPaymentSessionUseCase: CreatePaymentSessionUseCase
  ) {}

  async execute(
    event: Stripe.Event,
    body: string | Buffer | undefined,
    signature: string
  ) {
    try {
      const secret: string | undefined = process.env.STRIPE_WEBHOOK_SECRET_KEY;

      if (secret) {
        try {
          event = stripe.webhooks.constructEvent(body!, signature, secret);
        } catch (err: any) {
          throw new SecretException(err);
        }
      }

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;

          if (session.payment_status === "paid") {
            // Pagamento por cartão com sucesso
            const session = event.data.object as Stripe.Checkout.Session;

            const sessionInput = {
              email: session.customer_details?.email!,
              isPaid: true,
              sessionId: session.id,
            };

            return await this.createPaymentSessionUseCase.execute(sessionInput);
          }
          break;
        }

        case "checkout.session.expired": {
          const session = event.data.object as Stripe.Checkout.Session;
          if (session.payment_status === "unpaid") {
            // O cliente saiu do checkout e expirou
            const testeId = session.metadata?.testeId;
            console.log("Checkout expirado", testeId);
          }
          break;
        }

        default:
          console.log(`Evento desconhecido recebido: ${event.type}`);
      }
    } catch (err) {
      throw new WebhookException(err);
    }
  }
}
