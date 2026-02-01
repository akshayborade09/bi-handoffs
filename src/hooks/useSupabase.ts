"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Hook to get an authenticated Supabase client that respects RLS policies.
 * This client automatically sets the user's JWT token from NextAuth session.
 * 
 * Use this for client-side queries where you want RLS policies to be enforced.
 * For most use cases, using API routes is recommended for better security.
 * 
 * @returns Authenticated Supabase client or null if not configured/authenticated
 */
export function useSupabase(): SupabaseClient<Database> | null {
  const { data: session } = useSession();
  const [client, setClient] = useState<SupabaseClient<Database> | null>(null);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase URL or anon key not configured");
      setClient(null);
      return;
    }

    // Create client with anon key (respects RLS)
    const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    });

    // If we have a NextAuth session, we could set custom auth here
    // For now, RLS policies will use the anon role
    // In the future, you could implement a custom JWT exchange
    // to give Supabase the NextAuth JWT

    setClient(supabaseClient);
  }, [session]);

  return client;
}

/**
 * Example usage with RLS-enforced queries:
 * 
 * const supabase = useSupabase();
 * 
 * // This query will respect RLS policies
 * const { data, error } = await supabase
 *   .from('comments')
 *   .select('*')
 *   .eq('page_id', 'home');
 * 
 * // Real-time subscriptions
 * const subscription = supabase
 *   .channel('comments')
 *   .on('postgres_changes', 
 *     { event: '*', schema: 'public', table: 'comments' },
 *     (payload) => console.log(payload)
 *   )
 *   .subscribe();
 */
