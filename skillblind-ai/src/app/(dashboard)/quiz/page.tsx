"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Brain,
  Sparkles,
  RotateCcw,
  BookOpen,
  AlertTriangle,
  FileCheck,
} from "lucide-react";
import { getInitialState, saveState, SkillBlindState } from "@/lib/storage";
import { QuizQuestion, StudentAnswer, ConfidenceRating } from "@/types";
import { evaluateAnswer, recalculateTopicMastery } from "@/lib/services/quiz-service";
import { performRootCauseDiagnosis } from "@/lib/services/root-cause-service";
import { calculateLearningRiskPredictions } from "@/lib/services/predictive-risk-service";

export default function QuizPage() {
  const [state, setState] = useState<SkillBlindState | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [shortAnswerText, setShortAnswerText] = useState<string>("");
  const [confidence, setConfidence] = useState<ConfidenceRating>("somewhat");
  const [submittedAnswers, setSubmittedAnswers] = useState<StudentAnswer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setState(getInitialState());
  }, []);

  if (!state) return null;

  const currentQuiz = state.quizzes[0];
  const questions: QuizQuestion[] = currentQuiz?.questions || [];
  const currentQ = questions[currentIdx];

  const handleNextOrSubmit = () => {
    if (!currentQ) return;

    const response =
      currentQ.question_type === "short_answer" ? shortAnswerText.trim() : selectedOption.trim();

    if (!response) {
      alert("Please select or enter an answer before proceeding.");
      return;
    }

    // Evaluate answer
    const evalResult = evaluateAnswer(currentQ, response, confidence);

    const newAnswer: StudentAnswer = {
      id: `ans-${Date.now().toString().slice(-4)}`,
      attempt_id: `att-${Date.now().toString().slice(-4)}`,
      question_id: currentQ.id,
      student_response: response,
      confidence_rating: confidence,
      is_correct: evalResult.isCorrect,
      score: evalResult.score,
      evaluation_details: evalResult.evaluation,
      time_spent_seconds: 45,
      created_at: new Date().toISOString(),
    };

    const nextAnswers = [...submittedAnswers, newAnswer];
    setSubmittedAnswers(nextAnswers);

    // Reset inputs for next question
    setSelectedOption("");
    setShortAnswerText("");
    setConfidence("somewhat");

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Quiz completed! Finalize evaluation & update state
      finalizeQuiz(nextAnswers);
    }
  };

  const finalizeQuiz = (answers: StudentAnswer[]) => {
    if (!state) return;

    const totalScore = answers.reduce((acc, a) => acc + a.score, 0);
    const avgScore = answers.length > 0 ? Math.round((totalScore / answers.length) * 100) / 100 : 0;
    const correctCount = answers.filter((a) => a.is_correct).length;

    const newAttempt = {
      id: `att-${Date.now().toString().slice(-4)}`,
      quiz_id: currentQuiz.id,
      user_id: state.user?.id || "demo-user-101",
      score: avgScore,
      total_questions: answers.length,
      correct_answers: correctCount,
      completed_at: new Date().toISOString(),
      answers,
      quiz: currentQuiz,
    };

    // Update Topic Mastery for each question's topic
    let updatedMastery = [...state.mastery];
    answers.forEach((ans) => {
      const q = questions.find((item) => item.id === ans.question_id);
      if (!q) return;

      const existingM = updatedMastery.find((m) => m.topic_id === q.topic_id);
      const newM = recalculateTopicMastery(
        existingM,
        q.topic_id,
        state.user?.id || "demo-user-101",
        ans.score,
        ans.is_correct
      );

      updatedMastery = updatedMastery.filter((m) => m.topic_id !== q.topic_id).concat(newM);
    });

    // Run Root Cause Diagnosis on all completed answers
    const diagnosisResult = performRootCauseDiagnosis({
      userId: state.user?.id || "demo-user-101",
      subjectId: state.subject.id,
      answers: [...(state.attempts[0]?.answers || []), ...answers],
      questions: questions,
      topics: state.topics,
      dependencies: state.dependencies,
      masteryList: updatedMastery,
    });

    // Recalculate predictive risks
    const updatedPredictions = calculateLearningRiskPredictions(
      state.topics,
      state.dependencies,
      updatedMastery,
      state.user?.id || "demo-user-101"
    );

    const updatedState: SkillBlindState = {
      ...state,
      attempts: [newAttempt, ...state.attempts],
      mastery: updatedMastery,
      rootCauses: diagnosisResult.diagnoses.length > 0 ? diagnosisResult.diagnoses : state.rootCauses,
      misconceptions: diagnosisResult.misconceptions.length > 0 ? diagnosisResult.misconceptions : state.misconceptions,
      predictions: updatedPredictions,
    };

    saveState(updatedState);
    setState(updatedState);
    setIsCompleted(true);
  };

  const handleRetake = () => {
    setCurrentIdx(0);
    setSelectedOption("");
    setShortAnswerText("");
    setConfidence("somewhat");
    setSubmittedAnswers([]);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Quiz Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Diagnostic Assessment Engine
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            {currentQuiz.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">{currentQuiz.description}</p>
        </div>
      </div>

      {!isCompleted && currentQ ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>Question {currentIdx + 1} of {questions.length}</span>
              <span className="capitalize text-indigo-600 font-bold">{currentQ.difficulty} Difficulty</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="pt-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQ.question_text}
            </h2>
          </div>

          {/* Answer Inputs */}
          {currentQ.question_type === "short_answer" ? (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Type your conceptual explanation:
              </label>
              <textarea
                rows={4}
                value={shortAnswerText}
                onChange={(e) => setShortAnswerText(e.target.value)}
                placeholder="Explain the step-by-step mechanics clearly..."
                className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>
          ) : (
            <div className="space-y-2.5">
              {(currentQ.options || ["True", "False"]).map((opt, i) => {
                const isSelected = selectedOption === opt;
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedOption(opt)}
                    className={`p-3.5 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-500 text-indigo-950 font-bold shadow-xs"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <span>{opt}</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? "border-indigo-600 bg-indigo-600" : "border-slate-300"
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Confidence Calibration Section */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold text-slate-800 mb-2">
              How confident are you in this answer?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "guessing" as const, label: "Guessing (0-40%)" },
                { value: "somewhat" as const, label: "Somewhat (50-70%)" },
                { value: "confident" as const, label: "Very Confident (80-100%)" },
              ].map((c) => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setConfidence(c.value)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                    confidence === c.value
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-slate-500 mt-2">
              SkillBlind AI compares your subjective confidence against actual accuracy to uncover hidden misconceptions.
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleNextOrSubmit}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
            >
              <span>{currentIdx + 1 === questions.length ? "Submit & View Diagnosis" : "Next Question"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Results & Diagnosis Screen */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Diagnostic Assessment Complete</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Your answers have been evaluated with strict rubric matching and textbook grounding.
            </p>

            <div className="mt-6 flex items-center justify-center gap-6">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 min-w-[120px]">
                <div className="text-[10px] uppercase font-bold text-slate-400">Score</div>
                <div className="text-2xl font-bold text-indigo-600">
                  {Math.round(
                    (submittedAnswers.reduce((a, b) => a + b.score, 0) / submittedAnswers.length) * 100
                  )}%
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 min-w-[120px]">
                <div className="text-[10px] uppercase font-bold text-slate-400">Correct</div>
                <div className="text-2xl font-bold text-emerald-600">
                  {submittedAnswers.filter((a) => a.is_correct).length} / {submittedAnswers.length}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                href="/diagnosis"
                className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-semibold text-xs flex items-center gap-2 shadow-sm"
              >
                <span>View Root-Cause Diagnosis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={handleRetake}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
            </div>
          </div>

          {/* Question Breakdown with Citations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-100">
              Evaluated Question Breakdown & Grounding Citations
            </h3>

            <div className="space-y-4">
              {submittedAnswers.map((ans, idx) => {
                const q = questions.find((item) => item.id === ans.question_id);
                const isCorrect = ans.is_correct;

                return (
                  <div
                    key={ans.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      isCorrect ? "bg-emerald-50/40 border-emerald-200" : "bg-rose-50/40 border-rose-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-slate-900 flex items-start gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <span>Question {idx + 1}: {q?.question_text}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase shrink-0 bg-white border">
                        Score: {Math.round(ans.score * 100)}%
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 pl-6">
                      <strong>Your Answer:</strong> &quot;{ans.student_response}&quot; (Confidence: {ans.confidence_rating})
                    </div>

                    <div className="text-[11px] text-slate-700 pl-6">
                      <strong>Diagnostic Feedback:</strong> {ans.evaluation_details?.feedback}
                    </div>

                    {ans.evaluation_details?.grounding_citation && (
                      <div className="text-[10px] text-indigo-700 pl-6 font-medium flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-indigo-600" />
                        <span>Source Grounding: {ans.evaluation_details.grounding_citation}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
