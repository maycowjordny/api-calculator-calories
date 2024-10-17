import { makeCreateCheckout } from '@/application/factory/checkout/make-create-checkout';
import { CreateCheckoutException } from '@/application/use-cases/checkout/errors/create-checkout-exception';
import { FastifyReply, FastifyRequest } from 'fastify';

export class CreateCheckoutController {
  public create = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const createCheckoutUseCase = makeCreateCheckout();

      const session = await createCheckoutUseCase.execute();

      reply.status(200).send({ id: session.id, url: session.url });
    } catch (err) {
      return reply.status(err instanceof CreateCheckoutException ? 500 : 409).send({
        name: (err as Error).name,
        message: (err as Error).message,
      });
    }
  };
}
