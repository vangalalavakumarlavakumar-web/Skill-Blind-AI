import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "GapFinder AI — Predictive Knowledge Gap Detection & Adaptive Learning Intelligence",
  description:
    "Find the Gap. Understand the Cause. Master the Concept. GapFinder AI takes a student's syllabus, textbook chapters, notes and past question papers, finds hidden weak areas, and builds an adaptive personalized revision plan.",
  keywords: [
    "GapFinder AI",
    "SkillBlind AI",
    "Knowledge Gap Detection",
    "Concept Dependency Graph",
    "Root-Cause Diagnosis",
    "Predictive Learning Risk",
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
      <body className="antialiased bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
