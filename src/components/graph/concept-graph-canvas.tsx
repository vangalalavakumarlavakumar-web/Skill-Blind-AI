"use client";

import React, { useState, useMemo } from "react";
import { GraphNode, GraphEdge } from "@/lib/services/concept-graph-service";
import { AlertTriangle, ArrowRight, CheckCircle2, HelpCircle, Layers, Sparkles, XCircle } from "lucide-react";

interface ConceptGraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onSelectNode?: (node: GraphNode) => void;
  selectedNodeId?: string;
}

// Compute clean hierarchical DAG layout coordinates dynamically
function computeDynamicCoordinates(
  nodes: GraphNode[],
  edges: GraphEdge[],
  canvasWidth = 1000,
  canvasHeight = 400
): Record<string, { x: number; y: number }> {
  if (nodes.length === 0) return {};

  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  nodes.forEach((n) => {
    inDegree.set(n.id, 0);
    adj.set(n.id, []);
  });

  edges.forEach((e) => {
    if (adj.has(e.source) && inDegree.has(e.target)) {
      adj.get(e.source)!.push(e.target);
      inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
    }
  });

  const rank = new Map<string, number>();
  const queue: string[] = [];

  nodes.forEach((n) => {
    if ((inDegree.get(n.id) || 0) === 0) {
      rank.set(n.id, 0);
      queue.push(n.id);
    }
  });

  if (queue.length === 0) {
    nodes.forEach((n, idx) => rank.set(n.id, idx % 4));
  } else {
    while (queue.length > 0) {
      const u = queue.shift()!;
      const r = rank.get(u) || 0;
      const neighbors = adj.get(u) || [];
      for (const v of neighbors) {
        const nextR = Math.max(rank.get(v) || 0, r + 1);
        rank.set(v, nextR);
        const deg = (inDegree.get(v) || 1) - 1;
        inDegree.set(v, deg);
        if (deg === 0) {
          queue.push(v);
        }
      }
    }
  }

  nodes.forEach((n, idx) => {
    if (!rank.has(n.id)) {
      rank.set(n.id, idx % 3);
    }
  });

  const maxRank = Math.max(...Array.from(rank.values()), 0);
  const rawCols: GraphNode[][] = Array.from({ length: maxRank + 1 }, () => []);
  nodes.forEach((n) => {
    const r = Math.min(rank.get(n.id) || 0, maxRank);
    rawCols[r].push(n);
  });

  const activeColumns = rawCols.filter((col) => col.length > 0);
  const totalCols = activeColumns.length;

  const paddingX = 95;
  const colSpacing = totalCols > 1 ? (canvasWidth - 2 * paddingX) / (totalCols - 1) : 0;
  const paddingY = 60;
  const usableHeight = canvasHeight - 2 * paddingY;

  const coords: Record<string, { x: number; y: number }> = {};

  activeColumns.forEach((colNodes, colIdx) => {
    const x = totalCols > 1 ? paddingX + colIdx * colSpacing : canvasWidth / 2;
    const count = colNodes.length;
    colNodes.forEach((node, rowIdx) => {
      const y = paddingY + (rowIdx + 0.5) * (usableHeight / count);
      coords[node.id] = { x: Math.round(x), y: Math.round(y) };
    });
  });

  return coords;
}

