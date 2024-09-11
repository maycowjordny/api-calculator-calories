import { Diet } from "../../../../domain/entities/diet-entity";
import { prisma } from "../../../../lib/prisma/prisma";
import { DietRepository } from "../../repositories/diet-repository";
import { DietMapper } from "../mappers/diet/diet-mapper";

export class PrismaDietRepository implements DietRepository {
  async update(description: string[], calories: number): Promise<Diet> {
    const result = await prisma.diet.update({
      data: {
        description,
      },
      where: {
        calories,
      },
    });

    return DietMapper.toDomain(result);
  }

  async findByCalories(calories: number): Promise<Diet | null> {
    const result = await prisma.diet.findFirst({
      where: {
        calories,
      },
    });

    return result && DietMapper.toDomain(result);
  }

  async createCalories(calories: number): Promise<Diet> {
    const result = await prisma.diet.create({
      data: {
        calories,
      },
    });

    return DietMapper.toDomain(result);
  }
}
