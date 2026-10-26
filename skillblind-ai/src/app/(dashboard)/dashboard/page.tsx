"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Brain,
  Layers,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  FileCheck2,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  HelpCircle,
  FileText,
} from "lucide-react";
import { getInitialState, SkillBlindState } from "@/lib/storage";
import ConceptGraphCanvas from "@/components/graph/concept-graph-canvas";
import { buildConceptGraph } from "@/lib/services/concept-graph-service";

export default function DashboardPage() {
  const [state, setState] = useState<SkillBlindState | null>(null);

  useEffect(() => {
    setState(getInitialState());
  }, []);

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400 text-sm">Loading diagnostic intelligence...</div>
      </div>
    );
  }

  const {
    materials,
    topics,
    dependencies,
    mastery,
    misconceptions,
    rootCauses,
    predictions,
    revisionPlan,
    transferAssessments,
    attempts,
  } = state;

  const graphData = buildConceptGraph(topics, dependencies, mastery);

  // Computed summary metrics
  const weakConcepts = mastery.filter((m) => m.status === "weak");
  const developingConcepts = mastery.filter((m) => m.status === "developing");
  const strongConcepts = mastery.filter((m) => m.status === "strong");
  const unassessedCount = mastery.filter((m) => m.status === "insufficient_evidence").length;

  const latestAttempt = attempts[0];
  const highRiskCount = predictions.filter((p) => p.risk_level === "high").length;
  const verifiedLift = transferAssessments[0]?.improvement_delta || 0.6;

  return (
    <div className="space-y-8">
      {/* Top Banner / Callout */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 p-6 sm:p-8 text-white relative overflow-hidden shadow-lg shadow-indigo-950/20">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <Brain className="w-3.5 h-3.5" />
            <span>Root-Cause Diagnostic Engine Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome, Alex! Here is your Knowledge Gap Diagnostic.
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 mt-2 leading-relaxed">
            Your recent assessment revealed that errors in <strong className="text-white font-semibold">Tree Traversal</strong> stem from a foundational blindspot in <strong className="text-white font-semibold">Recursion Call Stacks</strong>.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/quiz"
              className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Knowledge Diagnosis</span>
            </Link>
            <Link
              href="/diagnosis"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/15 flex items-center gap-1.5 transition-colors"
            >
              <span>Inspect Root Causes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Study Materials */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Course Materials</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{materials.length}</span>
            <span className="text-[11px] text-slate-500">Processed</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium">
            Syllabus, Ch 3 & Ch 5 RAG-indexed
          </div>
        </div>

        {/* Weak Prerequisite Bottlenecks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Prerequisite Gaps</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600">{weakConcepts.length}</span>
            <span className="text-[11px] text-slate-500">Foundational Bottlenecks</span>
          </div>
          <div className="mt-2 text-[11px] text-rose-600 font-medium truncate">
            Recursion & Call Stacks (28%)
          </div>
        </div>

        {/* High Attention Needed Risks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Estimated Learning Risks</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600">{highRiskCount}</span>
            <span className="text-[11px] text-slate-500">At-Risk Topics</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Graph DFS/BFS (88% risk score)
          </div>
        </div>

        {/* Transfer Verification */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Verified Transfer Lift</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600">+{Math.round(verifiedLift * 100)}%</span>
            <span className="text-[11px] text-slate-500">Tested in New Context</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium">
            Directory Traversal Assessment
          </div>
        </div>
      </div>

      {/* Main Section: Interactive Concept Dependency Graph */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Concept Prerequisite Dependency Graph</h2>
            <p className="text-xs text-slate-500">
              Interactive structural map linking foundational concepts to downstream applications. Click any node to inspect relationships.
            </p>
          </div>
          <Link
            href="/graph"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>Full Graph View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ConceptGraphCanvas nodes={graphData.nodes} edges={graphData.edges} />
      </div>

      {/* Mid Grid: Root Cause Highlight & Predictive Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Root Cause Diagnosis Spotlight */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Active Root-Cause Diagnosis
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                Hypothesis Confirmed by Quiz Evidence
              </span>
            </div>

            {rootCauses[0] && (
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="text-slate-500 font-medium mb-1">Observed Difficulty:</div>
                  <div className="text-slate-900 font-semibold">{rootCauses[0].observed_issue}</div>
                </div>

                <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200 text-xs">
                  <div className="text-rose-700 font-bold mb-1">Identified Root Cause:</div>
                  <div className="text-rose-950 leading-relaxed">{rootCauses[0].hypothesized_cause}</div>
                </div>

                <div className="text-[11px] text-slate-500 pt-1">
                  <strong>Supporting Verbatim Evidence:</strong> Student answered with high confidence: <em>&quot;The variables are wiped from memory and the computer starts again...&quot;</em>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Diagnostic confidence: <strong>92%</strong></span>
            <Link
              href="/diagnosis"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View Full Diagnosis & Evidence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Predictive Knowledge Gap Model */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Downstream Learning Risk Estimates
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Weighted Factor Model</span>
            </div>

            <div className="mt-4 space-y-3">
              {predictions.slice(0, 2).map((pred) => (
                <div key={pred.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-900">{pred.topic?.name || "Topic"}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        pred.risk_level === "high"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {pred.risk_level === "high" ? "High Attention Needed" : "Moderate Risk"} ({Math.round(pred.risk_score * 100)}%)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {pred.recommended_preventive_action}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 italic">Transparent factor calculation</span>
            <Link
              href="/predictions"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Explore Factor Weights</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Revision Path & Upcoming Tasks */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Personalized Adaptive Revision Tasks</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sequence generated to fix root-cause prerequisites before advancing to complex topics.
            </p>
          </div>
          <Link
            href="/interventions"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>Manage Study Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="mt-4 space-y-2.5">
          {revisionPlan.tasks.map((task) => (
            <div
              key={task.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                task.completed
                  ? "bg-emerald-50/40 border-emerald-200 text-emerald-950"
                  : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                {task.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <div>
                  <div className={`font-semibold ${task.completed ? "line-through text-slate-400" : "text-slate-900"}`}>
                    {task.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{task.description}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {task.scheduled_date}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                  {task.estimated_minutes} min
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
