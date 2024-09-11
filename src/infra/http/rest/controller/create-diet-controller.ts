import { makeCreateDiet } from "@/application/factory/diet/make-create-diet-factory";
import { FastifyReply, FastifyRequest } from "fastify";

export class CreateDietController {
  public create = async (request: FastifyRequest, reply: FastifyReply) => {
    const makeCreateDietUseCase = makeCreateDiet();
    const { calories } = request.body as { calories: number };

    const diet = await makeCreateDietUseCase.execute(calories);

    reply.status(201).send({ diet: diet });
  };
}
