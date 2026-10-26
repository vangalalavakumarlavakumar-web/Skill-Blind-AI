"use client";

import React, { useState } from "react";
import { GraphNode, GraphEdge } from "@/lib/services/concept-graph-service";
import { AlertTriangle, ArrowRight, CheckCircle2, HelpCircle, Layers, Sparkles, XCircle } from "lucide-react";

interface ConceptGraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onSelectNode?: (node: GraphNode) => void;
  selectedNodeId?: string;
}

// Preset visual coordinates for a clean hierarchical left-to-right DAG layout
const NODE_COORDINATES: Record<string, { x: number; y: number }> = {
  "top-prog-fund": { x: 80, y: 160 },
  "top-functions": { x: 260, y: 160 },
  "top-recursion": { x: 450, y: 160 },
  "top-tree-traversal": { x: 660, y: 100 },
  "top-binary-trees": { x: 880, y: 100 },
  "top-graphs": { x: 660, y: 260 },
  "top-arrays": { x: 260, y: 300 },
  "top-linked-lists": { x: 450, y: 300 },
};

export default function ConceptGraphCanvas({
  nodes,
  edges,
  onSelectNode,
  selectedNodeId,
}: ConceptGraphCanvasProps) {
  const [activeNode, setActiveNode] = useState<GraphNode | null>(
    nodes.find((n) => n.id === selectedNodeId) || nodes.find((n) => n.id === "top-recursion") || nodes[0] || null
  );

  const handleNodeClick = (node: GraphNode) => {
    setActiveNode(node);
    if (onSelectNode) onSelectNode(node);
  };

  const getStatusBadge = (status: GraphNode["masteryStatus"]) => {
    switch (status) {
      case "strong":
        return { label: "Strong", color: "bg-emerald-500", stroke: "#10b981", text: "text-emerald-700 bg-emerald-50 border-emerald-200" };
      case "developing":
        return { label: "Developing", color: "bg-amber-500", stroke: "#f59e0b", text: "text-amber-700 bg-amber-50 border-amber-200" };
      case "weak":
        return { label: "Weak Prerequisite", color: "bg-rose-500", stroke: "#ef4444", text: "text-rose-700 bg-rose-50 border-rose-200" };
      default:
        return { label: "Needs Evidence", color: "bg-slate-400", stroke: "#94a3b8", text: "text-slate-600 bg-slate-50 border-slate-200" };
    }
  };

  // Find prerequisites and dependents for active node
  const activePrereqs = edges
    .filter((e) => e.target === activeNode?.id)
    .map((e) => nodes.find((n) => n.id === e.source))
    .filter(Boolean) as GraphNode[];

  const activeDependents = edges
    .filter((e) => e.source === activeNode?.id)
    .map((e) => nodes.find((n) => n.id === e.target))
    .filter(Boolean) as GraphNode[];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Visual SVG Canvas */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold text-slate-800 text-sm">Interactive Concept Dependency Graph</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Strong (≥75%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Developing (45-74%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Weak (&lt;45%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Unassessed</span>
          </div>
        </div>

        <div className="relative w-full overflow-x-auto min-h-[360px] flex items-center justify-center">
          <svg viewBox="0 0 980 380" className="w-full max-w-[980px] h-auto select-none">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
              </marker>
              <marker
                id="arrowhead-highlight"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#4f46e5" />
              </marker>
            </defs>

            {/* Render Edges */}
            {edges.map((edge) => {
              const srcCoord = NODE_COORDINATES[edge.source] || { x: 100, y: 100 };
              const tgtCoord = NODE_COORDINATES[edge.target] || { x: 200, y: 200 };
              const isConnected =
                activeNode?.id === edge.source || activeNode?.id === edge.target;

              // Calculate control points for smooth bezier curve
              const dx = (tgtCoord.x - srcCoord.x) / 2;
              const pathD = `M ${srcCoord.x + 65} ${srcCoord.y} C ${srcCoord.x + 65 + dx} ${srcCoord.y}, ${tgtCoord.x - 65 - dx} ${tgtCoord.y}, ${tgtCoord.x - 65} ${tgtCoord.y}`;

              return (
                <g key={edge.id}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isConnected ? "#4f46e5" : "#cbd5e1"}
                    strokeWidth={isConnected ? 2.5 : 1.5}
                    strokeDasharray={edge.relationshipType === "helpful_foundation" ? "4 4" : undefined}
                    markerEnd={isConnected ? "url(#arrowhead-highlight)" : "url(#arrowhead)"}
                    className="transition-colors duration-200"
                  />
                </g>
              );
            })}

            {/* Render Nodes */}
            {nodes.map((node) => {
              const coord = NODE_COORDINATES[node.id] || { x: 100, y: 100 };
              const isSelected = activeNode?.id === node.id;
              const badge = getStatusBadge(node.masteryStatus);

              return (
                <g
                  key={node.id}
                  transform={`translate(${coord.x}, ${coord.y})`}
                  onClick={() => handleNodeClick(node)}
                  className="cursor-pointer group"
                >
                  {/* Bottleneck glow ripple if weak prerequisite */}
                  {node.isPrerequisiteBottleneck && (
                    <circle
                      r="50"
                      fill="#ef4444"
                      opacity="0.15"
                      className="animate-ping"
                    />
                  )}

                  {/* Node Card Container */}
                  <rect
                    x="-70"
                    y="-34"
                    width="140"
                    height="68"
                    rx="12"
                    fill={isSelected ? "#1e1b4b" : "#ffffff"}
                    stroke={isSelected ? "#4f46e5" : badge.stroke}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
                    className="transition-all duration-200"
                  />

                  {/* Bottleneck badge marker */}
                  {node.isPrerequisiteBottleneck && (
                    <g transform="translate(50, -30)">
                      <circle r="9" fill="#ef4444" />
                      <text x="0" y="3.5" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">!</text>
                    </g>
                  )}

                  {/* Status Indicator Pip */}
                  <circle
                    cx="-52"
                    cy="-16"
                    r="5"
                    fill={badge.color.replace("bg-", "").includes("emerald") ? "#10b981" : badge.color.replace("bg-", "").includes("rose") ? "#ef4444" : badge.color.replace("bg-", "").includes("amber") ? "#f59e0b" : "#94a3b8"}
                  />

                  {/* Node Title */}
                  <text
                    x="-40"
                    y="-12"
                    fill={isSelected ? "#ffffff" : "#1e293b"}
                    fontSize="11"
                    fontWeight="600"
                  >
                    {node.name.length > 15 ? node.name.slice(0, 14) + "..." : node.name}
                  </text>

                  {/* Mastery Score / Status Label */}
                  <text
                    x="-52"
                    y="14"
                    fill={isSelected ? "#cbd5e1" : "#64748b"}
                    fontSize="10"
                  >
                    {node.masteryStatus === "insufficient_evidence"
                      ? "Unassessed"
                      : `Mastery: ${Math.round(node.masteryScore * 100)}%`}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="text-[11px] text-slate-500 mt-2 text-center">
          Click any concept to reveal prerequisite relationships, assessment history, and root-cause diagnoses.
        </div>
      </div>

      {/* Node Inspector Side Panel */}
      <div className="w-full lg:w-80 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
        {activeNode ? (
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Concept Inspector
              </span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${getStatusBadge(activeNode.masteryStatus).text}`}>
                {getStatusBadge(activeNode.masteryStatus).label}
              </span>
            </div>

            <div className="mt-4">
              <h3 className="font-bold text-slate-900 text-lg">{activeNode.name}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {activeNode.description || "Core foundational concept in Data Structures and Algorithms."}
              </p>
            </div>

            {/* Bottleneck Warning Callout */}
            {activeNode.isPrerequisiteBottleneck && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-900 leading-snug">
                  <span className="font-bold">Prerequisite Bottleneck Detected:</span> Weakness here directly cascades to dependent concepts (Tree Traversal and Graph Algorithms).
                </div>
              </div>
            )}

            {/* Performance Metrics */}
            <div className="mt-5 grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Mastery</div>
                <div className="text-lg font-bold text-slate-900">
                  {Math.round(activeNode.masteryScore * 100)}%
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Questions</div>
                <div className="text-lg font-bold text-slate-900">
                  {activeNode.questionsAttempted}
                </div>
              </div>
            </div>

            {/* Immediate Prerequisites */}
            <div className="mt-5">
              <div className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-2">
                <ArrowRight className="w-3.5 h-3.5 text-indigo-500 rotate-180" />
                Required Prerequisites:
              </div>
              {activePrereqs.length > 0 ? (
                <div className="space-y-1.5">
                  {activePrereqs.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleNodeClick(p)}
                      className="p-2 rounded-lg bg-indigo-50/60 hover:bg-indigo-50 border border-indigo-100 text-xs font-medium text-indigo-900 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span>{p.name}</span>
                      <span className="text-[10px] text-indigo-600 font-semibold">{Math.round(p.masteryScore * 100)}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic">Foundational concept (No prerequisites)</div>
              )}
            </div>

            {/* Downstream Dependents */}
            <div className="mt-4">
              <div className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-2">
                <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
                Enables Subsequent Topics:
              </div>
              {activeDependents.length > 0 ? (
                <div className="space-y-1.5">
                  {activeDependents.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => handleNodeClick(d)}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span>{d.name}</span>
                      <span className="text-[10px] text-slate-500">{d.difficulty}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic">Terminal advanced topic</div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-xs text-slate-400 py-10">Select a concept to inspect</div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100">
          <a
            href="/quiz"
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Assess This Concept Now
          </a>
        </div>
      </div>
    </div>
  );
}
