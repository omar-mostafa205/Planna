"use client";

interface UserStatsProps {
  currentWeight: number;
  bodyFat: number;
  muscleMass: number;
  goal: string;
}

function InfoBox({
  label,
  value,
  color = "gray",
}: {
  label: string;
  value: string;
  color?: "gray" | "green" | "cyan" | "blue";
}) {
  const colorClass =
    color === "green"
      ? "text-green-600"
      : color === "cyan"
      ? "text-cyan-600"
      : color === "blue"
      ? "text-blue-600"
      : "text-gray-700";

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className={`font-bold text-xl ${colorClass}`}>{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}

export function UserStats({ currentWeight, bodyFat, muscleMass, goal }: UserStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8 bg-white border-1 border-gray-100 rounded-xl p-10">
      <InfoBox label="Weight" value={`${currentWeight} kg`} color="blue" />
      <InfoBox label="Body Fat" value={`${bodyFat}%`} color="green" />
      <InfoBox label="Muscle Mass" value={`${muscleMass} kg`} color="cyan" />
      <InfoBox label="Goal" value={goal} />
    </div>
  );
}
