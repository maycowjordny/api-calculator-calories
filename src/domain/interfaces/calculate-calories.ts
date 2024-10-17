export interface CalculateCalories {
  activity: number;
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  weightGoal: number;
}

export interface CaloriesResult {
  quantity?: number;
  protein: number;
  fat: number;
  carbs: number;
}
