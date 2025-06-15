
import { supabase } from "@/integrations/supabase/client";

/**
 * Log a post creation or edit attempt to Supabase.
 * @param reportId string (may be empty for new posts)
 * @param action "create" | "edit"
 * @param title string
 * @param status "success" | "fail"
 * @param error string | null
 */
export const logPostSaveAttempt = async ({
  reportId,
  action,
  title,
  status,
  error = null,
}: {
  reportId?: string,
  action: "create" | "edit",
  title?: string,
  status: "success" | "fail",
  error?: string | null,
}) => {
  try {
    await supabase.from("post_save_logs").insert([
      {
        report_id: reportId ?? "",
        action,
        title: title ?? "",
        status,
        error,
      },
    ]);
    // No toast here: this is silent logging.
  } catch (logError) {
    console.error("Failed to log post save attempt:", logError);
  }
};
