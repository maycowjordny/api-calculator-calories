import { CreateCaloriesUseCase } from "@/application/use-cases/diet/create-calories-use-case";
import { PrismaDietRepository } from "@/infra/database/prisma/repositories/prisma-diet-repository";

export function makeCreateCalories() {
  const dietRepository = new PrismaDietRepository();
  const createCaloriesUseCase = new CreateCaloriesUseCase(dietRepository);

  return createCaloriesUseCase;
}
