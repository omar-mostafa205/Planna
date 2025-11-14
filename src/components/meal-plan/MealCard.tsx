"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Meal } from "@/types/meal-plan";

interface MealCardProps {
  meal: Meal;
  mealType: string;
}

function NutritionInfo({
  calories,
  protein,
  carbs,
  fat,
}: {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}) {
  const colorMap: Record<string, string> = {
    blue: "text-blue-600",
    green: "text-green-600",
    orange: "text-orange-600",
    purple: "text-purple-600",
  };

  const NutritionItem = ({
    label,
    value,
    color,
  }: {
    label: string;
    value: string | number;
    color: string;
  }) => (
    <div>
      <div className={`font-bold text-lg ${colorMap[color]}`}>{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="grid grid-cols-4 gap-2 text-center">
        <NutritionItem label="Calories" value={calories} color="blue" />
        <NutritionItem label="Protein" value={`${protein}g`} color="green" />
        <NutritionItem label="Carbs" value={`${carbs}g`} color="orange" />
        <NutritionItem label="Fat" value={`${fat}g`} color="purple" />
      </div>
    </div>
  );
}

export function MealCard({ meal, mealType }: MealCardProps) {
  return (
    <Card className="p-6 shadow-lg">
      <CardHeader className="p-0 mb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{meal.title}</CardTitle>
          <span className="text-sm font-medium text-gray-500 capitalize px-3 py-1 bg-gray-100 rounded-full">
            {mealType}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0 space-y-6">
        <NutritionInfo
          calories={meal.calories}
          protein={meal.protein}
          carbs={meal.carbs}
          fat={meal.fat}
        />
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
          <ul className="list-disc list-inside space-y-2 text-base">
            {meal.ingredients.map((ing, i) => (
              <li key={i} className="text-gray-700">{ing}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-base">
            {meal.instructions.map((inst, i) => (
              <li key={i} className="text-gray-700">{inst}</li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
