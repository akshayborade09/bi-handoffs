import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl) {
  console.warn("NEXT_PUBLIC_SUPABASE_URL is not set");
}

if (!supabaseServiceKey) {
  console.warn("SUPABASE_SERVICE_ROLE_KEY is not set");
}

if (!supabaseAnonKey) {
  console.warn("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
}

/**
 * Server-side Supabase client with service role (bypasses RLS)
 * Use this ONLY in API routes where you've already validated authentication
 * and authorization in your application code.
 */
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

/**
 * Client-side Supabase client with anon key (respects RLS)
 * This client will enforce Row Level Security policies.
 * Use this for client-side queries where RLS policies handle authorization.
 */
export const supabaseClient =
  typeof window !== "undefined" && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
        },
      })
    : null;

/**
 * Create a server-side Supabase client with anon key (respects RLS)
 * Use this in API routes when you want RLS policies to be enforced.
 * You'll need to set the user's JWT token for authenticated requests.
 */
export function createServerSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
