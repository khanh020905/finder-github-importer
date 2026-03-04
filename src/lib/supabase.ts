import { createClient } from "@supabase/supabase-js";

// Support both local dev (VITE_SUPABASE_ANON_KEY) and Lovable (VITE_SUPABASE_PUBLISHABLE_KEY)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase env vars. Need VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY).",
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
