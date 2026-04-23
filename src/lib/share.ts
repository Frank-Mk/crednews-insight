import { supabase } from "@/integrations/supabase/client";

export const buildShareUrl = (shareId: string) =>
  `${window.location.origin}/report/${shareId}`;

/**
 * Ensures a fact_check row has a share_id, creating one if missing.
 * Returns the full shareable URL.
 */
export const ensureShareLink = async (factCheckId: string): Promise<string> => {
  const { data: existing, error: fetchErr } = await supabase
    .from("fact_checks")
    .select("share_id")
    .eq("id", factCheckId)
    .maybeSingle();

  if (fetchErr) throw fetchErr;
  if (existing?.share_id) return buildShareUrl(existing.share_id);

  const newShareId = crypto.randomUUID();
  const { error: updateErr } = await supabase
    .from("fact_checks")
    .update({ share_id: newShareId })
    .eq("id", factCheckId);

  if (updateErr) throw updateErr;
  return buildShareUrl(newShareId);
};
