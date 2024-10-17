export interface DietResult {
  description: string;
}

export interface CreateDietInput {
  calories: number;
  excludedFoods: string[];
  sessionId?: string;
}
