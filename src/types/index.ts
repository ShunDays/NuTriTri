export interface FoodReference {
  id: string;
  name: string;
  calories: number;  // pour 100g
  proteins: number;  // pour 100g
  carbs: number;     // pour 100g
  fats: number;      // pour 100g
  unit: 'g' | 'ml' | 'unité';
}

export interface Food {
  id: string;
  referenceId: string;  // référence à l'aliment de base
  name: string;
  quantity: number;     // quantité en grammes/ml/unités
  calories: number;     // calculé automatiquement
  proteins: number;     // calculé automatiquement
  carbs: number;        // calculé automatiquement
  fats: number;         // calculé automatiquement
}

export interface Meal {
  id: string;
  name: string;
  foods: Food[];
  date: string;
}

export interface NutritionGoals {
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}

export interface DailyNutrition {
  date: string;
  totalCalories: number;
  totalProteins: number;
  totalCarbs: number;
  totalFats: number;
} 