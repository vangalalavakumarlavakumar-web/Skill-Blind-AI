import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillBlind AI — Predictive Knowledge Gap Detection & Adaptive Learning Intelligence",
  description:
    "Find the Gap. Understand the Cause. Master the Concept. SkillBlind AI uncovers hidden learning difficulties, identifies missing prerequisites, and builds an adaptive path toward genuine understanding.",
  keywords: [
    "SkillBlind AI",
    "Concept Dependency Graph",
    "Root-Cause Diagnosis",
    "Predictive Knowledge Gap",
    "RAG Learning Intelligence",
    "Transfer of Knowledge",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
