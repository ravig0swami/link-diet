import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

// We use the service_role key in the backend to bypass RLS for administrative actions.
// If we implement user authentication in Phase 7, we might switch to using the user's access token
// for specific operations, but for now, the backend handles data securely.
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);
