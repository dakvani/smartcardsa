import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface AuditLogParams {
  action: "CREATE" | "UPDATE" | "DELETE" | "BULK_DELETE" | "BULK_UPDATE";
  tableName: string;
  recordId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
}

export async function logAdminAction({
  action,
  tableName,
  recordId,
  oldValues,
  newValues,
}: AuditLogParams): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("audit_logs").insert([{
      admin_user_id: user.id,
      action,
      table_name: tableName,
      record_id: recordId,
      old_values: oldValues ? (oldValues as unknown as Json) : null,
      new_values: newValues ? (newValues as unknown as Json) : null,
    }]);
  } catch (error) {
    console.error("Failed to log admin action:", error);
  }
}