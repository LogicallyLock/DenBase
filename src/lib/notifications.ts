import { supabase } from "@/integrations/supabase/client";

export const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  referenceId?: string
) => {
  await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title,
    message,
    reference_id: referenceId,
  });
};
