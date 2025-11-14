import { useMutation } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { toast } from 'sonner';
import { SubscribeParams, SubscriptionResponse } from "@/lib/types";

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

export const useSubscription = () => {
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

  const handleSubscribe = (planType: string, onFreeClick?: () => void) => {
    if (!userId) {
      router.push('/sign-up');
      return;
    }
    if (planType === "free") {
      toast.info("You're already on the Free plan!");
      onFreeClick?.();
      return;
    }
    subscribe(planType.toLowerCase());
  };

  return { handleSubscribe, isPending, userId };
};