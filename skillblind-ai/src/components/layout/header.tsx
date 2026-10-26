"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, RotateCcw, BookOpen, UserCheck } from "lucide-react";
import { resetToDemoState } from "@/lib/storage";

export default function Header() {
  const handleReset = () => {
    if (confirm("Reset application data back to initial Data Structures & Algorithms demonstration baseline?")) {
      resetToDemoState();
      window.location.reload();
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Subject Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 font-medium">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>Active Subject: <strong className="font-semibold">Data Structures and Algorithms</strong></span>
          <span className="text-[10px] px-1.5 py-0.2 bg-indigo-200/60 rounded text-indigo-800 font-bold">CS201</span>
        </div>
      </div>

      {/* Action Buttons & User Profile */}
      <div className="flex items-center gap-3">
        {/* Reset Demo Data Button */}
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition-colors"
          title="Reset back to sample demonstration data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </button>

        {/* Start Diagnostic CTA */}
        <Link
          href="/quiz"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-semibold flex items-center gap-2 shadow-sm shadow-indigo-500/20 transition-all hover:shadow"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Start Knowledge Diagnosis</span>
        </Link>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            AV
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-800 leading-tight">Alex Vance</div>
            <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
              <UserCheck className="w-3 h-3" /> Demo Student
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
