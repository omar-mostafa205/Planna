"use client"
import { PricingGrid } from "@/components/PricingGrid";
import { useSubscription } from "@/hooks/useSubscription";
import { plans } from "@/lib/constants";
import { useRouter } from 'next/navigation';

export const SubscriptionPage = () => {
  const router = useRouter();
  const { handleSubscribe, isPending } = useSubscription();

  const onSubscribe = (planType: string) => {
    handleSubscribe(planType, () => {
      router.push('/plan-form');
    });
  };

  return (
    <PricingGrid 
      plans={plans}
      onSubscribe={onSubscribe}
      isPending={isPending}
    />
  );
};

export default SubscriptionPage;