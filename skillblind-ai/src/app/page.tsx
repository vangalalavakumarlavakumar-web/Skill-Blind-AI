"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  BookOpen,
  HelpCircle,
  FileText,
  Upload,
  Brain,
  TrendingUp,
  FileCheck2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navigation Bar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base tracking-tight flex items-center gap-1.5">
                GapFinder <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold border border-blue-200">AI</span>
              </span>
              <span className="block text-[10px] text-slate-500 font-medium">Curriculum Diagnostic Intelligence</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#framework" className="hover:text-blue-600 transition-colors">Diagnostic Methodology</a>
            <a href="#subjects" className="hover:text-blue-600 transition-colors">Course Modules (20 Qs)</a>
            <a href="#case-study" className="hover:text-blue-600 transition-colors">Empirical Evaluation</a>
            <a href="#upload" className="hover:text-blue-600 transition-colors">PDF Ingestion</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold px-3 py-1.5 text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Student Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Clean Academic Design */}
      <section className="pt-16 pb-20 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 mb-6">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Autonomous Engineering Curriculum Diagnostic Benchmark</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Empirical Cognitive Gap Detection & <br />
            <span className="text-blue-700">Prerequisite Failure Isolation</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            A source-grounded diagnostic assessment system for higher education. GapFinder AI parses course syllabi, isolates foundational prerequisite gaps across directed dependency graphs, and delivers targeted learning interventions.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/quiz"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Take 20-Question Diagnostic Assessment</span>
            </Link>
            <Link
              href="/materials"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4 text-slate-600" />
              <span>Upload Subject PDF Syllabus</span>
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-300" />
            </Link>
          </div>

          <div className="mt-8 text-xs text-slate-500 font-medium flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-slate-100">
            <span>✓ 5 Preloaded Core Subjects (DSA, DBMS, OS, Networks, ML)</span>
            <span>✓ 20 Diagnostic Questions Per Subject</span>
            <span>✓ Automated PDF Syllabus Ingestion</span>
          </div>
        </div>

        {/* Diagnostic Concept Dependency Chain Card */}
        <div className="max-w-5xl mx-auto px-6 mt-12">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Diagnostic Walkthrough</span>
                <h3 className="text-base font-bold text-slate-900">Concept Prerequisite Dependency Analysis</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Demonstrating how a failure in Tree Traversal originates from an unaddressed prerequisite gap in Recursion Stack Unwinding.
                </p>
              </div>
              <Link
                href="/graph"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-blue-700 hover:bg-slate-100 flex items-center gap-1 self-start sm:self-auto transition-colors"
              >
                <span>Interactive Graph</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Concept Chain Preview */}
            <div className="py-6 flex flex-col md:flex-row items-center justify-center gap-3 overflow-x-auto">
              <div className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-center min-w-[140px] shadow-xs">
                <div className="text-[10px] uppercase font-bold text-slate-400">Step 1</div>
                <div className="text-xs font-bold text-slate-800 mt-1">Functions & Scope</div>
                <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  92% Strong
                </span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 hidden md:block" />

              <div className="px-4 py-3 rounded-xl bg-rose-50 border-2 border-rose-300 text-center min-w-[170px] shadow-xs">
                <div className="text-[10px] uppercase font-bold text-rose-600">Root-Cause Bottleneck</div>
                <div className="text-xs font-bold text-rose-950 mt-1">Recursion & Call Stacks</div>
                <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold border border-rose-200">
                  28% Prerequisite Gap
                </span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 hidden md:block" />

              <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-300 text-center min-w-[150px] shadow-xs">
                <div className="text-[10px] uppercase font-bold text-amber-700">Observed Symptom</div>
                <div className="text-xs font-bold text-amber-950 mt-1">Tree Traversal</div>
                <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-200">
                  25% Exam Failure
                </span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 hidden md:block" />

              <div className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-center min-w-[150px] shadow-xs">
                <div className="text-[10px] uppercase font-bold text-rose-500">Predicted Downstream Risk</div>
                <div className="text-xs font-bold text-slate-800 mt-1">Graph Algorithms</div>
                <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                  88% High Risk
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs text-blue-950">
              <span className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-700 shrink-0" />
                <span>
                  <strong>Root-Cause Finding:</strong> Traditional scorecards advise reviewing &quot;Tree Traversal&quot;. GapFinder AI isolates the foundational gap: student cannot unwind recursion stack frames.
                </span>
              </span>
              <Link href="/diagnosis" className="font-semibold text-blue-700 hover:underline shrink-0 ml-3">
                Evidence Details →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Supported Core Subjects Section */}
      <section id="subjects" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Supported Curricula</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Comprehensive 20-Question Diagnostic Banks
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Preloaded with 100+ vetted, textbook-grounded diagnostic assessment items across computer science departments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { code: "CS201", name: "Data Structures & Algorithms", items: "20 Diagnostic Qs", desc: "Recursion, BSTs, Floyd's cycle, Dijkstra, DP" },
              { code: "CS301", name: "Database Management Systems", items: "20 Diagnostic Qs", desc: "ACID, BCNF, B+ Trees, 2PL locks, WAL logs" },
              { code: "CS302", name: "Operating Systems", items: "20 Diagnostic Qs", desc: "Context switch, semaphores, Banker's, paging" },
              { code: "CS401", name: "Computer Networks", items: "20 Diagnostic Qs", desc: "TCP 3-way, CIDR subnetting, OSPF, DNS, TLS" },
              { code: "CS501", name: "Machine Learning & AI", items: "20 Diagnostic Qs", desc: "Bias-variance, regularization, gradient descent" },
            ].map((subj) => (
              <div key={subj.code} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold text-blue-700 uppercase">{subj.code}</div>
                  <div className="text-xs font-bold text-slate-900 mt-1 leading-snug">{subj.name}</div>
                  <div className="text-[10px] text-slate-500 mt-1 leading-normal">{subj.desc}</div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {subj.items}
                  </span>
                  <Link href="/quiz" className="font-semibold text-blue-600 hover:underline">
                    Take Exam →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="framework" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Diagnostic Architecture</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Scientific Diagnostic Workflow
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-xs">PDF Syllabus Ingestion</h3>
              <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                Upload PDFs for any subject. The system chunks text, extracts core concepts, and synthesizes 20-question diagnostic assessments.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Dependency Graphs</h3>
              <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                Directed acyclic dependency graphs map every foundational concept to its applied downstream learning objectives.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Confidence Calibration</h3>
              <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                Correlates student subjective confidence against actual response correctness to identify dangerous high-confidence misconceptions.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Transfer Testing</h3>
              <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                Validates true conceptual repair by presenting completely novel scenarios to guarantee students haven&apos;t simply memorized questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study / Before and After */}
      <section id="case-study" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Measurable Educational Lift</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Comparative Benchmark Results
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-200">
              <div className="flex items-center justify-between pb-3 border-b border-rose-200">
                <span className="text-xs font-bold text-rose-800 uppercase">Traditional Scorecard Approach</span>
                <span className="text-xs font-bold text-rose-700">Before</span>
              </div>
              <div className="mt-4 space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>Assessment:</strong> Student scores 25% on Tree Traversal.</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>Advisory:</strong> &quot;Reread Chapter 5 on Trees.&quot; Student rereads but fails midterm because call stack unwinding was the root cause.</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                <span className="text-xs font-bold text-emerald-800 uppercase">GapFinder Diagnostic Model</span>
                <span className="text-xs font-bold text-emerald-700">+60% Verified Lift</span>
              </div>
              <div className="mt-4 space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Diagnosis:</strong> Root cause isolated in prerequisite <em>Recursion Stack Unwinding</em>. Targeted tracing intervention assigned.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Verification:</strong> Student achieved <strong>85%</strong> on a novel file-system traversal assessment.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-900">GapFinder AI Academic Diagnostic Platform</span>
            <span>— Autonomous Engineering College Curriculum Benchmark</span>
          </div>
          <div>
            Built by Lava Kumar • Department of Computer Science & Engineering
          </div>
        </div>
      </footer>
    </div>
  );
}
