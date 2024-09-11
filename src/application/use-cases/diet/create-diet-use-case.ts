import { DietRepository } from "@/infra/database/repositories/diet-repository";
import { formatMenus } from "@/utils/format-menus";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class CreateDietUseCase {
  constructor(private dietRepository: DietRepository) {}

  async execute(calories: number): Promise<string[]> {
    try {
      const existingDiet = await this.dietRepository.findByCalories(calories);

      if (!existingDiet) {
        throw new Error(
          "Diet not found. Ensure the diet exists before updating."
        );
      }

      const updatedDescription = await this.generateDietDescription(calories);

      await this.dietRepository.update(updatedDescription, calories);

      return updatedDescription;
    } catch (err: any) {
      console.error("Error in CreateDietUseCase:", err.message);
      throw new Error("Failed to update diet: " + err.message);
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
    return formatMenus(text);
  }
}
