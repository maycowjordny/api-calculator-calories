import { Diet } from "@/domain/entities/diet-entity";
import { Diet as RawDiet } from "@prisma/client";
import { DietMapper } from "./diet-mapper";

export class CreateDietMapper extends DietMapper {
  static toPrisma(diet: Diet): RawDiet {
    return {
      id: diet.id,
      calories: diet.calories ?? null,
      description: diet.description ?? [],
      createdAt: diet.createdAt!,
      updatedAt: diet.updatedAt!,
    };
  }
}
