import { Diet } from "../../../domain/entities/diet-entity";

export interface DietRepository {
  createCalories(calories: number): Promise<Diet>;
  update(description: string[], calories: number): Promise<Diet>;
  findByCalories(calories: number): Promise<Diet | null>;
}
