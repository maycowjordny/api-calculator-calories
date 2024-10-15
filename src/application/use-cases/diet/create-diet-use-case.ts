import { DietRepository } from "@/infra/database/repositories/diet-repository";
import { formatDiets } from "@/utils/format-diets";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SessionNotPaidException } from "../payment-session/errors/session-not-paid-exception";
import { VerifyPaymentSessionUseCase } from "../payment-session/verify-payment-session";
import { CreateDietException } from "./errors/create-diet-exception";
import { DietNotFoundException } from "./errors/diet-not-found-exception";

export class CreateDietUseCase {
  constructor(
    private dietRepository: DietRepository,
    private verifyPaymentSessionUseCase: VerifyPaymentSessionUseCase
  ) {}

  async execute(
    calories: number,
    excludedFoods: string[],
    sessionId?: string
  ): Promise<string[]> {
    try {
      await this.ensureSessionIsPaid(excludedFoods, sessionId);

      const existingDiet = await this.dietRepository.findByCalories(calories);

      if (!existingDiet) throw new DietNotFoundException();

      if (existingDiet.description!.length > 0) {
        return existingDiet.description!;
      }

      const updatedDescription = await this.generateDietDescription(
        calories,
        excludedFoods
      );

      await this.dietRepository.update(updatedDescription, calories);

      return updatedDescription;
    } catch (err) {
      throw new CreateDietException(err);
    }
  }

  private async ensureSessionIsPaid(
    excludedFoods: string[],
    sessionId?: string
  ) {
    const isPaidSession = await this.verifyPaymentSessionUseCase.execute(
      sessionId
    );

    if (!isPaidSession && excludedFoods.length > 0)
      throw new SessionNotPaidException();
  }

  private async generateDietDescription(
    calories: number,
    excludedFoods: string[]
  ): Promise<string[]> {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMINI as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      excludedFoods
        ? `5 cardápios de ${calories} calorias sem esses alimentos: ${excludedFoods}. Não me envie mais nenhuma informação, apenas o cardápio.`
        : `5 cardápios de ${calories} calorias. Não me envie mais nenhuma informação, apenas o cardápio.`
    );

    const response = result.response;
    const text = response.text();

    return formatDiets(text);
  }
}
