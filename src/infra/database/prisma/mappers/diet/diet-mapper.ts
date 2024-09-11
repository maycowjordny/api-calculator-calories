import { Diet as RawDiet } from "@prisma/client";
import { Diet } from "../../../../../domain/entities/diet-entity";

export class DietMapper {
  static toDomain(rawDiet: RawDiet): Diet {
    return new Diet({
      id: rawDiet.id,
      calories: rawDiet.calories ?? undefined,
      description: rawDiet.description ?? undefined,
      createdAt: rawDiet.createdAt,
      updatedAt: rawDiet.updatedAt,
    });
  }
}
