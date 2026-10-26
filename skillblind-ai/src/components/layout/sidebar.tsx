"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  FileText,
  HelpCircle,
  GitBranch,
  TrendingUp,
  Compass,
  FileCheck2,
  Sparkles,
  BarChart3,
  BookOpen,
  Brain,
  Layers,
  Sliders,
  FileSearch,
} from "lucide-react";
import { getInitialState, SkillBlindState } from "@/lib/storage";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: Compass },
  { label: "Study Materials & PDF", href: "/materials", icon: FileText },
  { label: "Concept Dependency Graph", href: "/graph", icon: GitBranch },
  { label: "Diagnostic Assessment (20 Qs)", href: "/quiz", icon: HelpCircle },
  { label: "Root-Cause Diagnosis", href: "/diagnosis", icon: Brain },
  { label: "Gap Simulation Studio", href: "/simulator", icon: Sliders, badge: "Exclusive" },
  { label: "Exam Question Forensics", href: "/forensics", icon: FileSearch, badge: "New" },
  { label: "GapCards (Smart Recall)", href: "/flashcards", icon: Layers },
  { label: "Predictive Risk Model", href: "/predictions", icon: TrendingUp },
  { label: "Adaptive Interventions", href: "/interventions", icon: BookOpen },
  { label: "Transfer Verification", href: "/transfer", icon: FileCheck2 },
  { label: "Knowledge Gap Report", href: "/report", icon: GraduationCap },
  { label: "Explain Assistant (RAG)", href: "/assistant", icon: Sparkles },
  { label: "Progress Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Teacher & Cohort", href: "/teacher", icon: GraduationCap },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [activeSubject, setActiveSubject] = useState<{ name: string; code?: string }>({
    name: "Data Structures & Algorithms",
    code: "CS201",
  });

  useEffect(() => {
    const s = getInitialState();
    if (s.subject) {
      setActiveSubject({ name: s.subject.name, code: s.subject.code });
    }
  }, []);

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 min-h-screen">
      {/* Brand Academic Header */}
      <div className="h-16 flex items-center px-5 gap-3 border-b border-slate-800 bg-slate-950/60">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
            GapFinder <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-semibold border border-blue-700/60">AI</span>
          </span>
          <span className="block text-[10px] text-slate-400 font-medium">Diagnostic Knowledge Engine</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider uppercase text-slate-400">
          Curriculum Modules
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                isActive
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span className="truncate flex-1">{item.label}</span>
              {"badge" in item && item.badge && (
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60 text-xs">
          <div className="text-[10px] uppercase font-semibold text-slate-400">Active Curriculum Subject</div>
          <div className="text-xs font-bold text-blue-300 mt-1 truncate">
            {activeSubject.code ? `${activeSubject.code}: ` : ""}{activeSubject.name}
          </div>
          <div className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            <span>Accredited Assessment Mode</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
