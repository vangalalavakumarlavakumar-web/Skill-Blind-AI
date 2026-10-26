"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brain, ArrowRight, Shield, Sparkles, UserCheck } from "lucide-react";
import { resetToDemoState } from "@/lib/storage";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const router = useRouter();
  const { signup, login } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signup(fullName, email, password, role);
    router.push("/dashboard");
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    resetToDemoState();
    await login("lava.kumar@skillblind.ai", "password123", "Lava Kumar");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Brain className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-slate-900 text-xl tracking-tight">
              SkillBlind <span className="text-teal-600">AI</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900 mt-4">Create Your Account</h2>
          <p className="text-xs text-slate-500 mt-1">Start evidence-grounded diagnostic learning today.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8">
          {/* Quick Demo Access */}
          <div className="mb-6 p-4 rounded-xl bg-teal-50/80 border border-teal-200 text-left">
            <div className="flex items-center gap-2 text-teal-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Placement Drive / Evaluation Shortcut</span>
            </div>
            <p className="text-[11px] text-teal-800 mt-1">
              Skip manual registration and jump directly into the pre-seeded Data Structures &amp; Algorithms diagnostic suite.
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="mt-3 w-full py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Launch Demo Account (Lava Kumar)</span>
            </button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold">Or Register with Credentials</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Lava Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="lava.kumar@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="student">Student Learner</option>
                <option value="teacher">Instructor / Professor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors mt-2"
            >
              {loading ? "Creating Account..." : "Create Account & Enter Dashboard"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-teal-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 mt-6 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          <span>Encrypted data isolation with Supabase Row Level Security</span>
        </div>
      </div>
    </div>
  );
}
