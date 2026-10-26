"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Layers,
  FileCheck2,
} from "lucide-react";
import { getInitialState, saveState, SkillBlindState } from "@/lib/storage";
import { generateAdaptiveRevisionPlan } from "@/lib/services/intervention-service";

export default function InterventionsPage() {
  const [state, setState] = useState<SkillBlindState | null>(null);
  const [examDate, setExamDate] = useState("2026-11-20");
  const [dailyHours, setDailyHours] = useState(2);

  useEffect(() => {
    setState(getInitialState());
  }, []);

  const handleToggleTask = (taskId: string) => {
    if (!state) return;
    const updatedTasks = state.revisionPlan.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const updatedPlan = { ...state.revisionPlan, tasks: updatedTasks };
    const updatedState = { ...state, revisionPlan: updatedPlan };
    saveState(updatedState);
    setState(updatedState);
  };

  const handleRegenerate = () => {
    if (!state) return;
    const newPlan = generateAdaptiveRevisionPlan(
      state.user?.id || "demo-user-101",
      state.subject.id,
      state.interventions,
      examDate,
      dailyHours
    );
    const updatedState = { ...state, revisionPlan: newPlan };
    saveState(updatedState);
    setState(updatedState);
    alert("Adaptive Learning Path successfully recalculated based on current diagnostic evidence!");
  };

  if (!state) return null;

  const { revisionPlan, interventions } = state;
  const completedCount = revisionPlan.tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-600 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Targeted Remediation & Roadmap</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Adaptive Learning Interventions</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Targeted pedagogical interventions prioritizing critical prerequisite gaps before scheduling dependent topics.
          </p>
        </div>

        <Link
          href="/transfer"
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm self-start sm:self-auto transition-colors"
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Verify via Transfer Assessment</span>
        </Link>
      </div>

      {/* Plan Parameters Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Study Constraints & Exam Alignment</h2>
            <p className="text-xs text-slate-500">Configure your target exam date and daily study availability.</p>
          </div>
          <button
            onClick={handleRegenerate}
            className="px-3.5 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Recalculate Schedule</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Exam Date</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Available Study Hours/Day</label>
            <input
              type="number"
              min="0.5"
              max="8"
              step="0.5"
              value={dailyHours}
              onChange={(e) => setDailyHours(parseFloat(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-col justify-end">
            <div className="text-xs text-slate-500">Progress:</div>
            <div className="text-base font-bold text-slate-900 mt-1">
              {completedCount} of {revisionPlan.tasks.length} Tasks Verified Complete
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Interventions List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Recommended Targeted Interventions ({interventions.length})</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interventions.map((intv) => (
            <div key={intv.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-teal-700 capitalize text-[10px] px-2 py-0.5 rounded bg-teal-50 border border-teal-100">
                    {intv.intervention_type.replace("_", " ")}
                  </span>
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {intv.estimated_duration_minutes} min
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-1">{intv.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  <strong>Pedagogical Rationale:</strong> {intv.rationale}
                </p>

                {intv.source_excerpt && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                    <strong>Study Material Guide:</strong> {intv.source_excerpt}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-600">
                  Status: {intv.status.replace("_", " ")}
                </span>
                <Link
                  href="/transfer"
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  <span>Verify Mastery â†’</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adaptive Revision Task Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
          Scheduled Adaptive Study Path
        </h2>

        <div className="mt-4 space-y-3">
          {revisionPlan.tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                task.completed ? "bg-emerald-50/50 border-emerald-200" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                  className="w-4 h-4 rounded text-teal-600 accent-teal-600 cursor-pointer"
                />
                <div>
                  <div className={`font-bold text-sm ${task.completed ? "line-through text-slate-400" : "text-slate-900"}`}>
                    {task.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{task.description}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {task.scheduled_date}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-600">
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
