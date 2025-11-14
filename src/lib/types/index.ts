export interface Meal {
    title: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    ingredients: string[];
    instructions: string[];
  }
  
  export interface MealPlanData {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    currentWeight: number;
    bodyFat: number;
    muscleMass: number;
    goal: string;
    meals: {
      breakfast: Meal;
      lunch: Meal;
      dinner: Meal;
      snack: Meal;
    };
  }

  export type Plan = {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    popular?: boolean;
    variant?: "default" | "outline" | "secondary";
    buttonText: string;
  };
  
  export type SubscribeParams = {
    planType: string;
    userId: string;
    email: string;
  };
  
  export type SubscriptionResponse = {
    url: string;
  };