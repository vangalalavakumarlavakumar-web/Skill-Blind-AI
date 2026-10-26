"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Brain,
  FileCheck2,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import { getInitialState, SkillBlindState } from "@/lib/storage";

export default function AnalyticsPage() {
  const [state, setState] = useState<SkillBlindState | null>(null);

  useEffect(() => {
    setState(getInitialState());
  }, []);

  if (!state) return null;

  const { topics, mastery, misconceptions, transferAssessments, revisionPlan, attempts } = state;

  const transfer = transferAssessments[0];
  const baseline = transfer?.baseline_score || 0.25;
  const verified = transfer?.verification_score || 0.85;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Longitudinal Performance Evidence</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Progress &amp; Mastery Analytics</h1>
        <p className="text-xs text-slate-500 mt-1">
          Measuring true conceptual gains across prerequisite revisions and novel-context transfer assessments.
        </p>
      </div>

      {/* Top Lift Card: Before & After Intervention Verification */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Verified Conceptual Transfer
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              Before vs. After Targeted Intervention Lift
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparison between initial diagnostic quiz and verification in novel file-system context.
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Net Improvement</span>
            <div className="text-2xl font-extrabold text-emerald-600">
              +{Math.round((verified - baseline) * 100)}% Lift
            </div>
          </div>
        </div>

        {/* Dual Progress Comparison Bar */}
        <div className="mt-6 space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Baseline Assessment (Binary Search Trees Traversal):</span>
              <span className="text-rose-600 font-bold">{Math.round(baseline * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div
                className="bg-rose-500 h-3 rounded-full"
                style={{ width: `${baseline * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Transfer Verification (Hierarchical Directory Traversal):</span>
              <span className="text-emerald-600 font-bold">{Math.round(verified * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div
                className="bg-emerald-500 h-3 rounded-full"
                style={{ width: `${verified * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Topic Mastery Distribution */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 pb-4 border-b border-slate-100">
          Topic-Level Mastery Breakdown
        </h2>

        <div className="mt-6 space-y-4">
          {mastery.map((m) => {
            const topic = topics.find((t) => t.id === m.topic_id);
            const scorePct = Math.round(m.mastery_score * 100);

            return (
              <div key={m.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{topic?.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[11px]">
                      {m.questions_correct}/{m.questions_attempted} correct
                    </span>
                    <span
                      className={`font-bold text-xs px-2 py-0.5 rounded-full ${
                        m.status === "strong"
                          ? "bg-emerald-50 text-emerald-700"
                          : m.status === "developing"
                          ? "bg-amber-50 text-amber-700"
                          : m.status === "weak"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {scorePct}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      m.status === "strong"
                        ? "bg-emerald-500"
                        : m.status === "developing"
                        ? "bg-amber-500"
                        : m.status === "weak"
                        ? "bg-rose-500"
                        : "bg-slate-400"
                    }`}
                    style={{ width: `${Math.max(8, scorePct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Misconception Resolution Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Brain className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Misconception Patterns Tracked</h3>
          </div>

          <div className="mt-4 space-y-3">
            {misconceptions.map((misc) => (
              <div key={misc.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{misc.pattern_name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-rose-100 text-rose-800">
                    Active
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1 leading-snug">{misc.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Intervention Task Completion</h3>
          </div>

          <div className="mt-4 space-y-3">
            {revisionPlan.tasks.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900">{task.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Scheduled: {task.scheduled_date}</div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    task.completed ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {task.completed ? "Verified Complete" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
