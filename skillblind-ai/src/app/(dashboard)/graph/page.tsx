"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";
import { getInitialState, saveState, SkillBlindState } from "@/lib/storage";
import { buildConceptGraph } from "@/lib/services/concept-graph-service";
import ConceptGraphCanvas from "@/components/graph/concept-graph-canvas";

export default function GraphPage() {
  const [state, setState] = useState<SkillBlindState | null>(null);

  useEffect(() => {
    setState(getInitialState());
  }, []);

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

  const { topics, dependencies, mastery } = state;
  const graphData = buildConceptGraph(topics, dependencies, mastery);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Concept Dependency Graph</h1>
          <p className="text-xs text-slate-500 mt-1">
            Directed prerequisite architecture mapping foundational requirements to advanced application concepts.
          </p>
        </div>
      </div>

      {/* Main Graph Component */}
      <ConceptGraphCanvas nodes={graphData.nodes} edges={graphData.edges} />

      {/* Prerequisite Edges & Evidence Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Inferred Prerequisite Relationships & Evidence</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Extracted from syllabus and textbook chapter sequences. Review and verify relationships below.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">{dependencies.length} Directed Relationships</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Prerequisite Concept</th>
                <th className="py-2.5 px-3">Enables Dependent Concept</th>
                <th className="py-2.5 px-3">Relationship Type</th>
                <th className="py-2.5 px-3">AI Confidence</th>
                <th className="py-2.5 px-3">Source Evidence</th>
                <th className="py-2.5 px-3 text-right">Student Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {dependencies.map((dep) => {
                const prereq = topics.find((t) => t.id === dep.prerequisite_topic_id);
                const dependent = topics.find((t) => t.id === dep.dependent_topic_id);

                return (
                  <tr key={dep.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{prereq?.name || "Topic"}</td>
                    <td className="py-3 px-3 font-semibold text-indigo-700 flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span>{dependent?.name || "Topic"}</span>
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
        </div>
      </div>
    </div>
  );
}
