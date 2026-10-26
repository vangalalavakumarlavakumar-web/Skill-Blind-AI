"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileSearch,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Sparkles,
  ArrowRight,
  BookOpen,
  GitBranch,
  ShieldAlert,
  Send,
  Upload,
} from "lucide-react";
import { getInitialState, SkillBlindState } from "@/lib/storage";

interface SampleQuestion {
  id: string;
  subjectCode: string;
  source: string;
  title: string;
  questionText: string;
  prerequisites: string[];
  cognitiveSteps: {
    step: number;
    name: string;
    description: string;
    riskLevel: "safe" | "moderate" | "critical";
    predictedScorePct: number;
    gapWarning?: string;
  }[];
  verdict: {
    expectedScore: number;
    fatalStep: number;
    recommendedAction: string;
  };
}

const PRELOADED_QUESTIONS: SampleQuestion[] = [
  {
    id: "q-dsa-1",
    subjectCode: "CS201",
    source: "Midterm Exam 2025 - Problem 4 (15 Marks)",
    title: "Binary Tree Path Sum with Recursive Target Tracking",
    questionText:
      "Write a recursive function `hasPathSum(TreeNode* root, int targetSum)` that returns true if the tree has a root-to-leaf path such that adding all the values along the path equals targetSum. Explain what happens to targetSum when returning from a leaf node back to its parent.",
    prerequisites: ["Functions & Scope", "Recursion & Call Stacks", "Tree Traversal (DFS)"],
    cognitiveSteps: [
      {
        step: 1,
        name: "Base Condition Formulation",
        description: "Checking if root is null or if root is a leaf with root->val == targetSum.",
        riskLevel: "safe",
        predictedScorePct: 90,
      },
      {
        step: 2,
        name: "Subtree Recursive Decomposition",
        description: "Calling hasPathSum on left and right subtrees with (targetSum - root->val).",
        riskLevel: "moderate",
        predictedScorePct: 75,
      },
      {
        step: 3,
        name: "Call Stack Activation Record Unwinding",
        description:
          "Explaining why targetSum returns to its original parent frame value without manual restoration.",
        riskLevel: "critical",
        predictedScorePct: 22,
        gapWarning:
          "CRITICAL GAP DETECTED: Student assumes targetSum must be explicitly decremented or restored manually because stack frame activation records and scope unwinding are not understood.",
      },
    ],
    verdict: {
      expectedScore: 9, // out of 15
      fatalStep: 3,
      recommendedAction:
        "Complete 'Recursion Stack Unwinding' tracing exercise before attempting this exam problem.",
    },
  },
  {
    id: "q-dsa-2",
    subjectCode: "CS201",
    source: "Final Exam 2024 - Problem 2 (10 Marks)",
    title: "Lowest Common Ancestor (LCA) in a Binary Search Tree",
    questionText:
      "Given the root of a BST and two nodes p and q, find their Lowest Common Ancestor. Analyze the time complexity compared to finding LCA in a general binary tree.",
    prerequisites: ["Binary Search Trees (BST)", "Recursion & Call Stacks"],
    cognitiveSteps: [
      {
        step: 1,
        name: "BST Ordering Property Application",
        description: "If both p and q are smaller than root, traverse left; if both greater, traverse right.",
        riskLevel: "safe",
        predictedScorePct: 88,
      },
      {
        step: 2,
        name: "Split Node Detection",
        description: "Identifying the root as LCA when p and q split across left and right.",
        riskLevel: "safe",
        predictedScorePct: 82,
      },
      {
        step: 3,
        name: "Tree Height vs Number of Nodes Complexity Proof",
        description: "Explaining O(h) vs O(N) complexity based on subtree pruning.",
        riskLevel: "moderate",
        predictedScorePct: 68,
      },
    ],
    verdict: {
      expectedScore: 8,
      fatalStep: 0,
      recommendedAction: "Review O(h) worst-case skewed tree degradation.",
    },
  },
  {
    id: "q-dbms-1",
    subjectCode: "CS202",
    source: "University Question Paper - Module 3 (12 Marks)",
    title: "Transaction Concurrency & Strict 2-Phase Locking (2PL)",
    questionText:
      "Show how Strict 2PL prevents cascading rollbacks in an interleaved execution schedule of T1, T2, and T3. Provide a timeline of lock acquisitions and releases.",
    prerequisites: ["ACID Properties", "Schedule Conflict Serializability", "Locking Protocols"],
    cognitiveSteps: [
      {
        step: 1,
        name: "Conflict Graph & Schedule Identification",
        description: "Checking read-write and write-read conflicts across timeline.",
        riskLevel: "safe",
        predictedScorePct: 85,
      },
      {
        step: 2,
        name: "Strict 2PL Exclusive Lock Holding Invariant",
        description: "Holding exclusive locks until commit/abort to eliminate dirty reads.",
        riskLevel: "critical",
        predictedScorePct: 30,
        gapWarning:
          "Student consistently confuses Basic 2PL with Strict 2PL lock release points.",
      },
    ],
    verdict: {
      expectedScore: 7,
      fatalStep: 2,
      recommendedAction: "Review strict lock holding rule in DBMS Unit 4 notes.",
    },
  },
];

