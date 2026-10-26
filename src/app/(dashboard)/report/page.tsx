"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Brain,
  Printer,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { getInitialState, SkillBlindState } from "@/lib/storage";

export default function ReportPage() {
  const [state, setState] = useState<SkillBlindState | null>(null);

  useEffect(() => {
    setState(getInitialState());
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!state) return null;

  const { topics, mastery, rootCauses, predictions, user, subject } = state;

  const weakConcepts = mastery.filter((m) => m.status === "weak");
  const developingConcepts = mastery.filter((m) => m.status === "developing");
  const strongConcepts = mastery.filter((m) => m.status === "strong");
  const unassessed = mastery.filter((m) => m.status === "insufficient_evidence");

  return (
    <div className="max-w-4xl mx-auto space-y-8 print:p-0">
      {/* Report Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-teal-600 text-xs font-bold uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Comprehensive Student Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Knowledge Gap Diagnostic Report
          </h1>
          <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
            <span>Student: <strong>{user?.full_name || "Lava Kumar"}</strong></span>
            <span>â€¢</span>
            <span>Subject: <strong>{subject.name} ({subject.code})</strong></span>
            <span>â€¢</span>
            <span>Date: <strong>{new Date().toLocaleDateString()}</strong></span>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto print:hidden"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Category 1: Weak Concepts */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500" />
          <h2 className="text-base font-bold text-slate-900">1. Weak Concepts (Sufficient Evidence of Difficulty)</h2>
        </div>

        <div className="space-y-3">
          {weakConcepts.map((item) => {
            const topic = topics.find((t) => t.id === item.topic_id);
            return (
              <div key={item.id} className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{topic?.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800 border border-rose-300">
                    Mastery: {Math.round(item.mastery_score * 100)}% ({item.questions_correct}/{item.questions_attempted} Correct)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  <strong>Diagnostic Explanation:</strong> Significant difficulty identified in core mechanisms. Serves as a critical prerequisite bottleneck.
                </p>
                <div className="text-[11px] text-rose-800 font-medium">
                  <strong>Recommended Next Action:</strong> Complete foundational visual tracing before attempting advanced problems.
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Category 2: Developing Concepts */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <h2 className="text-base font-bold text-slate-900">2. Developing Concepts (Partial or Inconsistent Understanding)</h2>
        </div>

        <div className="space-y-3">
          {developingConcepts.map((item) => {
            const topic = topics.find((t) => t.id === item.topic_id);
            return (
              <div key={item.id} className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{topic?.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Mastery: {Math.round(item.mastery_score * 100)}% ({item.questions_correct}/{item.questions_attempted} Correct)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  <strong>Diagnostic Explanation:</strong> Understands static properties but exhibits errors when navigating recursive edge cases.
                </p>
                <div className="text-[11px] text-amber-900 font-medium">
                  <strong>Recommended Next Action:</strong> Targeted worked-example practice on node deletion and edge cases.
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Category 3: Strong Concepts */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <h2 className="text-base font-bold text-slate-900">3. Strong Concepts (Demonstrated Conceptual Fluency)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {strongConcepts.map((item) => {
            const topic = topics.find((t) => t.id === item.topic_id);
            return (
              <div key={item.id} className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{topic?.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
                    {Math.round(item.mastery_score * 100)}%
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {item.questions_correct} of {item.questions_attempted} questions answered correctly.
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Category 4: Possible Root Causes */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-rose-600" />
          <h2 className="text-base font-bold text-slate-900">4. Identified Root-Cause Diagnoses</h2>
        </div>

        <div className="space-y-3">
          {rootCauses.map((rc) => (
            <div key={rc.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-700">{rc.observed_issue}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700">
                  Confidence: {Math.round(rc.confidence_level * 100)}%
                </span>
              </div>
              <p className="text-[11px] text-slate-800 leading-relaxed font-medium">
                {rc.hypothesized_cause}
              </p>
              <div className="text-[11px] text-teal-700">
                <strong>Recommended Intervention:</strong> {rc.recommended_intervention}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category 5: Predicted Learning Risks */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-teal-600" />
          <h2 className="text-base font-bold text-slate-900">5. Predicted Downstream Learning Risks</h2>
        </div>

        <div className="space-y-3">
          {predictions.map((p) => (
            <div key={p.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{p.topic?.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800">
                  {p.risk_level.toUpperCase()} ({Math.round(p.risk_score * 100)}%)
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">{p.recommended_preventive_action}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category 6: Insufficient Evidence */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <h2 className="text-base font-bold text-slate-900">6. Unassessed Topics (Insufficient Evidence)</h2>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
          Topics with fewer than 2 diagnostic questions:{" "}
          <strong className="text-slate-900">
            {unassessed.length > 0
              ? unassessed.map((u) => topics.find((t) => t.id === u.topic_id)?.name).join(", ")
              : "All syllabus topics have completed baseline assessments."}
          </strong>
        </div>
      </section>
    </div>
  );
}
