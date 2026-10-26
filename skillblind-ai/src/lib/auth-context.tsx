"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Profile, UserRole } from "@/types";
import { DEMO_USER } from "./demo-data";
import { getInitialState, saveState, SkillBlindState } from "./storage";

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  login: (email: string, password?: string, fullName?: string) => Promise<boolean>;
  signup: (fullName: string, email: string, password?: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
});

const AUTH_USER_KEY = "skillblind_auth_user_v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default authenticated user is Lava Kumar
        setUser(DEMO_USER);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(DEMO_USER));
      }
    } catch {
      setUser(DEMO_USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, _password?: string, fullName?: string): Promise<boolean> => {
    setIsLoading(true);
    const existingState = getInitialState();

    const loggedUser: Profile = {
      id: existingState.user?.id || "user-lava-101",
      email: email || "lava.kumar@skillblind.ai",
      full_name: fullName || (email.includes("lava") ? "Lava Kumar" : "Lava"),
      role: "student",
      target_score: 85,
      available_hours_per_day: 2,
      exam_date: "2026-11-20",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(loggedUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(loggedUser));

    // Update global state
    const updatedState: SkillBlindState = {
      ...existingState,
      user: loggedUser,
    };
    saveState(updatedState);

    setIsLoading(false);
    return true;
  };

  const signup = async (
    fullName: string,
    email: string,
    _password?: string,
    role: UserRole = "student"
  ): Promise<boolean> => {
    setIsLoading(true);
    const existingState = getInitialState();

    const newUser: Profile = {
      id: `user-${Date.now().toString().slice(-4)}`,
      email,
      full_name: fullName.trim() || "Lava Kumar",
      role,
      target_score: 85,
      available_hours_per_day: 2,
      exam_date: "2026-11-20",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));

    const updatedState: SkillBlindState = {
      ...existingState,
      user: newUser,
    };
    saveState(updatedState);

    setIsLoading(false);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
