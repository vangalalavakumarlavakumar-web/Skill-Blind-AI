"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Brain,
  Layers,
  FileText,
  HelpCircle,
  GitBranch,
  TrendingUp,
  Compass,
  FileCheck2,
  Sparkles,
  BarChart3,
  BookOpen,
  GraduationCap,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: Compass },
  { label: "Study Materials", href: "/materials", icon: FileText },
  { label: "Concept Dependency Graph", href: "/graph", icon: GitBranch },
  { label: "Diagnostic Assessment", href: "/quiz", icon: HelpCircle },
  { label: "Root-Cause Diagnosis", href: "/diagnosis", icon: Brain },
  { label: "Predictive Risk Model", href: "/predictions", icon: TrendingUp },
  { label: "Adaptive Interventions", href: "/interventions", icon: BookOpen },
  { label: "Transfer Verification", href: "/transfer", icon: FileCheck2 },
  { label: "Knowledge Gap Report", href: "/report", icon: GraduationCap },
  { label: "Explain Assistant (RAG)", href: "/assistant", icon: Sparkles },
  { label: "Progress Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Teacher & Classes", href: "/teacher", icon: GraduationCap },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 min-h-screen">
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800/80 bg-slate-950/40">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
            SkillBlind <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-semibold border border-indigo-500/30">AI</span>
          </span>
          <span className="block text-[10px] text-slate-400 font-medium">Cognitive Gap Intelligence</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider uppercase text-slate-500">
          Diagnostic Workflow
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/20">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 text-xs">
          <div className="text-[11px] font-semibold text-slate-200">Demonstration Subject</div>
          <div className="text-[11px] text-indigo-400 mt-0.5 truncate">CS201: Data Structures</div>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            Judge Demo Account Active
          </div>
        </div>
      </div>
    </aside>
  );
}