export default function ForensicsPage() {
  const [state, setState] = useState<SkillBlindState | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<SampleQuestion>(PRELOADED_QUESTIONS[0]);
  const [customInput, setCustomInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const s = getInitialState();
    setState(s);
  }, []);

  const handleAnalyzeCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    setAnalyzing(true);
    setTimeout(() => {
      setSelectedQuestion({
        id: "custom-" + Date.now(),
        subjectCode: state?.subject?.code || "CS201",
        source: "User Uploaded Exam / Assignment Prompt",
        title: "Forensic Analysis of Custom Question",
        questionText: customInput,
        prerequisites: ["Functions & Scope", "Recursion & Call Stacks", "Tree Traversal"],
        cognitiveSteps: [
          {
            step: 1,
            name: "Problem Decomposition",
            description: "Identifying base conditions and invariant setup.",
            riskLevel: "safe",
            predictedScorePct: 88,
          },
          {
            step: 2,
            name: "Prerequisite Invariant Execution",
            description: "Applying recursive execution frames and state transitions.",
            riskLevel: "critical",
            predictedScorePct: 24,
            gapWarning:
              "Student diagnostic profile indicates a severe gap in Call Stack Unwinding. You are 76% likely to lose marks here.",
          },
        ],
        verdict: {
          expectedScore: 6,
          fatalStep: 2,
          recommendedAction:
            "Isolate foundational prerequisite in Recursion stack frames prior to writing the exam response.",
        },
      });
      setAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
              Exam Risk Forensics
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Predictive Stumble-Point Analyzer
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <FileSearch className="w-6 h-6 text-rose-600" />
            Exam Question & Past Paper Gap Forensics
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Analyze any exam question or assignment problem: our cognitive forensic model breaks it down into constituent prerequisite steps and reveals where you are statistically prone to lose marks.
          </p>
        </div>
      </div>

      {/* Select Preloaded Questions */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-500 uppercase shrink-0">
          Sample Exam Papers:
        </span>
        {PRELOADED_QUESTIONS.map((q) => (
          <button
            key={q.id}
            onClick={() => setSelectedQuestion(q)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedQuestion.id === q.id
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {q.subjectCode} — {q.title}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Question Details & Custom Input (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Question Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                {selectedQuestion.source}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {selectedQuestion.subjectCode}
              </span>
            </div>

            <h2 className="text-base font-bold text-slate-900">
              {selectedQuestion.title}
            </h2>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono">
              {selectedQuestion.questionText}
            </div>

            {/* Prerequisites required */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Cognitive Prerequisites Required:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedQuestion.prerequisites.map((p) => (
                  <span
                    key={p}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1.5"
                  >
                    <GitBranch className="w-3 h-3 text-blue-600" />
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Paste Custom Question Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              Analyze Your Own Question or Assignment
            </h3>
            <form onSubmit={handleAnalyzeCustom} className="space-y-3">
              <textarea
                rows={3}
                placeholder="Paste any university exam question, midterm problem, or coding challenge here..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
              />
              <button
                type="submit"
                disabled={analyzing || !customInput.trim()}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>{analyzing ? "Running Forensic Breakdown..." : "Run Cognitive Forensics"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Forensic Stumble-Point Report (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Verdict Scorecard */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-50/80 to-amber-50/80 border border-rose-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Forensic Diagnostic Prediction
              </div>
              <div className="mt-1 text-sm font-bold text-slate-900">
                Fatal Stumble Point: Step {selectedQuestion.verdict.fatalStep}
              </div>
              <p className="mt-1 text-xs text-slate-600">
                {selectedQuestion.verdict.recommendedAction}
              </p>
            </div>

            <div className="text-center sm:text-right shrink-0 bg-white p-3.5 rounded-xl border border-rose-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Predicted Exam Mark
              </span>
              <span className="text-2xl font-extrabold text-rose-600">
                {selectedQuestion.verdict.expectedScore}/15
              </span>
              <span className="text-[10px] text-slate-500 block">Marks Forecast</span>
            </div>
          </div>

          {/* Step-by-Step Cognitive Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Cognitive Execution Trace & Vulnerability Map
            </h3>

            <div className="space-y-4">
              {selectedQuestion.cognitiveSteps.map((step) => {
                const isCritical = step.riskLevel === "critical";
                const isSafe = step.riskLevel === "safe";

                return (
                  <div
                    key={step.step}
                    className={`p-4 rounded-xl border transition-all ${
                      isCritical
                        ? "bg-rose-50/60 border-rose-300 ring-1 ring-rose-500/20"
                        : isSafe
                        ? "bg-emerald-50/40 border-emerald-200"
                        : "bg-amber-50/40 border-amber-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                            isCritical
                              ? "bg-rose-600 text-white"
                              : isSafe
                              ? "bg-emerald-600 text-white"
                              : "bg-amber-600 text-white"
                          }`}
                        >
                          {step.step}
                        </span>
                        <span className="font-bold text-xs text-slate-900">
                          {step.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            isCritical
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : isSafe
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {step.riskLevel.toUpperCase()} VULNERABILITY
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-700">
                          {step.predictedScorePct}%
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 ml-8 leading-relaxed">
                      {step.description}
                    </p>

                    {step.gapWarning && (
                      <div className="mt-3 ml-8 p-3 rounded-lg bg-rose-100/70 border border-rose-300 text-xs text-rose-950 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Cognitive Blindspot:</strong> {step.gapWarning}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
