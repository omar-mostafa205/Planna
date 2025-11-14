"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles, Zap } from "lucide-react";
import { plans } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type SubscribeParams = {
  planType: string;
  userId: string;
  email: string;
};


type SubscriptionResponse = {
  url: string;
};

const subscribeToPlan = async ({
  planType,
  userId,
  email,
}: SubscribeParams): Promise<SubscriptionResponse> => {
  try {
    const res = await axios.post<SubscriptionResponse>('/api/check-out', {
      userId,
      planType,
      email,
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Payment processing failed');
    }
    throw new Error('An unexpected error occurred');
  }
};

export const SubscriptionPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const userId = user?.id;
  const email = user?.emailAddresses?.[0]?.emailAddress || '';

  const { mutate: subscribe, isPending } = useMutation<
    SubscriptionResponse,
    Error,
    string
  >({
    mutationFn: async (planType: string) => {
      if (!userId || !email) {
        throw new Error('User information missing');
      }
      return subscribeToPlan({ planType, userId, email });
    },
    onMutate: () => {
      toast.loading('Processing your subscription...', { id: 'subscribe' });
    },
    onSuccess: (data) => {
      toast.success('Redirecting to checkout!', { id: 'subscribe' });
      window.location.href = data.url;
    },
    onError: (error) => {
      toast.error(error.message, { id: 'subscribe' });
    },
  });

  const handleSubscribe = (planType: string) => {
    if (!userId) {
      router.push('/sign-up');
      return;
    }
    if (planType === "free") {
      toast.info("You're already on the Free plan!");
      return;
    }
    subscribe(planType.toLowerCase());
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
 
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
          </div>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            Unlock the full potential of AI-powered nutrition planning with features designed for your health journey
          </p>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
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

                {/* Button */}
                <Button 
               onClick={() => {
                 if (plan.name === "Popular" || plan.name === "Basic") {
                   handleSubscribe(plan.name.toLowerCase());
                 }
                 else if (plan.name === "Free") {
                   toast.info("You're already on the Free plan!");
                   router.push('/plan-form')
                 }  
               }}
                className={`w-full h-12 cursor:pointer text-base font-semibold ${
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
