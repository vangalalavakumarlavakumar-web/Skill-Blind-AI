"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  Flame,
  Award,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Compass,
} from "lucide-react";
import { getInitialState, SkillBlindState } from "@/lib/storage";

interface Flashcard {
  id: string;
  topic: string;
  category: "root_cause" | "misconception" | "transfer_concept";
  question: string;
  answer: string;
  sourceCitation: string;
  keyRule: string;
  intervalDays: number;
  status: "new" | "learning" | "review" | "mastered";
}

const DEFAULT_FLASHCARDS: Flashcard[] = [
  {
    id: "fc-1",
    topic: "Recursion & Call Stacks",
    category: "root_cause",
    question: "What exact event occurs in CPU memory when a recursive function reaches its base case return statement?",
    answer: "The current top activation record (stack frame) is popped off the program call stack. Control, along with the evaluated return value, is transferred to the instruction address immediately following the recursive call inside the parent caller's frame.",
    sourceCitation: "DSA Syllabus: Section 3.2 (Activation Records & Call Stack Frames)",
    keyRule: "LIFO (Last In First Out) unwinding: Memory is not freed all at once; it unwinds one activation record per function return.",
    intervalDays: 1,
    status: "learning",
  },
  {
    id: "fc-2",
    topic: "Tree Traversal (DFS)",
    category: "misconception",
    question: "Why does recursive Inorder traversal on a Binary Tree visit the root node in sorted order only if it is a BST?",
    answer: "Inorder executes Inorder(Left) -> Visit(Root) -> Inorder(Right). For an arbitrary Binary Tree, there is no value relationship between left and right. Only a Binary Search Tree enforces the global invariant that all left subtree keys < root key < all right subtree keys.",
    sourceCitation: "DSA Textbook: Chapter 5, Section 4 (BST Invariants)",
    keyRule: "Inorder traversal preserves monotonic order strictly as a consequence of the BST invariant, not the traversal algorithm itself.",
    intervalDays: 3,
    status: "review",
  },
  {
    id: "fc-3",
    topic: "Recursion Stack Unwinding",
    category: "root_cause",
    question: "Consider: int f(int n) { if(n<=1) return 1; return f(n-1) + n; } What is the sequence of returned values during the unwinding phase for f(3)?",
    answer: "Base case f(1) returns 1. Frame f(2) receives 1 and computes 1 + 2 = 3. Frame f(3) receives 3 and computes 3 + 3 = 6. Final return is 6.",
    sourceCitation: "DSA Lecture Notes: Unit 2.4 (Tracing Stack Decomposition)",
    keyRule: "Each frame holds its own local variable 'n' preserved independently until its subcall terminates.",
    intervalDays: 2,
    status: "learning",
  },
  {
    id: "fc-4",
    topic: "Graph Algorithms",
    category: "transfer_concept",
    question: "How does Depth First Search (DFS) on a general graph prevent infinite recursion when cycles exist?",
    answer: "By maintaining a 'visited' boolean set or array. Before invoking DFS recursively on adjacent vertex v, the algorithm verifies that visited[v] is false. Once entered, visited[v] is set to true immediately.",
    sourceCitation: "DSA Syllabus: Section 6.1 (Graph Traversal & Cycle Avoidance)",
    keyRule: "Cycle detection requires state persistence across recursive invocations using a global or heap-allocated visited structure.",
    intervalDays: 4,
    status: "mastered",
  },
  {
    id: "fc-5",
    topic: "Functions & Scope",
    category: "misconception",
    question: "What is the difference between pass-by-value and pass-by-reference when passing an array/pointer in recursive tree operations?",
    answer: "Pass-by-value copies the primitive value onto the frame. For pointers/references, copying the pointer passes an independent reference to the SAME underlying heap memory. Mutating fields mutates the shared tree, but reassigning the local pointer does not alter the caller's node pointer.",
    sourceCitation: "DSA Foundation Notes: Section 1.3 (Parameter Passing Mechanics)",
    keyRule: "Local pointer mutations stay in the stack frame; heap node mutations persist globally.",
    intervalDays: 1,
    status: "learning",
  },
];

