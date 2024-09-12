import {
  CalculateCalories,
  CaloriesResult,
} from "@/domain/interfaces/calculate-calories";
import { DietRepository } from "@/infra/database/repositories/diet-repository";
import { roundToDecimals } from "@/utils/round-to-decimals";
import { roundToNearestHundred } from "@/utils/round-to-nearest-hundred";

export class CreateCaloriesUseCase {
  constructor(private dietRepository: DietRepository) {}

  async execute(inputCalories: CalculateCalories): Promise<CaloriesResult> {
    try {
      const { activity, age, gender, height, weight, weightGoal } =
        inputCalories;

      let basalMetabolicRate: number = 0;

      if (gender === "female") {
        basalMetabolicRate = 10 * weight + 6.25 * height - 5 * age - 161;
      } else {
        basalMetabolicRate = 10 * weight + 6.25 * height - 5 * age + 5;
      }

      const totalCalories = basalMetabolicRate * activity;

      const totalCaloriesWithWeightGoal =
        weightGoal > weight
          ? totalCalories + 300
          : totalCalories - totalCalories * 0.2;

      const protein = weight * 2;
      const fat = weight * 0.8;
      const carbs = (totalCaloriesWithWeightGoal - (protein * 4 + fat * 9)) / 4;

      const resultCaloriesRounded = roundToNearestHundred(
        totalCaloriesWithWeightGoal
      );
      const proteinRounded = roundToDecimals(protein);
      const fatRounded = roundToDecimals(fat);
      const carbsRounded = roundToDecimals(carbs);

      let existingCalories = await this.dietRepository.findByCalories(
        resultCaloriesRounded
      );

      if (!existingCalories) {
        existingCalories = await this.dietRepository.createCalories(
          resultCaloriesRounded
        );
      }

      return {
        quantity: existingCalories.calories!,
        protein: proteinRounded,
        fat: fatRounded,
        carbs: carbsRounded,
      };
    } catch (err: any) {
      throw new Error("Erro ao criar as calorias");
    }
  }
}
