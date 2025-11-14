"use client";

interface MealPlanHeaderProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center min-w-[80px]">
      <span className="font-bold text-xl">{value}</span>
      <span className="text-sm opacity-90">{label}</span>
    </div>
  );
}

export function MealPlanHeader({ calories, protein, carbs, fat }: MealPlanHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-xl p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold mb-2">Lean Muscle Building Plan</h1>
          <p className="text-base opacity-90">AI-Generated Based on Your Profile</p>
        </div>
        <div className="flex gap-6">
          <Stat label="Calories" value={calories} />
          <Stat label="Protein" value={`${protein}g`} />
          <Stat label="Carbs" value={`${carbs}g`} />
          <Stat label="Fat" value={`${fat}g`} />
        </div>
      </div>
    </div>
  );
}