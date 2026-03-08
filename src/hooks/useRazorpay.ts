import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const checkout = async (planId: string, amount: number, planName: string) => {
    if (!user) {
      toast({ title: "Please sign in first", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Create order via edge function
      const { data, error } = await supabase.functions.invoke("razorpay-create-order", {
        body: { plan_id: planId, amount },
      });

      if (error || !data?.order_id) {
        throw new Error(error?.message || "Failed to create order");
      }

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: "INR",
        name: "Denbase",
        description: `${planName} Plan - Monthly Subscription`,
        order_id: data.order_id,
        handler: async (response: any) => {
          // Verify payment via edge function
          try {
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              "razorpay-verify-payment",
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  plan_id: planId,
                },
              }
            );

            if (verifyError) throw verifyError;

            toast({
              title: "Payment Successful! 🎉",
              description: `You're now on the ${planName} plan.`,
            });
          } catch (err) {
            toast({
              title: "Payment verification failed",
              description: "Please contact support if amount was deducted.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        toast({
          title: "Payment Failed",
          description: response.error.description,
          variant: "destructive",
        });
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { checkout, loading };
};
