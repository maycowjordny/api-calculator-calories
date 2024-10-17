import { PaymentTypeEnum } from '@/domain/enum/payment-type';
import { WebHookInput } from '@/domain/interfaces/webhook';
import { stripe } from '@/lib/stripe/stripe';
import Stripe from 'stripe';
import { CreatePaymentSessionUseCase } from '../payment-session/create-payment-session';
import { SecretException } from './errors/secret-exception';
import { WebhookException } from './errors/webhook-exception';

export class WebHookUseCase {
  constructor(private createPaymentSessionUseCase: CreatePaymentSessionUseCase) {}

  async execute({ body, signature, event }: WebHookInput) {
    try {
      const secret: string = process.env.STRIPE_WEBHOOK_SECRET_KEY!;

      if (secret) {
        try {
          event = stripe.webhooks.constructEvent(body!, signature, secret);
        } catch (err: any) {
          throw new SecretException(err);
        }
      }

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;

          if (session.payment_status === 'paid') {
            // Pagamento por cartão com sucesso
            const session = event.data.object as Stripe.Checkout.Session;

            const sessionInput = {
              email: session.customer_details?.email!,
              isPaid: true,
              sessionId: session.id,
              paymentType: PaymentTypeEnum.CARD,
            };

            return await this.createPaymentSessionUseCase.execute(sessionInput);
          }

          if (event.data.object.payment_status === 'unpaid' && event.data.object.payment_intent) {
            // Pagamento por boleto
            const paymentIntent = await stripe.paymentIntents.retrieve(
              event.data.object.payment_intent.toString()
            );

            const hostedVoucherUrl =
              paymentIntent.next_action?.boleto_display_details?.hosted_voucher_url;

            if (hostedVoucherUrl) {
              // O cliente gerou um boleto, manda um email pra ele
              const userEmail = event.data.object.customer_details?.email;
              console.log('gerou o boleto e o link é', hostedVoucherUrl);
            }
          }
          break;
        }

        case 'checkout.session.async_payment_succeeded':
          if (event.data.object.payment_status === 'paid') {
            const session = event.data.object as Stripe.Checkout.Session;
            // O cliente pagou o boleto e o pagamento foi confirmado
            const sessionInput = {
              email: session.customer_details?.email!,
              isPaid: true,
              sessionId: session.id,
              paymentType: PaymentTypeEnum.BOLETO,
            };

            return await this.createPaymentSessionUseCase.execute(sessionInput);
          }
          break;

        case 'checkout.session.async_payment_failed':
          if (event.data.object.payment_status === 'unpaid') {
            const session = event.data.object as Stripe.Checkout.Session;

            const sessionInput = {
              email: session.customer_details?.email!,
              isPaid: false,
              sessionId: session.id,
              paymentType: PaymentTypeEnum.BOLETO,
            };

            return await this.createPaymentSessionUseCase.execute(sessionInput);
          }
          break;

        default:
      }
    } catch (err) {
      throw new WebhookException(err);
    }
  }
}
