"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, UserCheck, Shield, Sparkles } from "lucide-react";
import { resetToDemoState } from "@/lib/storage";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("lava.kumar@skillblind.ai");
  const [password, setPassword] = useState("â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password, "Lava Kumar");
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
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-slate-900 text-xl tracking-tight">
              GapFinder <span className="text-blue-600">AI</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900 mt-4">Welcome to GapFinder AI</h2>
          <p className="text-xs text-slate-500 mt-1">Sign in to diagnose your personalized knowledge gaps.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8">
          {/* Quick Demo Login CTA */}
          <div className="mb-6 p-4 rounded-xl bg-teal-50/80 border border-teal-200 text-left">
            <div className="flex items-center gap-2 text-teal-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>One-Click Placement Drive Access</span>
            </div>
            <p className="text-[11px] text-teal-800 mt-1">
              Instant login with pre-configured Data Structures and Algorithms diagnostic profile.
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
              <span className="bg-white px-2 text-slate-400 font-semibold">Or Sign in with Credentials</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <span className="text-[11px] text-teal-600 hover:underline cursor-pointer">Forgot?</span>
              </div>
              <input
                type="password"
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
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-teal-600 hover:underline">
              Create an Account
            </Link>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 mt-6 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          <span>Secured with Supabase Auth &amp; Row Level Security</span>
        </div>
      </div>
    </div>
  );
}
