import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://abifverrnrrfudakacjb.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiaWZ2ZXJybnJyZnVkYWthY2piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwMDUyMjIsImV4cCI6MjEwODU4MTIyMn0.i7z1FlDMI7H1wfAbEbmdStBnO1QSR0n9CcSGpU1n-ME";

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Supabase credentials missing from environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});