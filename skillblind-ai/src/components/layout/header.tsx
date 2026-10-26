"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, RotateCcw, Upload, UserCheck, LogOut, ChevronDown } from "lucide-react";
import { getInitialState, saveState, switchActiveSubject, resetToDemoState } from "@/lib/storage";
import { useAuth } from "@/lib/auth-context";
import { Subject } from "@/types";

export default function Header() {
  const { user, logout } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);

  useEffect(() => {
    const s = getInitialState();
    setSubjects(s.subjects || []);
    setActiveSubject(s.subject || s.subjects?.[0] || null);

    const handleStorageChange = () => {
      const updated = getInitialState();
      setActiveSubject(updated.subject || updated.subjects?.[0] || null);
    };

    window.addEventListener("subjectChanged", handleStorageChange);
    return () => window.removeEventListener("subjectChanged", handleStorageChange);
  }, []);

  const handleSelectSubject = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const updated = switchActiveSubject(selectedId);
    setActiveSubject(updated.subject);
    window.dispatchEvent(new Event("subjectChanged"));
    window.location.reload();
  };

  const handleReset = () => {
    if (confirm("Reset application data back to initial university demonstration baseline?")) {
      resetToDemoState();
      window.location.reload();
    }
  };

  const displayName = user?.full_name || "Lava Kumar";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "LK";

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Subject Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800">
          <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="font-semibold text-slate-700 hidden sm:inline">Subject:</span>
          <select
            value={activeSubject?.id || ""}
            onChange={handleSelectSubject}
            className="bg-transparent font-bold text-slate-900 border-none outline-none cursor-pointer pr-2 text-xs"
          >
            {subjects.map((subj) => (
              <option key={subj.id} value={subj.id} className="text-slate-900 font-medium">
                {subj.code ? `${subj.code}: ` : ""}{subj.name}
              </option>
            ))}
          </select>
        </div>

        <Link
          href="/materials"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors"
          title="Upload Course Syllabus or Notes PDF"
        >
          <Upload className="w-3.5 h-3.5 text-slate-500" />
          <span>Upload PDF</span>
        </Link>
      </div>

      {/* Action Buttons & User Profile */}
      <div className="flex items-center gap-3">
        {/* Reset Demo Data Button */}
        <button
          onClick={handleReset}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition-colors"
          title="Reset to clean baseline data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Baseline</span>
        </button>

        {/* Start Diagnostic Assessment CTA */}
        <Link
          href="/quiz"
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <span>Take 20-Question Exam</span>
        </Link>

        {/* User Pill & Auth */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {initials}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-800 leading-tight">
              {displayName}
            </div>
            <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
              <UserCheck className="w-3 h-3" /> Roll No: LK-2026-CS
            </div>
          </div>

          {/* Log Out Button */}
          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