export default function ConceptGraphCanvas({
  nodes,
  edges,
  onSelectNode,
  selectedNodeId,
}: ConceptGraphCanvasProps) {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(
    selectedNodeId || nodes[0]?.id || null
  );

  const coordinates = useMemo(() => {
    return computeDynamicCoordinates(nodes, edges, 1000, 400);
  }, [nodes, edges]);

  const activeNode = useMemo(() => {
    return nodes.find((n) => n.id === activeNodeId) || nodes[0] || null;
  }, [nodes, activeNodeId]);

  const handleNodeClick = (node: GraphNode) => {
    setActiveNodeId(node.id);
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
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-slate-100 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-800 text-xs">Directed Prerequisite Dependency DAG</span>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">
              {nodes.length} Concepts • {edges.length} Dependencies
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-600">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Strong (≥75%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Developing</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Bottleneck (&lt;45%)</span>
          </div>
        </div>

        <div className="relative w-full overflow-x-auto min-h-[380px] flex items-center justify-center bg-slate-50/40 rounded-xl border border-slate-100 p-2">
          {nodes.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              No concepts available for this subject.
            </div>
          ) : (
            <svg viewBox="0 0 1000 400" className="w-full max-w-[1000px] h-auto select-none">
              <defs>
                <marker
                  id="arrowhead-slate"
                  markerWidth="8"
                  markerHeight="6"
                  refX="7"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
                </marker>
                <marker
                  id="arrowhead-active"
                  markerWidth="8"
                  markerHeight="6"
                  refX="7"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="#2563eb" />
                </marker>
              </defs>

              {/* Render Directed Edges */}
              {edges.map((edge) => {
                const srcCoord = coordinates[edge.source] || { x: 100, y: 100 };
                const tgtCoord = coordinates[edge.target] || { x: 200, y: 200 };
                const isConnected =
                  activeNode?.id === edge.source || activeNode?.id === edge.target;

                const dx = (tgtCoord.x - srcCoord.x) / 2;
                const pathD = `M ${srcCoord.x + 65} ${srcCoord.y} C ${srcCoord.x + 65 + dx} ${srcCoord.y}, ${tgtCoord.x - 65 - dx} ${tgtCoord.y}, ${tgtCoord.x - 65} ${tgtCoord.y}`;

                return (
                  <g key={edge.id}>
                    <path
                      d={pathD}
                      fill="none"
                      stroke={isConnected ? "#2563eb" : "#cbd5e1"}
                      strokeWidth={isConnected ? 2.5 : 1.5}
                      strokeDasharray={edge.relationshipType === "helpful_foundation" ? "4 4" : undefined}
                      markerEnd={isConnected ? "url(#arrowhead-active)" : "url(#arrowhead-slate)"}
                      className="transition-colors duration-200"
                    />
                  </g>
                );
              })}

              {/* Render Concept Nodes */}
              {nodes.map((node) => {
                const coord = coordinates[node.id] || { x: 100, y: 100 };
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
                        r="45"
                        fill="#ef4444"
                        opacity="0.15"
                        className="animate-ping"
                      />
                    )}

                    {/* Node Card Box */}
                    <rect
                      x="-68"
                      y="-32"
                      width="136"
                      height="64"
                      rx="10"
                      fill={isSelected ? "#0f172a" : "#ffffff"}
                      stroke={isSelected ? "#2563eb" : badge.stroke}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      filter="drop-shadow(0 1px 3px rgba(0,0,0,0.06))"
                      className="transition-all duration-200"
                    />

                    {/* Bottleneck indicator badge */}
                    {node.isPrerequisiteBottleneck && (
                      <g transform="translate(48, -26)">
                        <circle r="8" fill="#ef4444" />
                        <text x="0" y="3" fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="bold">!</text>
                      </g>
                    )}

                    {/* Status Pip */}
                    <circle
                      cx="-50"
                      cy="-14"
                      r="4.5"
                      fill={badge.color.replace("bg-", "").includes("emerald") ? "#10b981" : badge.color.replace("bg-", "").includes("rose") ? "#ef4444" : badge.color.replace("bg-", "").includes("amber") ? "#f59e0b" : "#94a3b8"}
                    />

                    {/* Concept Name */}
                    <text
                      x="-38"
                      y="-11"
                      fill={isSelected ? "#ffffff" : "#0f172a"}
                      fontSize="10.5"
                      fontWeight="600"
                    >
                      {node.name.length > 15 ? node.name.slice(0, 14) + "…" : node.name}
                    </text>

                    {/* Mastery Level */}
                    <text
                      x="-50"
                      y="14"
                      fill={isSelected ? "#94a3b8" : "#64748b"}
                      fontSize="9.5"
                    >
                      {node.masteryStatus === "insufficient_evidence"
                        ? "Unassessed"
                        : `Mastery: ${Math.round(node.masteryScore * 100)}%`}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        <div className="text-[11px] text-slate-500 mt-2 text-center">
          Click any concept in the directed acyclic graph to inspect its prerequisites, dependents, and diagnostic evidence.
        </div>
      </div>

      {/* Node Inspector Side Panel */}
      <div className="w-full lg:w-80 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
        {activeNode ? (
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Concept Inspector
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getStatusBadge(activeNode.masteryStatus).text}`}>
                {getStatusBadge(activeNode.masteryStatus).label}
              </span>
            </div>

            <div className="mt-4">
              <h3 className="font-bold text-slate-900 text-base">{activeNode.name}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {activeNode.description || "Core foundational curriculum concept."}
              </p>
            </div>

            {/* Bottleneck Warning Callout */}
            {activeNode.isPrerequisiteBottleneck && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-900 leading-snug">
                  <span className="font-bold">Prerequisite Bottleneck Detected:</span> Conceptual deficiency here cascades down to downstream dependent concepts.
                </div>
              </div>
            )}

            {/* Performance Metrics */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
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
                <ArrowRight className="w-3.5 h-3.5 text-blue-600 rotate-180" />
                <span>Required Prerequisites:</span>
              </div>
              {activePrereqs.length > 0 ? (
                <div className="space-y-1.5">
                  {activePrereqs.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleNodeClick(p)}
                      className="p-2 rounded-lg bg-blue-50/60 hover:bg-blue-50 border border-blue-100 text-xs font-medium text-blue-950 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span>{p.name}</span>
                      <span className="text-[10px] text-blue-700 font-semibold">{Math.round(p.masteryScore * 100)}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic">Root foundational concept (No prerequisites)</div>
              )}
            </div>

            {/* Downstream Dependents */}
            <div className="mt-4">
              <div className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-2">
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                <span>Enables Subsequent Concepts:</span>
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
                      <span className="text-[10px] text-slate-500 capitalize">{d.difficulty}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic">Terminal applied concept</div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-xs text-slate-400 py-10">Select a concept to inspect</div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100">
          <a
            href="/quiz"
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Assess Concepts in Quiz</span>
          </a>
        </div>
      </div>
    </div>
  );
}
