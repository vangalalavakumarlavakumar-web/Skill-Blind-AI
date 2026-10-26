"use client";

import React, { useState } from "react";
import {
  Users,
  GraduationCap,
  PlusCircle,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Brain,
  BookOpen,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function TeacherPage() {
  const [copied, setCopied] = useState(false);
  const [classes, setClasses] = useState([
    {
      id: "cls-01",
      name: "CS201: Data Structures - Section B",
      inviteCode: "CS201-FALL26",
      studentsCount: 38,
      avgMastery: 64,
      criticalBottleneck: "Recursion & Call Stacks",
      weakPercentage: 68,
    },
    {
      id: "cls-02",
      name: "CS301: Advanced Algorithms",
      inviteCode: "ALGO-HONORS",
      studentsCount: 24,
      avgMastery: 78,
      criticalBottleneck: "Dynamic Programming Memoization",
      weakPercentage: 42,
    },
  ]);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Classroom &amp; Cohort Extension</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Teacher &amp; Cohort Analytics</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Aggregate cohort diagnostic intelligence. Identify class-wide conceptual bottlenecks and schedule group revision without exposing private student records.
          </p>
        </div>

        <button
          onClick={() => alert("Classroom creation modal: Invite code generated automatically.")}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm self-start sm:self-auto transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Create New Class</span>
        </button>
      </div>

      {/* Privacy Guarantee Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900 text-slate-300 text-xs flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Cohort Privacy Protection:</strong> Teacher views display aggregate cohort distributions and anonymized misconception frequencies. Private personal notes and uploaded documents remain strictly locked to each student&apos;s authenticated profile.
          </span>
        </div>
      </div>

      {/* Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Class Cohort</span>
                <h3 className="font-bold text-slate-900 text-base mt-0.5">{c.name}</h3>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-100 text-xs font-mono font-bold text-teal-700">
                <span>{c.inviteCode}</span>
                <button onClick={() => handleCopy(c.inviteCode)} title="Copy Invite Code">
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-teal-500 hover:text-teal-700" />}
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] uppercase font-bold text-slate-400">Enrolled Students</div>
                <div className="text-xl font-bold text-slate-900 mt-1">{c.studentsCount}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] uppercase font-bold text-slate-400">Class Average Mastery</div>
                <div className="text-xl font-bold text-teal-600 mt-1">{c.avgMastery}%</div>
              </div>
            </div>

            {/* Aggregate Critical Bottleneck */}
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1">
              <div className="flex items-center justify-between text-rose-800 font-bold">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Cohort Prerequisite Bottleneck
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-200 text-rose-900">
                  {c.weakPercentage}% Struggling
                </span>
              </div>
              <p className="text-rose-950 font-medium">
                Concept: <strong>{c.criticalBottleneck}</strong>
              </p>
              <p className="text-[11px] text-rose-800">
                Aggregate assessment evidence shows students fail tree traversal because call-stack activation records are ungrounded.
              </p>
            </div>

            {/* Class-wide Action */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => alert(`Class-wide remediation session scheduled for ${c.name} on ${c.criticalBottleneck}.`)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Schedule Class Revision Session</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
