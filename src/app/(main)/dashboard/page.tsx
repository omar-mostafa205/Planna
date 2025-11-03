"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { BackgroundGradient } from "@/components/BackgroundGradient";

interface Meal {
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions: string[];
}

interface MealPlanData {
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

async function fetchMealPlan(): Promise<MealPlanData> {
  const response = await fetch('/api/get-plan', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('No meal plan found');
    }
    throw new Error('Failed to fetch meal plan');
  }

  return response.json();
}

export default function Dashboard() {
  const { data: planData, error, isLoading, refetch } = useQuery<MealPlanData>({
    queryKey: ['mealPlan'],
    queryFn: fetchMealPlan,
    retry: (failureCount, error) => {
      // Don't retry if no meal plan exists
      if (error.message.includes('No meal plan found')) {
        return false;
      }
      return failureCount < 2;
    },
  });

  if (isLoading) {
    return (
      <div className="w-full px-4 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your meal plan...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const isNotFound = error.message.includes('No meal plan found');
    
    return (
      <div className="w-full px-4 py-8 max-w-7xl mx-auto">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              {isNotFound ? 'No Meal Plan Found' : 'Error Loading Meal Plan'}
            </h2>
            <p className="text-red-700 mb-4">
              {isNotFound 
                ? 'You haven\'t generated a meal plan yet.'
                : error.message
              }
            </p>
            <BackgroundGradient 
  containerClassName="rounded-[22px] max-w-full p-4 sm:p-10 bg-white dark:bg-zinc-900"
>
  <div className="space-x-2">
    {isNotFound ? (
      <Link 
        href="/plan-form"
        className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Generate Meal Plan
      </Link>
    ) : (
      <Button 
        onClick={() => refetch()}
        className="bg-red-500 hover:bg-red-600"
      >
        Try Again
      </Button>
    )}
  </div>
</BackgroundGradient>

          </div>
        </div>
      </div>
    );
  }

  if (!planData) {
    return (
      <div className="w-full px-4 py-8 max-w-7xl mx-auto">
        <div className="text-center mt-20">
          <h2 className="text-xl font-semibold mb-4">No meal plan available</h2>
          <Link 
            href="/generate-plan"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Generate Your First Meal Plan
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold mb-2">Lean Muscle Building Plan</h1>
            <p className="text-base opacity-90">AI-Generated Based on Your Profile</p>
          </div>
          <div className="flex gap-6">
            <Stat label="Calories" value={planData.calories} />
            <Stat label="Protein" value={`${planData.protein}g`} />
            <Stat label="Carbs" value={`${planData.carbs}g`} />
            <Stat label="Fat" value={`${planData.fat}g`} />
          </div>
        </div>
      </div>

      
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8 bg-white border-1 border-gray-100 rounded-xl p-10">
        <InfoBox label="Weight" value={`${planData.currentWeight} kg`} color="blue"/>
        <InfoBox label="Body Fat" value={`${planData.bodyFat}%`} color="green" />
        <InfoBox label="Muscle Mass" value={`${planData.muscleMass} kg`} color="cyan" />
        <InfoBox label="Goal" value={planData.goal} />
      </div>

      <div className="mb-8 flex gap-4">

        <Link href="/plan-form">
          <Button className="text">Generate New Plan</Button>
        </Link>
      </div>

      {/* All Meals - Full Width */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-800">Daily Meal Plan</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(planData.meals).map(([key, meal]) => (
            <Card key={key} className="p-6 shadow-lg">
              <CardHeader className="p-0 mb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">{meal.title}</CardTitle>
                  <span className="text-sm font-medium text-gray-500 capitalize px-3 py-1 bg-gray-100 rounded-full">
                    {key}
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
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper components remain the same
function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center min-w-[80px]">
      <span className="font-bold text-xl">{value}</span>
      <span className="text-sm opacity-90">{label}</span>
    </div>
  );
}

function InfoBox({
  label,
  value,
  color = "gray",
  fullWidth = false,
}: {
  label: string;
  value: string;
  color?: "gray" | "green" | "cyan" | "blue";
  fullWidth?: boolean;
}) {
  const colorClass =
    color === "green"
      ? "text-green-600"
      : color === "cyan"
      ? "text-cyan-600"
      : "text-gray-700";

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${fullWidth ? "col-span-2" : ""}`}>
      <div className={`font-bold text-xl ${colorClass}`}>{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
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

function NutritionItem({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "text-blue-600",
    green: "text-green-600",
    orange: "text-orange-600",
    purple: "text-purple-600",
  };
  return (
    <div>
      <div className={`font-bold text-lg ${colorMap[color]}`}>{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}