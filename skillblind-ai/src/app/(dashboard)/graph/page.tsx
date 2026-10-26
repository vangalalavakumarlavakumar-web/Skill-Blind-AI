"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Info,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import { getInitialState, saveState, SkillBlindState, switchActiveSubject } from "@/lib/storage";
import { buildConceptGraph } from "@/lib/services/concept-graph-service";
import ConceptGraphCanvas from "@/components/graph/concept-graph-canvas";
import { getDependenciesForSubject } from "@/lib/subject-question-banks";

export default function GraphPage() {
  const [state, setState] = useState<SkillBlindState | null>(null);
  const [activeSubjectId, setActiveSubjectId] = useState<string>("subj-dsa-101");

  useEffect(() => {
    const s = getInitialState();
    setState(s);
    setActiveSubjectId(s.activeSubjectId || s.subject.id);
  }, []);

  const handleSubjectChange = (subjectId: string) => {
    const updated = switchActiveSubject(subjectId);
    setState(updated);
    setActiveSubjectId(subjectId);
  };

  const handleToggleVerify = (depId: string) => {
    if (!state) return;
    const updatedDeps = state.dependencies.map((d) =>
      d.id === depId ? { ...d, user_verified: !d.user_verified } : d
    );
    const updatedState = { ...state, dependencies: updatedDeps };
    saveState(updatedState);
    setState(updatedState);
  };

  if (!state) return null;

  const currentSubject = state.subjects.find((s) => s.id === activeSubjectId) || state.subject;

  // Filter topics and dependencies for active subject
  const subjectTopics = state.topics.filter((t) => t.subject_id === activeSubjectId);
  let subjectDependencies = state.dependencies.filter((d) => d.subject_id === activeSubjectId);

  // If no dependencies stored for this subject, fetch from banks
  if (subjectDependencies.length === 0) {
    subjectDependencies = getDependenciesForSubject(activeSubjectId);
  }

  const graphData = buildConceptGraph(
    subjectTopics.length > 0 ? subjectTopics : state.topics,
    subjectDependencies,
    state.mastery
  );

  return (
    <div className="space-y-6">
      {/* Page Header & Subject Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            Curriculum Dependency Architecture
          </span>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5 flex items-center gap-2">
            <span>Concept Dependency Graph:</span>
            <span className="text-blue-700">{currentSubject.name}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Directed prerequisite map linking foundational requirements to downstream application concepts.
          </p>
        </div>

        {/* Subject Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <select
              value={activeSubjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="bg-transparent font-bold text-slate-900 text-xs outline-none cursor-pointer"
            >
              {state.subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.code ? `${sub.code}: ` : ""}{sub.name}
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/quiz"
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Assess (20 Qs)</span>
          </Link>
        </div>
      </div>

      {/* Main Graph Component */}
      <ConceptGraphCanvas nodes={graphData.nodes} edges={graphData.edges} />

      {/* Prerequisite Edges & Evidence Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Prerequisite Dependencies & Textbook Evidence ({currentSubject.code || currentSubject.name})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Extracted from accredited curriculum syllabi and textbook chapter sequences. Review and verify relationships.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {subjectDependencies.length} Directed Links
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          {subjectDependencies.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No dependencies registered for this subject yet. Upload syllabus PDF to infer dependencies!
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Prerequisite Concept</th>
                  <th className="py-2.5 px-3">Enables Dependent Concept</th>
                  <th className="py-2.5 px-3">Relationship Type</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Source Evidence</th>
                  <th className="py-2.5 px-3 text-right">Student Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {subjectDependencies.map((dep) => {
                  const prereq = state.topics.find((t) => t.id === dep.prerequisite_topic_id);
                  const dependent = state.topics.find((t) => t.id === dep.dependent_topic_id);

                  return (
                    <tr key={dep.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">{prereq?.name || dep.prerequisite_topic_id}</td>
                      <td className="py-3 px-3 font-semibold text-blue-700 flex items-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span>{dependent?.name || dep.dependent_topic_id}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700">
                          {dep.relationship_type.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {Math.round(dep.confidence * 100)}%
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-xs truncate" title={dep.source_evidence}>
                        {dep.source_evidence}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleToggleVerify(dep.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                            dep.user_verified
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                          }`}
                        >
                          {dep.user_verified ? "Verified ✓" : "Verify"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
