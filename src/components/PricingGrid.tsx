import { Crown } from "lucide-react";
import { PricingCard } from "@/components/PricingCard";
import { Plan } from "@/lib/types";

type PricingGridProps = {
  plans: Plan[];
  onSubscribe: (planType: string) => void;
  isPending?: boolean;
  title?: string;
  subtitle?: string;
};

export const PricingGrid = ({ 
  plans, 
  onSubscribe, 
  isPending,
  title = "Choose Your Plan",
  subtitle = "Unlock the full potential of AI-powered nutrition planning with features designed for your health journey"
}: PricingGridProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
              {title}
            </h1>
          </div>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              onSubscribe={onSubscribe}
              isPending={isPending}
            />
          ))}
        </div>
      </div>
    </div>
  );
};