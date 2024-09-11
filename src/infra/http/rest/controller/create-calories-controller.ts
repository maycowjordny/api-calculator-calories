import { makeCreateCalories } from "@/application/factory/diet/make-create-calories-factory";
import { CalculateCalories } from "@/domain/interfaces/calculate-calories";
import { FastifyReply, FastifyRequest } from "fastify";

export class CreateCaloriesController {
  public create = async (request: FastifyRequest, reply: FastifyReply) => {
    const makeCreateCaloriesUseCase = makeCreateCalories();

    const calories = await makeCreateCaloriesUseCase.execute(
      request.body as CalculateCalories
    );

    reply.status(201).send({ calories: calories });
  };
}
