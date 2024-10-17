import { makeCreateCalories } from '@/application/factory/diet/make-create-calories-factory';
import { CreateCaloriesException } from '@/application/use-cases/diet/errors/create-calories-exception';
import { CalculateCalories } from '@/domain/interfaces/calculate-calories';
import { FastifyReply, FastifyRequest } from 'fastify';

export class CreateCaloriesController {
  public create = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const makeCreateCaloriesUseCase = makeCreateCalories();

      const calories = await makeCreateCaloriesUseCase.execute(request.body as CalculateCalories);

      return reply.status(201).send({ calories: calories });
    } catch (err) {
      return reply.status(err instanceof CreateCaloriesException ? 500 : 409).send({
        name: (err as Error).name,
        message: (err as Error).message,
      });
    }
  };
}
