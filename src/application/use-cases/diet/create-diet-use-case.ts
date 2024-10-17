import { CreateDietInput, DietResult } from '@/domain/interfaces/diet';
import { formatDiets } from '@/utils/format-diets';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { VerifyPaymentSessionUseCase } from '../payment-session/verify-payment-session';
import { CreateDietException } from './errors/create-diet-exception';
import { DietDescriptionFailedException } from './errors/diet-description-failed-exception';

export class CreateDietUseCase {
  constructor(private verifyPaymentSessionUseCase: VerifyPaymentSessionUseCase) {}

  async execute({ calories, excludedFoods, sessionId }: CreateDietInput): Promise<DietResult> {
    try {
      await this.verifyPaymentSessionUseCase.execute(sessionId);

      const dietDescription = await this.generateDietDescription(calories, excludedFoods);

      return { description: dietDescription };
    } catch (err) {
      throw new CreateDietException(err);
    }
  }

  private async generateDietDescription(
    calories: number,
    excludedFoods: string[]
  ): Promise<string> {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMINI as string);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const generateDiet = await model.generateContent(
      excludedFoods
        ? `${calories} calorias. Crie 1 cardápio equilibrado com proteínas, carboidratos e gorduras saudáveis, excluindo: ${excludedFoods}.`
        : `${calories} calorias. Crie 1 cardápio equilibrado com proteínas, carboidratos e gorduras saudáveis.`
    );

    const response = generateDiet.response;
    const dietDescription = response.text();

    if (!dietDescription) {
      throw new DietDescriptionFailedException();
    }

    return formatDiets(dietDescription);
  }
}
