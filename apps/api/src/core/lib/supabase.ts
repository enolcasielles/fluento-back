import { createClient } from "@supabase/supabase-js";

let supabase;

export const getSupabaseClient = () => {
  if (!supabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  }
  return supabase;
}
