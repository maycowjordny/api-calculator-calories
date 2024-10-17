import { CreateCaloriesUseCase } from '@/application/use-cases/diet/create-calories-use-case';

export function makeCreateCalories() {
  const createCaloriesUseCase = new CreateCaloriesUseCase();

  return createCaloriesUseCase;
}
