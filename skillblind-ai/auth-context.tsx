"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

interface StudentProfile {
    id: string;
    email: string;
    name: string;
    roll_number?: string;
    semester?: number;
    branch?: string;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: StudentProfile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signUp: (email: string, password: string, metadata: { name: string; rollNumber?: string; semester?: number }) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    profile: null,
    loading: true,
    signIn: async () => ({ error: null }),
    signUp: async () => ({ error: null }),
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch student profile from public.students table
    async function fetchProfile(userId: string) {
        try {
            const { data, error } = await supabase
                .from("students")
                .select("*")
                .eq("id", userId)
                .single();

            if (!error && data) {
                setProfile(data);
            }
        } catch (e) {
            console.error("Error fetching student profile:", e);
        }
    }

    useEffect(() => {
        // 1. Get initial active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            }
            setLoading(false);
        });

        // 2. Listen for auth state changes (login, logout, token refresh)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchProfile(session.user.id);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error };
    };

    const signUp = async (
        email: string,
        password: string,
        metadata: { name: string; rollNumber?: string; semester?: number }
    ) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: metadata.name,
                    roll_number: metadata.rollNumber,
                    semester: metadata.semester,
                },
            },
        });

        // If signup is successful, also insert into the students table
        if (!error && data.user) {
            await supabase.from("students").upsert({
                id: data.user.id,
                email,
                name: metadata.name,
                roll_number: metadata.rollNumber || "CSE-001",
                semester: metadata.semester || 5,
                branch: "CSE",
            });
        }

        return { error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setProfile(null);
    };

    return (
        <AuthContext.Provider value= {{ user, session, profile, loading, signIn, signUp, signOut }
}>
    { children }
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);