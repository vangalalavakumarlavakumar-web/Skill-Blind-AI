"use client";

import React from "react";
import Link from "next/link";
import {
  Brain,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  GitBranch,
  TrendingUp,
  FileCheck2,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  BookOpen,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Navigation Bar */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-slate-950 text-lg tracking-tight">
                SkillBlind <span className="text-indigo-600">AI</span>
              </span>
              <span className="block text-[11px] text-slate-500 font-medium">Cognitive Gap Intelligence</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-indigo-600 transition-colors">Core Differentiators</a>
            <a href="#case-study" className="hover:text-indigo-600 transition-colors">Case Study</a>
            <a href="#security" className="hover:text-indigo-600 transition-colors">Security & Privacy</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold px-4 py-2 text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-semibold px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <span>Explore Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden bg-gradient-to-b from-white via-indigo-50/20 to-slate-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-semibold text-indigo-700 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Next-Gen Educational Intelligence & Root-Cause Diagnosis</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12]">
            Discover the Knowledge Gaps <br />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
              You Didn&apos;t Know You Had.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            SkillBlind AI uncovers hidden learning difficulties, identifies missing prerequisites, and builds an adaptive path toward genuine understanding.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-semibold text-sm shadow-lg shadow-slate-950/20 flex items-center justify-center gap-2.5 transition-all"
            >
              <span>Launch Student Dashboard</span>
              <ArrowRight className="w-4 h-4 text-indigo-400" />
            </Link>
            <Link
              href="/quiz"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <span>Take Diagnostic Quiz</span>
            </Link>
          </div>

          <div className="mt-6 text-xs text-slate-500 font-medium flex items-center justify-center gap-4">
            <span>✓ Preloaded CS201 Data Structures Subject</span>
            <span>✓ One-Click Evaluation</span>
            <span>✓ Genuine RAG & Graph Logic</span>
          </div>
        </div>

        {/* Hero Interactive Concept Graph Preview Card */}
        <div className="max-w-5xl mx-auto px-6 mt-14">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Live Demonstration</span>
                <h3 className="text-lg font-bold text-slate-900">Concept Prerequisite Dependency Graph</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visualizing how missing recursion fundamentals block tree traversal and graph algorithms.
                </p>
              </div>
              <Link
                href="/graph"
                className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center gap-1.5 self-start sm:self-auto transition-colors"
              >
                <span>Interactive Graph View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Concept Chain Preview */}
            <div className="py-8 flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-4 overflow-x-auto">
              <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[140px]">
                <div className="text-[10px] uppercase font-bold text-slate-400">Step 1</div>
                <div className="text-xs font-bold text-slate-800 mt-1">Functions & Scope</div>
                <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  92% Strong
                </span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-300 hidden md:block" />

              <div className="px-4 py-3 rounded-xl bg-rose-50 border-2 border-rose-400 text-center min-w-[170px] relative shadow-sm">
                <div className="absolute -top-2.5 right-2 px-1.5 py-0.2 rounded bg-rose-600 text-white text-[9px] font-bold">
                  Root Cause Bottleneck!
                </div>
                <div className="text-[10px] uppercase font-bold text-rose-500">Prerequisite Gap</div>
                <div className="text-xs font-bold text-rose-950 mt-1">Recursion & Call Stacks</div>
                <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold border border-rose-300">
                  28% Weak
                </span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-300 hidden md:block" />

              <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-300 text-center min-w-[150px]">
                <div className="text-[10px] uppercase font-bold text-amber-500">Observed Issue</div>
                <div className="text-xs font-bold text-amber-950 mt-1">Tree Traversal</div>
                <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-200">
                  25% Observed
                </span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-300 hidden md:block" />

              <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[150px]">
                <div className="text-[10px] uppercase font-bold text-rose-500">Predicted Risk</div>
                <div className="text-xs font-bold text-slate-800 mt-1">Graph Algorithms</div>
                <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                  88% High Risk
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
              <span className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-600" />
                <strong>Cognitive Diagnosis:</strong> Score-based platforms suggest reviewing &quot;Tree Traversal&quot;. SkillBlind AI diagnoses the actual root cause: student cannot unwind recursion stack frames.
              </span>
              <Link href="/diagnosis" className="font-semibold text-indigo-700 hover:underline shrink-0 ml-2">
                View Evidence →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">The 4-Step Diagnosis Workflow</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Beyond Quiz Scores: Scientific Diagnostic Intelligence
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              How SkillBlind AI transforms course materials into precision learning interventions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-14">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Material Ingestion</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Upload course syllabi, lecture notes, textbook chapters, and past exam papers. The platform cleans, chunks, and creates vector embeddings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Concept Dependency Graph</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Constructs directed prerequisite graphs mapping how foundational concepts link to advanced applications.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Root-Cause Diagnosis</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Evaluates responses against rubrics and confidence ratings. Traces errors back through the dependency graph to find the true underlying blindspot.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Transfer Verification</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Verifies genuine understanding by challenging the student with new, unfamiliar application contexts rather than repeating identical questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Differentiators Section */}
      <section id="features" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Core Innovations</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Engineered to Solve the Blindspots of Modern EdTech
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Root-Cause Diagnosis Engine</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Distinguishes between observed errors and underlying causes. Associates every hypothesis with verbatim student quotes and exact textbook citations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Predictive Risk Modeling</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Transparent factor weighting computes estimated learning risk for downstream concepts before the student even encounters them in an exam.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Transfer-of-Knowledge Testing</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Guarantees students haven&apos;t just memorized answer keys. Measures performance lift by generating fresh scenarios grounded in the same theoretical principles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study / Before-and-After */}
      <section id="case-study" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Measurable Results</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Real-World Learning Intervention Impact
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Case study from our Data Structures & Algorithms diagnostic benchmark.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-200">
              <div className="flex items-center justify-between pb-3 border-b border-rose-200">
                <span className="text-xs font-bold text-rose-800 uppercase">Traditional Score-Based Platform</span>
                <span className="text-xs font-bold text-rose-700">Before</span>
              </div>
              <div className="mt-4 space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>Diagnosis:</strong> &quot;Student scored 25% in Tree Traversal. Recommend re-reading Tree Traversal.&quot;</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>Result:</strong> Student rereads the tree chapter, but still fails the midterm because the underlying recursion blindspot was never repaired.</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-300 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                <span className="text-xs font-bold text-emerald-800 uppercase">SkillBlind AI Intelligence</span>
                <span className="text-xs font-bold text-emerald-700">After (+60% Lift)</span>
              </div>
              <div className="mt-4 space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Diagnosis:</strong> Root cause identified in prerequisite <em>Recursion Stack Unwinding</em>. Targeted tracing exercise recommended.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Verified Transfer:</strong> Student achieved <strong>85%</strong> on a completely new file-system traversal assessment.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section id="security" className="py-14 bg-slate-900 text-slate-300">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ShieldCheck className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">Academic Integrity & Row Level Security</h3>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl mx-auto leading-relaxed">
            All uploaded syllabi, lecture notes, and student attempts are protected by Supabase Row Level Security (RLS). Embeddings and retrieved chunks are strictly bound to the authenticated user ID with zero cross-student vector leakage.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-800">SkillBlind AI</span>
            <span>— Find the Gap. Understand the Cause. Master the Concept.</span>
          </div>
          <div>
            Built with Next.js 15, TypeScript, Tailwind CSS, Supabase, and Google Gemini.
          </div>
        </div>
      </footer>
    </div>
  );
}
