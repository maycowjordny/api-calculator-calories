import { CreateDietUseCase } from "@/application/use-cases/diet/create-diet-use-case";
import { PrismaDietRepository } from "@/infra/database/prisma/repositories/prisma-diet-repository";

export function makeCreateDiet() {
  const dietRepository = new PrismaDietRepository();
  const createDietUseCase = new CreateDietUseCase(dietRepository);

  return createDietUseCase;
}
