import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
  return `${Math.round(score * 100)}%`;
}

export function getConfidenceBadgeColor(confidence: "guessing" | "somewhat" | "confident" | string) {
  switch (confidence) {
    case "confident":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "somewhat":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "guessing":
      return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
}

export function getRiskLevelColor(level: "high" | "moderate" | "low" | "insufficient") {
  switch (level) {
    case "high":
      return {
        bg: "bg-rose-500/10 text-rose-500 border-rose-500/20",
        badge: "High Risk",
        bar: "bg-rose-500",
      };
    case "moderate":
      return {
        bg: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        badge: "Moderate Attention",
        bar: "bg-amber-500",
      };
    case "low":
      return {
        bg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        badge: "Low Risk",
        bar: "bg-emerald-500",
      };
    default:
      return {
        bg: "bg-slate-500/10 text-slate-400 border-slate-500/20",
        badge: "Insufficient Evidence",
        bar: "bg-slate-500",
      };
  }
}

export function formatDate(dateStr: string | Date | undefined): string {
  if (!dateStr) return "N/A";
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
