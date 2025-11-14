import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap } from "lucide-react";
import { Plan } from "@/lib/types";

type PricingCardProps = {
  plan: Plan;
  onSubscribe: (planType: string) => void;
  isPending?: boolean;
};

export const PricingCard = ({ plan, onSubscribe, isPending }: PricingCardProps) => {
  return (
    <Card 
      className={`relative transition-all duration-300 ${
        plan.popular 
          ? "border-[2px] border-blue-500 shadow-xl ring-2 ring-blue-400 scale-105"
          : "border hover:border-blue-300 hover:shadow-lg hover:-translate-y-1"
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-4 py-1 text-sm rounded-full shadow flex items-center">
            <Sparkles className="h-3 w-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-8 pt-6">
        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-blue-600">{plan.price}</span>
          <span className="text-gray-500">/{plan.period}</span>
        </div>
        <CardDescription className="text-base mt-2 text-gray-600">
          {plan.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-4 mb-8">
          {plan.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        <Button 
          onClick={() => onSubscribe(plan.name.toLowerCase())}
          disabled={isPending}
          className={`w-full h-12 text-base font-semibold ${
            plan.popular
              ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white hover:opacity-90"
              : ""
          }`}
          variant={!plan.popular ? plan.variant : undefined}
        >
          {plan.popular && <Zap className="h-4 w-4 mr-2" />}
          {plan.buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};
