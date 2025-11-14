"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { MealPlanHeader } from "@/components/meal-plan/MealPlanHeader";
import { UserStats } from "@/components/meal-plan/UserStats";
import { MealCard } from "@/components/meal-plan/MealCard";
import { EmptyState } from "@/components/meal-plan/EmptyState";
import type { MealPlanData } from "@/types/meal-plan";

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
      <EmptyState 
        isError 
        isNotFound={isNotFound}
        errorMessage={error.message}
        onRetry={() => refetch()}
      />
    );
  }

  if (!planData) {
    return <EmptyState />;
  }
  
  return (
    <div className="w-full px-4 py-8 max-w-7xl mx-auto">
      <MealPlanHeader 
        calories={planData.calories}
        protein={planData.protein}
        carbs={planData.carbs}
        fat={planData.fat}
      />

      <UserStats 
        currentWeight={planData.currentWeight}
        bodyFat={planData.bodyFat}
        muscleMass={planData.muscleMass}
        goal={planData.goal}
      />

      <div className="mb-8 flex gap-4">
        <Link href="/plan-form">
          <Button>Generate New Plan</Button>
        </Link>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-800">Daily Meal Plan</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(planData.meals).map(([key, meal]) => (
            <MealCard key={key} meal={meal} mealType={key} />
          ))}
        </div>
      </div>
    </div>
  );
}