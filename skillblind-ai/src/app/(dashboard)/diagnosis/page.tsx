"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Brain,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  GitBranch,
} from "lucide-react";
import { getInitialState, SkillBlindState } from "@/lib/storage";

export default function DiagnosisPage() {
  const [state, setState] = useState<SkillBlindState | null>(null);

  useEffect(() => {
    setState(getInitialState());
  }, []);

  if (!state) return null;

  const { rootCauses, misconceptions, topics } = state;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Brain className="w-4 h-4" />
            <span>Core Differentiator</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Root-Cause Diagnosis Engine</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            GapFinder AI moves beyond reporting score numbers to uncover <em>why</em> you struggle, tracing failed advanced topics back through prerequisite chains to the exact missing concept.
          </p>
        </div>

        <Link
          href="/interventions"
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm self-start sm:self-auto transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generate Intervention Roadmap</span>
        </Link>
      </div>

      {/* Methodology Explainer Banner */}
      <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-xs text-teal-950 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Cognitive Diagnosis Principle:</span>
          <p className="text-[11px] text-teal-900 leading-relaxed">
            Distinguishing <strong>Confirmed Observations</strong> (verifiable facts from quiz attempts) from <strong>Root-Cause Hypotheses</strong> (inferred conceptual deficits along the prerequisite DAG). Hypotheses are grounded with actual student quotes and textbook citations.
          </p>
        </div>
      </div>

      {/* Root Cause Diagnoses Cards */}
      <div className="space-y-6">
        {rootCauses.map((diag, index) => {
          const observedTopic = topics.find((t) => t.id === diag.observed_topic_id);
          const rootTopic = topics.find((t) => t.id === diag.root_cause_topic_id);

          return (
            <div
              key={diag.id}
              className="bg-white rounded-2xl border-2 border-slate-200 hover:border-slate-300 shadow-sm overflow-hidden transition-all"
            >
              {/* Diagnosis Header */}
              <div className="p-6 bg-gradient-to-r from-slate-900 to-teal-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Diagnosis #{index + 1}
                    </span>
                    <span className="text-xs text-teal-200 font-medium">
                      Status: <strong className="capitalize">{diag.status}</strong>
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white mt-1">
                    Prerequisite Bottleneck: {rootTopic?.name || "Foundations"} â†’ {observedTopic?.name || "Advanced"}
                  </h2>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[10px] text-teal-300 uppercase font-semibold">Diagnosis Confidence</div>
                  <div className="text-xl font-extrabold text-emerald-400">
                    {Math.round(diag.confidence_level * 100)}%
                  </div>
                </div>
              </div>

              {/* Diagnosis Content Body */}
              <div className="p-6 space-y-5">
                {/* Contrast: Observed vs Hypothesized */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Confirmed Observation */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                      Confirmed Observation
                    </div>
                    <div className="text-slate-900 font-semibold leading-snug">
                      {diag.observed_issue}
                    </div>
                  </div>

                  {/* Inferred Root Cause */}
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1.5 text-xs">
                    <div className="text-[10px] uppercase font-bold text-rose-700 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Inferred Root Cause (Prerequisite Deficit)
                    </div>
                    <div className="text-rose-950 font-semibold leading-snug">
                      {diag.hypothesized_cause}
                    </div>
                  </div>
                </div>

                {/* Supporting Student Verbatim Citations */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Supporting Student Evidence &amp; Flawed Mental Model Citations
                  </h3>

                  <div className="space-y-2">
                    {diag.evidence_citations.map((ev, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                        <div className="font-semibold text-slate-800">
                          Question: {ev.question_text}
                        </div>
                        <div className="text-rose-700 font-medium italic">
                          Student Verbatim Response: &quot;{ev.student_response}&quot;
                        </div>
                        <div className="text-[11px] text-slate-600">
                          <strong>Cognitive Flaw Identified:</strong> {ev.flaw_identified}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Adaptive Intervention */}
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-bold text-emerald-900 block mb-1">Prescribed Intervention:</span>
                    <span className="text-emerald-800 leading-relaxed">{diag.recommended_intervention}</span>
                  </div>

                  <Link
                    href="/interventions"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shrink-0 flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
                  >
                    <span>Begin Revision</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Misconception Patterns Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recurring Misconceptions & High-Confidence Errors</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Concepts where errors were accompanied by high confidence, signaling active flawed mental models that require explicit refutation.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">{misconceptions.length} Patterns Detected</span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {misconceptions.map((misc) => (
            <div key={misc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{misc.pattern_name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800">
                  {misc.high_confidence_errors} High-Conf Errors
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{misc.description}</p>
              {misc.sample_student_responses && misc.sample_student_responses.length > 0 && (
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700">
                  <strong>Sample response:</strong> &quot;{misc.sample_student_responses[0]}&quot;
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
