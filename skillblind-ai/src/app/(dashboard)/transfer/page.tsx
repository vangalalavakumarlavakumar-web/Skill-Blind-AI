"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileCheck2,
  CheckCircle2,
  TrendingUp,
  Brain,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import { getInitialState, saveState, SkillBlindState } from "@/lib/storage";

export default function TransferPage() {
  const [state, setState] = useState<SkillBlindState | null>(null);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [confidence, setConfidence] = useState("confident");
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [verificationScore, setVerificationScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setState(getInitialState());
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAnswer.trim() || !state) return;

    // Evaluate transfer response against required keywords: base case / directory / recurse / sum
    const lower = studentAnswer.toLowerCase();
    const hasBase = lower.includes("empty") || lower.includes("file") || lower.includes("base") || lower.includes("leaf");
    const hasSum = lower.includes("sum") || lower.includes("add") || lower.includes("accumulate") || lower.includes("return");
    const hasSubdir = lower.includes("child") || lower.includes("sub") || lower.includes("directory") || lower.includes("folder");

    let score = 0.4;
    if (hasBase && hasSum && hasSubdir) score = 0.95;
    else if ((hasBase && hasSum) || (hasSum && hasSubdir)) score = 0.8;

    const isPassed = score >= 0.75;
    setVerificationScore(score);
    setIsEvaluated(true);

    const feedbackText = isPassed
      ? "Demonstrated verified conceptual transfer! Successfully mapped recursion base-case termination and call-stack unwinding to arbitrary file hierarchies."
      : "Partial transfer achieved. Remember to explicitly specify how the recursive call halts when reaching individual file leaves.";
    setFeedback(feedbackText);

    // Update transfer assessment in state
    const original = state.transferAssessments[0];
    const updatedTransfer = {
      ...original,
      verification_score: score,
      improvement_delta: Math.round((score - original.baseline_score) * 100) / 100,
      status: isPassed ? ("mastery_verified" as const) : ("needs_more_practice" as const),
      evaluated_at: new Date().toISOString(),
    };

    // Update topic mastery for Tree Traversal & Recursion
    const updatedMastery = state.mastery.map((m) => {
      if (m.topic_id === "top-recursion" || m.topic_id === "top-tree-traversal") {
        return {
          ...m,
          mastery_score: Math.max(m.mastery_score, score),
          status: score >= 0.75 ? ("strong" as const) : ("developing" as const),
          questions_attempted: m.questions_attempted + 1,
          questions_correct: m.questions_correct + (isPassed ? 1 : 0),
        };
      }
      return m;
    });

    // Mark Root Cause as resolved if passed
    const updatedRootCauses = state.rootCauses.map((rc) => {
      if (isPassed && rc.observed_topic_id === "top-tree-traversal") {
        return { ...rc, status: "resolved" as const };
      }
      return rc;
    });

    const updatedState = {
      ...state,
      transferAssessments: [updatedTransfer],
      mastery: updatedMastery,
      rootCauses: updatedRootCauses,
    };

    saveState(updatedState);
    setState(updatedState);
  };

  if (!state) return null;

  const currentTransfer = state.transferAssessments[0];
  const baseline = currentTransfer?.baseline_score || 0.25;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
          <FileCheck2 className="w-4 h-4" />
          <span>Scientific Mastery Verification</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Transfer-of-Knowledge Verification</h1>
        <p className="text-xs text-slate-500 mt-1">
          Verifying genuine conceptual mastery by testing your understanding in a completely new, unfamiliar application context.
        </p>
      </div>

      {/* Comparison Baseline Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Concept</span>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">Recursive Tree Traversal &amp; Unwinding</h2>
          <div className="text-xs text-slate-500 mt-1">
            Original Issue: Failed 3 of 4 binary tree tracing questions (Baseline: <strong>{Math.round(baseline * 100)}%</strong>)
          </div>
        </div>

        <div className="flex items-center gap-6 self-start sm:self-auto">
          <div className="text-center">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Baseline Score</div>
            <div className="text-2xl font-bold text-rose-500">{Math.round(baseline * 100)}%</div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300" />
          <div className="text-center">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Verification Score</div>
            <div className="text-2xl font-bold text-emerald-600">
              {verificationScore !== null ? `${Math.round(verificationScore * 100)}%` : "Pending"}
            </div>
          </div>
        </div>
      </div>

      {/* Novel Context Challenge Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="pb-4 border-b border-slate-100">
          <div className="inline-block px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
            Novel Application Context (Transfer Challenge)
          </div>
          <h3 className="text-base font-bold text-slate-900 leading-snug">
            Instead of a standard Binary Search Tree, consider a hierarchical File System Directory Tree where each directory contains a list of files and subdirectories.
          </h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Write a brief algorithmic trace explaining how a recursive function computes the total byte size of a root directory. Explicitly describe the <strong>base condition</strong> and how individual file sizes are accumulated back up during <strong>stack frame unwinding</strong>.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your Conceptual Explanation &amp; Trace:
            </label>
            <textarea
              rows={5}
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              placeholder="1. Base Case: If the item is a regular file, return its size directly.&#10;2. Recursive Step: For each subdirectory, invoke calculateSize(subdir)...&#10;3. Stack Unwinding: Add child return values to total..."
              required
              className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Confidence:</span>
              <select
                value={confidence}
                onChange={(e) => setConfidence(e.target.value)}
                className="px-2 py-1 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
              >
                <option value="guessing">Guessing</option>
                <option value="somewhat">Somewhat Confident</option>
                <option value="confident">Very Confident</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verify Conceptual Transfer</span>
            </button>
          </div>
        </form>

        {/* Evaluation Output */}
        {isEvaluated && verificationScore !== null && (
          <div
            className={`p-5 rounded-xl border text-xs space-y-3 ${
              verificationScore >= 0.75
                ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                : "bg-amber-50/70 border-amber-300 text-amber-950"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>
                  Verification Result: {verificationScore >= 0.75 ? "Genuine Transfer Verified!" : "Needs More Practice"}
                </span>
              </div>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-white border">
                Score: {Math.round(verificationScore * 100)}% (Lift: +{Math.round((verificationScore - baseline) * 100)}%)
              </span>
            </div>

            <p className="text-xs leading-relaxed">{feedback}</p>

            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <span>Return to Dashboard</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                href="/report"
                className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold text-xs"
              >
                View Diagnostic Report
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
