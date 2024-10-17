import { makeVerifyPaymentSession } from '@/application/factory/verify-payment-session/make-verify-payment-session';
import { CreateDietException } from '@/application/use-cases/diet/errors/create-diet-exception';
import { FastifyReply, FastifyRequest } from 'fastify';

export class VerifyPaymentSessionController {
  public verify = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { sessionId } = request.body as { sessionId: string };

      const makeVerifyPaymentUseCase = makeVerifyPaymentSession();

      const session = await makeVerifyPaymentUseCase.execute(sessionId);

      return reply.status(201).send({ session });
    } catch (err: any) {
      return reply.status(err instanceof CreateDietException ? 500 : 409).send({
        name: (err as Error).name,
        message: (err as Error).message,
      });
    }
  };
}
