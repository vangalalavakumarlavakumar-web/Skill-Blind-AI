"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Sliders,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Info,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { getInitialState, SkillBlindState } from "@/lib/storage";
import {
  calculateLearningRiskPredictions,
  DEFAULT_WEIGHTS,
  RiskScoringWeights,
} from "@/lib/services/predictive-risk-service";
import { LearningRiskPrediction } from "@/types";

export default function PredictionsPage() {
  const [state, setState] = useState<SkillBlindState | null>(null);
  const [weights, setWeights] = useState<RiskScoringWeights>(DEFAULT_WEIGHTS);
  const [predictions, setPredictions] = useState<LearningRiskPrediction[]>([]);

  useEffect(() => {
    const s = getInitialState();
    setState(s);
    const preds = calculateLearningRiskPredictions(
      s.topics,
      s.dependencies,
      s.mastery,
      s.user?.id || "demo-user-101",
      weights
    );
    setPredictions(preds);
  }, []);

  const handleWeightChange = (key: keyof RiskScoringWeights, val: number) => {
    const nextWeights = { ...weights, [key]: val };
    setWeights(nextWeights);
    if (state) {
      const preds = calculateLearningRiskPredictions(
        state.topics,
        state.dependencies,
        state.mastery,
        state.user?.id || "demo-user-101",
        nextWeights
      );
      setPredictions(preds);
    }
  };

  if (!state) return null;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Explainable Predictive Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Predictive Knowledge Gap Model</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Forecasts potential future learning bottlenecks before they occur, evaluating prerequisite deficits, concept complexity, and historical error tendencies.
          </p>
        </div>

        <Link
          href="/interventions"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm self-start sm:self-auto transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Apply Preventive Interventions</span>
        </Link>
      </div>

      {/* Transparent Disclaimer Alert */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Transparent Mathematical Methodology:</span>
          <p className="text-[11px] text-amber-900 mt-0.5 leading-relaxed">
            These predictions represent an <strong>estimated learning-risk score</strong> derived from configurable weighted heuristics along the concept dependency graph. They are predictive warnings, not fixed certainties.
          </p>
        </div>
      </div>

      {/* Interactive Scoring Weights Control Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">Configurable Factor Scoring Weights</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Prerequisite Deficit:</span>
              <span className="text-indigo-600">{Math.round(weights.prerequisiteDeficitWeight * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.05"
              value={weights.prerequisiteDeficitWeight}
              onChange={(e) => handleWeightChange("prerequisiteDeficitWeight", parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="text-[10px] text-slate-400 mt-1">Impact of missing foundational mastery</div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Concept Complexity:</span>
              <span className="text-indigo-600">{Math.round(weights.downstreamComplexityWeight * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.6"
              step="0.05"
              value={weights.downstreamComplexityWeight}
              onChange={(e) => handleWeightChange("downstreamComplexityWeight", parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="text-[10px] text-slate-400 mt-1">Inherent topic difficulty level</div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Evidence Uncertainty:</span>
              <span className="text-indigo-600">{Math.round(weights.evidenceUncertaintyWeight * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={weights.evidenceUncertaintyWeight}
              onChange={(e) => handleWeightChange("evidenceUncertaintyWeight", parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="text-[10px] text-slate-400 mt-1">Penalty for unassessed topics</div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Recency Decay:</span>
              <span className="text-indigo-600">{Math.round(weights.recencyDecayWeight * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.4"
              step="0.05"
              value={weights.recencyDecayWeight}
              onChange={(e) => handleWeightChange("recencyDecayWeight", parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="text-[10px] text-slate-400 mt-1">Time elapsed since active recall</div>
          </div>
        </div>
      </div>

      {/* Predicted Risk Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Downstream Concept Risk Rankings ({predictions.length})</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predictions.map((pred) => {
            const isHigh = pred.risk_level === "high";
            const isModerate = pred.risk_level === "moderate";

            return (
              <div
                key={pred.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isHigh
                    ? "bg-rose-50/40 border-rose-200"
                    : isModerate
                    ? "bg-amber-50/40 border-amber-200"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{pred.topic?.name}</h3>
                    <div className="text-[10px] text-slate-500 capitalize">{pred.topic?.difficulty_level} Cognitive Level</div>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold border uppercase ${
                      isHigh
                        ? "bg-rose-100 text-rose-800 border-rose-300"
                        : isModerate
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : "bg-emerald-50 text-emerald-800 border-emerald-200"
                    }`}
                  >
                    {pred.risk_level === "high" ? "High Attention Needed" : pred.risk_level === "moderate" ? "Moderate Risk" : "Low Risk"} ({Math.round(pred.risk_score * 100)}%)
                  </span>
                </div>

                {/* Contributing Factors */}
                <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-200/60 text-xs">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase">Contributing Risk Drivers:</div>
                  {pred.contributing_factors.map((factor, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                      <span className="text-slate-400">•</span>
                      <span><strong>{factor.factor}:</strong> {factor.description}</span>
                    </div>
                  ))}
                </div>

                {/* Recommended Preventive Action */}
                <div className="mt-4 p-3 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-800">
                  <strong className="text-indigo-600 block mb-0.5">Recommended Preventive Action:</strong>
                  <span className="text-[11px] leading-snug">{pred.recommended_preventive_action}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
