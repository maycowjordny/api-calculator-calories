import { DietRepository } from "@/infra/database/repositories/diet-repository";
import { formatDiets } from "@/utils/format-diets";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CreateDietException } from "./errors/create-diet-exception";
import { DietNotFoundException } from "./errors/diet-not-found-exception";

export class CreateDietUseCase {
  constructor(private dietRepository: DietRepository) {}

  async execute(calories: number): Promise<string[]> {
    try {
      const existingDiet = await this.dietRepository.findByCalories(calories);

      if (!existingDiet) throw new DietNotFoundException();

      if (existingDiet.description!.length > 0) {
        return existingDiet.description!;
      }

      const updatedDescription = await this.generateDietDescription(calories);

      await this.dietRepository.update(updatedDescription, calories);

      return updatedDescription;
    } catch (err) {
      throw new CreateDietException(err);
    }
  }

  private async generateDietDescription(calories: number): Promise<string[]> {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMINI as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      `5 cardápios de ${calories} calorias e não me mande mais nenhuma informação, apenas o cardápio`
    );

    const response = result.response;
    const text = response.text();

    return formatDiets(text);
  }
}