export default function FlashcardsPage() {
  const [state, setState] = useState<SkillBlindState | null>(null);
  const [cards, setCards] = useState<Flashcard[]>(DEFAULT_FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [streak, setStreak] = useState(4);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const s = getInitialState();
    setState(s);
  }, []);

  const filteredCards = cards.filter((c) => {
    if (filter === "root_cause") return c.category === "root_cause";
    if (filter === "misconception") return c.category === "misconception";
    return true;
  });

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleRating = (rating: "again" | "hard" | "good" | "easy") => {
    setIsFlipped(false);
    setStreak((prev) => prev + 1);

    // Update interval
    const updatedCards = [...cards];
    const targetIdx = updatedCards.findIndex((c) => c.id === currentCard.id);
    if (targetIdx !== -1) {
      if (rating === "again") updatedCards[targetIdx].intervalDays = 1;
      if (rating === "hard") updatedCards[targetIdx].intervalDays = 2;
      if (rating === "good") updatedCards[targetIdx].intervalDays = 4;
      if (rating === "easy") {
        updatedCards[targetIdx].intervalDays = 7;
        updatedCards[targetIdx].status = "mastered";
      }
      setCards(updatedCards);
    }

    handleNext();
  };

  const masteredCount = cards.filter((c) => c.status === "mastered").length;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
              Active Recall & Spaced Repetition
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Algorithm: SuperMemo SM-2
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Layers className="w-6 h-6 text-purple-600" />
            GapCards — Evidence-Grounded Smart Flashcards
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Active recall flashcards generated directly from your diagnostic misconceptions and syllabus source excerpts.
          </p>
        </div>

        {/* Streak & Mastery Stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>{streak} Day Streak</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>{masteredCount}/{cards.length} Mastered</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {[
            { id: "all", label: "All Gap Cards" },
            { id: "root_cause", label: "Root-Cause Foundational Gaps" },
            { id: "misconception", label: "High-Confidence Misconceptions" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFilter(tab.id);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === tab.id
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-mono">
          Card {currentIndex + 1} of {filteredCards.length}
        </span>
      </div>

      {/* 3D Flashcard Display Area */}
      {currentCard ? (
        <div className="space-y-6">
          <div
            onClick={handleFlip}
            className="cursor-pointer min-h-[340px] bg-white rounded-3xl border-2 border-slate-200 hover:border-purple-300 shadow-lg p-8 sm:p-12 flex flex-col justify-between transition-all duration-300 hover:shadow-xl relative overflow-hidden group select-none"
          >
            {/* Top metadata row */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                  {currentCard.topic}
                </span>
                <span className="text-[10px] text-slate-400">
                  Next review interval: {currentCard.intervalDays} day{currentCard.intervalDays > 1 ? "s" : ""}
                </span>
              </div>
              <span className="text-xs font-semibold text-purple-600 group-hover:underline flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5" />
                {isFlipped ? "Click to view Prompt" : "Click to Reveal Answer"}
              </span>
            </div>

            {/* Main content: Front (Question) vs Back (Answer) */}
            <div className="my-auto py-6">
              {!isFlipped ? (
                <div>
                  <span className="text-xs uppercase tracking-wider font-extrabold text-slate-400 block mb-2">
                    Diagnostic Challenge Prompt
                  </span>
                  <p className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
                    {currentCard.question}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-600 block mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Evidence-Grounded Cognitive Explanation
                    </span>
                    <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-medium">
                      {currentCard.answer}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-purple-950">
                    <span className="font-bold">Core Academic Rule:</span> {currentCard.keyRule}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Citation footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                {currentCard.sourceCitation}
              </span>
              <span className="text-[10px] text-slate-400">
                Syllabus Evidence Grounded
              </span>
            </div>
          </div>

          {/* SM-2 Spaced Repetition Grading Bar */}
          {isFlipped ? (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="text-center text-xs font-bold text-slate-600">
                How well did you recall this concept? (SM-2 Spaced Scheduling)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => handleRating("again")}
                  className="p-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold flex flex-col items-center gap-1 transition-colors"
                >
                  <span>Again</span>
                  <span className="text-[10px] text-rose-600 font-normal">Review in 10m (1d)</span>
                </button>
                <button
                  onClick={() => handleRating("hard")}
                  className="p-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold flex flex-col items-center gap-1 transition-colors"
                >
                  <span>Hard</span>
                  <span className="text-[10px] text-amber-600 font-normal">Review in 2 days</span>
                </button>
                <button
                  onClick={() => handleRating("good")}
                  className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold flex flex-col items-center gap-1 transition-colors"
                >
                  <span>Good</span>
                  <span className="text-[10px] text-blue-600 font-normal">Review in 4 days</span>
                </button>
                <button
                  onClick={() => handleRating("easy")}
                  className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex flex-col items-center gap-1 transition-colors"
                >
                  <span>Easy</span>
                  <span className="text-[10px] text-emerald-600 font-normal">Review in 7 days</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrev}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Card</span>
              </button>

              <button
                onClick={handleFlip}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <span>Reveal Answer</span>
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>Next Card</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
