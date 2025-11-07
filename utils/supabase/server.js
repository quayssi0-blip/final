import { createClient } from "@supabase/supabase-js";

// Server-side Supabase instance for use in API routes and server components.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment",
  );
}

const supabaseServer = createClient(supabaseUrl, serviceRoleKey, {
  // avoid persisting sessions for server usage
  auth: { persistSession: false },
});

export default supabaseServer;
export { supabaseServer };
