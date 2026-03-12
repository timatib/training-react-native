export interface NutritionLog {
  id: string;
  userId: string;
  meal: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  aiAnalysis?: string;
  createdAt: string;
}

export interface DailySummary {
  date: string;
  logs: NutritionLog[];
  totals: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  calorieGoal: number;
  remaining: number;
}
