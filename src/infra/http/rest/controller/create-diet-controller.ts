import { makeCreateDiet } from '@/application/factory/diet/make-create-diet-factory';
import { CreateDietException } from '@/application/use-cases/diet/errors/create-diet-exception';
import { FastifyReply, FastifyRequest } from 'fastify';

export class CreateDietController {
  public create = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const makeCreateDietUseCase = makeCreateDiet();
      const { calories, sessionId, excludedFoods } = request.body as {
        calories: number;
        sessionId: string;
        excludedFoods: string[];
      };

      const { description } = await makeCreateDietUseCase.execute({
        calories,
        sessionId,
        excludedFoods,
      });

      return reply.status(201).send({ diet: description });
    } catch (err) {
      return reply.status(err instanceof CreateDietException ? 500 : 409).send({
        name: (err as Error).name,
        message: (err as Error).message,
      });
    }
  };
}
