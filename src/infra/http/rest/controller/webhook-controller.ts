import { makeWebhook } from "@/application/factory/webhook/make-webhook-factory";
import { FastifyReply, FastifyRequest } from "fastify";
import { Stripe } from "stripe";

const secret: string | undefined = process.env.STRIPE_WEBHOOK_SECRET_KEY;

export class WebhookController {
  public create = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      let event = request.body as Stripe.Event;
      const body = request.rawBody;
      const signature = request.headers["stripe-signature"] as string;

      const webhookUseCase = makeWebhook();

      await webhookUseCase.execute(event, body, signature);

      return reply.status(200).send({ result: event, ok: true });
    } catch (err: any) {
      console.error("Erro no webhook:", err);
      return reply.status(500).send({
        message: `Erro no webhook: ${err.message}`,
        ok: false,
      });
    }
  };
}
