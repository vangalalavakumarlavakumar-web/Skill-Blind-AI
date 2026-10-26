"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sliders,
  Sparkles,
  TrendingUp,
  ArrowRight,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  Layers,
  ChevronRight,
  Zap,
} from "lucide-react";
import { getInitialState, SkillBlindState } from "@/lib/storage";
import { Topic, ConceptDependency, TopicMastery } from "@/types";

interface SimulatedNode {
  topic: Topic;
  originalMastery: number;
  simulatedMastery: number;
  isRootCause: boolean;
  downstreamCount: number;
  unlockEffect: string;
}

export default function SimulatorPage() {
  const [state, setState] = useState<SkillBlindState | null>(null);
  const [rootOverrides, setRootOverrides] = useState<Record<string, number>>({});
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  useEffect(() => {
    const s = getInitialState();
    setState(s);
  }, []);

  if (!state) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentSubject = state.subject;
  const currentTopics = state.topics.filter(
    (t) => t.subject_id === state.activeSubjectId
  );
  const currentDeps = state.dependencies.filter(
    (d) => d.subject_id === state.activeSubjectId
  );
  const currentMasteryMap = new Map<string, TopicMastery>();
  state.mastery.forEach((m) => currentMasteryMap.set(m.topic_id, m));

  // Identify root causes (topics with low mastery that are prerequisites to downstream topics)
  const rootCauses = currentTopics.filter((t) => {
    const m = currentMasteryMap.get(t.id);
    const score = m ? m.mastery_score : 50;
    const isPrereq = currentDeps.some((d) => d.prerequisite_topic_id === t.id);
    return isPrereq && score < 70;
  });

  // Calculate downstream impacts dynamically based on simulation overrides
  const simulationResults: SimulatedNode[] = currentTopics.map((topic) => {
    const origMastery = currentMasteryMap.get(topic.id)?.mastery_score || 50;
    let simMastery = origMastery;

    // Check if this topic itself is directly overridden by user slider
    if (rootOverrides[topic.id] !== undefined) {
      simMastery = rootOverrides[topic.id];
    } else {
      // Find prerequisites for this topic
      const prereqDeps = currentDeps.filter((d) => d.dependent_topic_id === topic.id);
      if (prereqDeps.length > 0) {
        let totalLift = 0;
        prereqDeps.forEach((dep) => {
          const prereqOrig = currentMasteryMap.get(dep.prerequisite_topic_id)?.mastery_score || 50;
          const prereqSim =
            rootOverrides[dep.prerequisite_topic_id] !== undefined
              ? rootOverrides[dep.prerequisite_topic_id]
              : prereqOrig;

          if (prereqSim > prereqOrig) {
            const gain = prereqSim - prereqOrig;
            totalLift += gain * 0.65 * (dep.confidence || 0.9);
          }
        });
        simMastery = Math.min(100, Math.round(origMastery + totalLift));
      }
    }

    // Count downstream nodes
    const downstreamDeps = currentDeps.filter((d) => d.prerequisite_topic_id === topic.id);
    const isRoot = rootCauses.some((r) => r.id === topic.id);

    return {
      topic,
      originalMastery: origMastery,
      simulatedMastery: Math.max(origMastery, simMastery),
      isRootCause: isRoot,
      downstreamCount: downstreamDeps.length,
      unlockEffect:
        downstreamDeps.length > 0
          ? `Direct foundation for ${downstreamDeps.length} advanced topic${
              downstreamDeps.length > 1 ? "s" : ""
            }`
          : "End-of-chain assessment topic",
    };
  });

  // Aggregate Baseline vs Simulated Exam Performance
  const baselineAvg = Math.round(
    simulationResults.reduce((acc, n) => acc + n.originalMastery, 0) /
      (simulationResults.length || 1)
  );
  const simulatedAvg = Math.round(
    simulationResults.reduce((acc, n) => acc + n.simulatedMastery, 0) /
      (simulationResults.length || 1)
  );
  const scoreDelta = simulatedAvg - baselineAvg;
  const hoursSavedEst = Math.round(scoreDelta * 0.85);

  const handleSliderChange = (topicId: string, val: number) => {
    setRootOverrides((prev) => ({
      ...prev,
      [topicId]: val,
    }));
  };

  const handleResetSimulation = () => {
    setRootOverrides({});
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Exclusive Analytical Feature
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Curriculum: {currentSubject.name} ({currentSubject.code})
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-blue-600" />
            Counterfactual Gap Simulation Studio
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Simulate the mathematical ripple effect across prerequisite chains: see exactly how mastering root foundational gaps unblocks downstream topics and increases your final exam score.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleResetSimulation}
            className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Levers</span>
          </button>
          <Link
            href="/interventions"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply to Revision Plan</span>
          </Link>
        </div>
      </div>

      {/* Projection Scoreboard KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Baseline Mastery */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Current Baseline Score
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{baselineAvg}%</span>
            <span className="text-xs text-rose-600 font-semibold">Diagnostic status</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-slate-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${baselineAvg}%` }}
            />
          </div>
        </div>

        {/* Simulated Projected Score */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs ring-1 ring-blue-500/20">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Projected Exam Score
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-700">{simulatedAvg}%</span>
            {scoreDelta > 0 && (
              <span className="text-xs font-bold text-emerald-600">
                +{scoreDelta}% Projected Lift
              </span>
            )}
          </div>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${simulatedAvg}%` }}
            />
          </div>
        </div>

        {/* Study Time Leverage Ratio */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Prerequisite Leverage Ratio
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {scoreDelta > 0 ? "1 : 3.4" : "1 : 1.0"}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">High ROI</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Each 1 hour targeting the root node unlocks 3.4 hrs of advanced recovery.
          </p>
        </div>

        {/* Estimated Hours Saved */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            Estimated Study Hours Saved
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">
              +{hoursSavedEst}h
            </span>
            <span className="text-xs text-slate-500">efficient focus</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Avoids redundant re-reading of unblocked advanced chapters.
          </p>
        </div>
      </div>

      {/* Main Simulation Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Root-Cause Gap Levers (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  Root-Cause Prerequisite Control Levers
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Drag the sliders to simulate your target mastery on foundational concepts.
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700">
                {rootCauses.length} Root Gaps Identified
              </span>
            </div>

            <div className="mt-6 space-y-6">
              {rootCauses.map((topic) => {
                const orig = currentMasteryMap.get(topic.id)?.mastery_score || 35;
                const currentVal =
                  rootOverrides[topic.id] !== undefined ? rootOverrides[topic.id] : orig;
                const gain = currentVal - orig;
                const downstream = currentDeps.filter(
                  (d) => d.prerequisite_topic_id === topic.id
                );

                return (
                  <div
                    key={topic.id}
                    className={`p-4 rounded-xl border transition-all ${
                      gain > 0
                        ? "bg-blue-50/60 border-blue-300 ring-1 ring-blue-500/20"
                        : "bg-slate-50/80 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span className="font-bold text-sm text-slate-900">
                          {topic.name}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                          Root Bottleneck
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-blue-700">
                          {currentVal}%
                        </span>
                        {gain > 0 && (
                          <span className="ml-1 text-xs font-bold text-emerald-600">
                            (+{gain}%)
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mb-3">
                      {topic.description ||
                        "Foundational activation record and recursive execution invariant."}
                    </p>

                    {/* Interactive Slider */}
                    <div className="space-y-1.5">
                      <input
                        type="range"
                        min={orig}
                        max={100}
                        value={currentVal}
                        onChange={(e) => handleSliderChange(topic.id, parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Current: {orig}%</span>
                        <span>Target: 100% (Complete Mastery)</span>
                      </div>
                    </div>

                    {/* Direct Downstream Cascade Badges */}
                    <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <GitBranch className="w-3.5 h-3.5 text-blue-600" />
                        Directly unblocks:
                      </span>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {downstream.map((d) => {
                          const depTopic = currentTopics.find((t) => t.id === d.dependent_topic_id);
                          return (
                            <span
                              key={d.id}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-300 text-slate-700"
                            >
                              {depTopic?.name || "Advanced Concept"}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Downstream Cascade Propagation (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-4 border-b border-slate-200">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Dynamic Downstream Cascade
            </h2>

            <div className="mt-4 space-y-3">
              {simulationResults.map((node) => {
                const isBoosted = node.simulatedMastery > node.originalMastery;
                return (
                  <div
                    key={node.topic.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isBoosted
                        ? "bg-emerald-50/70 border-emerald-300"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isBoosted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border-2 border-slate-300 inline-block shrink-0" />
                        )}
                        <span className="text-xs font-bold text-slate-800">
                          {node.topic.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-mono">
                        <span className="text-slate-400 line-through">
                          {node.originalMastery}%
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span
                          className={`font-bold ${
                            isBoosted ? "text-emerald-700" : "text-slate-800"
                          }`}
                        >
                          {node.simulatedMastery}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isBoosted ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                        style={{ width: `${node.simulatedMastery}%` }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                      <span>{node.unlockEffect}</span>
                      {isBoosted && (
                        <span className="font-semibold text-emerald-700">
                          +{node.simulatedMastery - node.originalMastery}% Unlocked
                        </span>
                      )}
                    </div>
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
