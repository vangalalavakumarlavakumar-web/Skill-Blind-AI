"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Brain,
  RotateCcw,
  BookOpen,
  Upload,
  FileText,
  Filter,
  Check,
  Sparkles,
  Layers,
} from "lucide-react";
import { getInitialState, saveState, SkillBlindState, switchActiveSubject } from "@/lib/storage";
import { QuizQuestion, StudentAnswer, ConfidenceRating, Subject, Quiz } from "@/types";
import { evaluateAnswer, recalculateTopicMastery } from "@/lib/services/quiz-service";
import { performRootCauseDiagnosis } from "@/lib/services/root-cause-service";
import { calculateLearningRiskPredictions } from "@/lib/services/predictive-risk-service";
import { getQuestionsForSubject } from "@/lib/subject-question-banks";
import { generateQuestionsFromDocument } from "@/lib/services/question-generator-service";
import { chunkText } from "@/lib/services/document-service";

export default function QuizPage() {
  const [state, setState] = useState<SkillBlindState | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [shortAnswerText, setShortAnswerText] = useState<string>("");
  const [confidence, setConfidence] = useState<ConfidenceRating>("somewhat");
  const [submittedAnswers, setSubmittedAnswers] = useState<StudentAnswer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeSubjectId, setActiveSubjectId] = useState<string>("subj-dsa-101");

  // PDF Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom question selection state
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    const s = getInitialState();
    setState(s);
    const subId = s.activeSubjectId || s.subject.id;
    setActiveSubjectId(subId);

    // Find quiz for current subject or fallback to questions bank
    const subjectQuiz = s.quizzes.find((q) => q.subject_id === subId);
    if (subjectQuiz && subjectQuiz.questions && subjectQuiz.questions.length >= 20) {
      setActiveQuestions(subjectQuiz.questions);
    } else {
      const bank = getQuestionsForSubject(subId);
      setActiveQuestions(bank);
    }
  }, []);

  const handleSubjectChange = (newSubjectId: string) => {
    const updated = switchActiveSubject(newSubjectId);
    setState(updated);
    setActiveSubjectId(newSubjectId);

    const subjectQuiz = updated.quizzes.find((q) => q.subject_id === newSubjectId);
    if (subjectQuiz && subjectQuiz.questions && subjectQuiz.questions.length >= 20) {
      setActiveQuestions(subjectQuiz.questions);
    } else {
      const bank = getQuestionsForSubject(newSubjectId);
      setActiveQuestions(bank);
    }

    // Reset quiz state
    setCurrentIdx(0);
    setSelectedOption("");
    setShortAnswerText("");
    setSubmittedAnswers([]);
    setIsCompleted(false);
  };

  const currentQ = activeQuestions[currentIdx];

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
      id: `ans-${Date.now().toString().slice(-4)}-${currentIdx}`,
      attempt_id: `att-${Date.now().toString().slice(-4)}`,
      question_id: currentQ.id,
      student_response: response,
      confidence_rating: confidence,
      is_correct: evalResult.isCorrect,
      score: evalResult.score,
      evaluation_details: evalResult.evaluation,
      time_spent_seconds: 40,
      created_at: new Date().toISOString(),
    };

    // Update or append answer
    const existingIdx = submittedAnswers.findIndex((a) => a.question_id === currentQ.id);
    let nextAnswers: StudentAnswer[];
    if (existingIdx >= 0) {
      nextAnswers = [...submittedAnswers];
      nextAnswers[existingIdx] = newAnswer;
    } else {
      nextAnswers = [...submittedAnswers, newAnswer];
    }
    setSubmittedAnswers(nextAnswers);

    // Reset current selection
    setSelectedOption("");
    setShortAnswerText("");
    setConfidence("somewhat");

    if (currentIdx + 1 < activeQuestions.length) {
      // Load next question's prior answer if already submitted
      const nextQ = activeQuestions[currentIdx + 1];
      const prevAns = nextAnswers.find((a) => a.question_id === nextQ.id);
      if (prevAns) {
        if (nextQ.question_type === "short_answer") setShortAnswerText(prevAns.student_response);
        else setSelectedOption(prevAns.student_response);
        if (prevAns.confidence_rating) setConfidence(prevAns.confidence_rating);
      }
      setCurrentIdx(currentIdx + 1);
    } else {
      // Finished all 20 questions! Finalize quiz
      finalizeQuiz(nextAnswers);
    }
  };

  const handleJumpToQuestion = (idx: number) => {
    if (idx < 0 || idx >= activeQuestions.length) return;
    setCurrentIdx(idx);

    const targetQ = activeQuestions[idx];
    const prevAns = submittedAnswers.find((a) => a.question_id === targetQ.id);
    if (prevAns) {
      if (targetQ.question_type === "short_answer") setShortAnswerText(prevAns.student_response);
      else setSelectedOption(prevAns.student_response);
      if (prevAns.confidence_rating) setConfidence(prevAns.confidence_rating);
    } else {
      setSelectedOption("");
      setShortAnswerText("");
      setConfidence("somewhat");
    }
  };

  const finalizeQuiz = (answers: StudentAnswer[]) => {
    if (!state) return;

    const totalScore = answers.reduce((acc, a) => acc + a.score, 0);
    const avgScore = answers.length > 0 ? Math.round((totalScore / answers.length) * 100) / 100 : 0;
    const correctCount = answers.filter((a) => a.is_correct).length;

    const currentQuiz =
      state.quizzes.find((q) => q.subject_id === activeSubjectId) || state.quizzes[0];

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

    // Update topic mastery
    let updatedMastery = [...state.mastery];
    answers.forEach((ans) => {
      const q = activeQuestions.find((item) => item.id === ans.question_id);
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

    // Run Root Cause Diagnosis
    const diagnosisResult = performRootCauseDiagnosis({
      userId: state.user?.id || "demo-user-101",
      subjectId: activeSubjectId,
      answers: [...(state.attempts[0]?.answers || []), ...answers],
      questions: activeQuestions,
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
      rootCauses:
        diagnosisResult.diagnoses.length > 0 ? diagnosisResult.diagnoses : state.rootCauses,
      misconceptions:
        diagnosisResult.misconceptions.length > 0
          ? diagnosisResult.misconceptions
          : state.misconceptions,
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

  // PDF Upload & Extraction Handler
  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !state) return;

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("subjectId", activeSubjectId);

      const res = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to extract text from PDF");
      }

      const data = await res.json();
      const extractedText = data.extractedText || "";

      // Chunk text
      const newChunks = chunkText(
        extractedText,
        `mat-${Date.now().toString().slice(-4)}`,
        state.user?.id || "demo-user-101"
      );

      // Generate 20 comprehensive questions from PDF!
      const generated20Qs = generateQuestionsFromDocument(
        file.name,
        newChunks,
        activeSubjectId,
        20
      );

      // Save new material
      const newMaterial = {
        id: `mat-${Date.now().toString().slice(-4)}`,
        user_id: state.user?.id || "demo-user-101",
        subject_id: activeSubjectId,
        title: file.name,
        document_type: "lecture_notes" as const,
        file_name: file.name,
        file_size: file.size,
        status: "processed" as const,
        total_pages: data.totalPages || 1,
        chunk_count: newChunks.length,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Create new 20-question quiz
      const newQuiz: Quiz = {
        id: `quiz-uploaded-${Date.now().toString().slice(-4)}`,
        subject_id: activeSubjectId,
        user_id: state.user?.id || "demo-user-101",
        title: `Diagnostic Assessment: ${file.name} (20 Questions)`,
        description: `Source-grounded assessment extracted from ${file.name}`,
        topic_ids: generated20Qs.map((q) => q.topic_id),
        questions_count: 20,
        created_at: new Date().toISOString(),
        questions: generated20Qs,
      };

      const updatedState: SkillBlindState = {
        ...state,
        materials: [newMaterial, ...state.materials],
        chunks: [...newChunks, ...state.chunks],
        quizzes: [newQuiz, ...state.quizzes],
      };

      saveState(updatedState);
      setState(updatedState);
      setActiveQuestions(generated20Qs);
      setCurrentIdx(0);
      setSelectedOption("");
      setShortAnswerText("");
      setSubmittedAnswers([]);
      setIsCompleted(false);
      setShowUploadModal(false);
      alert(`Successfully processed "${file.name}"! Loaded 20 source-grounded diagnostic questions.`);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Error processing PDF");
    } finally {
      setIsUploading(false);
    }
  };

  if (!state) return null;

  const currentSubject = state.subjects.find((s) => s.id === activeSubjectId) || state.subject;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Subject Selector & Diagnostic Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              Departmental Diagnostic Engine
            </span>
            <span className="text-xs text-slate-500 font-medium">20-Item Benchmark</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5 flex items-center gap-2">
            <span>Diagnostic Assessment:</span>
            <span className="text-blue-700">{currentSubject.name}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Testing conceptual understanding, misconception patterns, and prerequisite dependencies.
          </p>
        </div>

        {/* Subject Dropdown & PDF Upload Action */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <select
              value={activeSubjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="bg-transparent font-bold text-slate-900 text-xs outline-none cursor-pointer"
            >
              {state.subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.code ? `${sub.code}: ` : ""}{sub.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload PDF (20 Qs)</span>
          </button>
        </div>
      </div>

      {/* PDF Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Upload Syllabus or Textbook PDF</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Upload your course PDF for <strong>{currentSubject.name}</strong>. The system will parse the text, generate vector chunks, and automatically synthesize <strong>20 diagnostic questions</strong> with rubrics and textbook citations.
            </p>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md"
                onChange={handlePDFUpload}
                disabled={isUploading}
                className="hidden"
                id="pdf-file-upload-input"
              />
              <label
                htmlFor="pdf-file-upload-input"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-800">
                  {isUploading ? "Extracting PDF & Generating 20 Questions..." : "Click to select PDF or Text file"}
                </div>
                <div className="text-[10px] text-slate-400">Supported: .pdf, .txt, .md (Up to 25 MB)</div>
              </label>
            </div>

            {uploadError && (
              <div className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {uploadError}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Quick Jump Bar (1 to 20 Navigation) */}
      {!isCompleted && activeQuestions.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs">
            <span className="font-semibold text-slate-700">
              Question Navigator ({submittedAnswers.length} of {activeQuestions.length} answered)
            </span>
            <button
              onClick={() => setShowQuestionSelector(!showQuestionSelector)}
              className="text-blue-600 hover:text-blue-700 font-medium text-xs flex items-center gap-1"
            >
              <Filter className="w-3 h-3" />
              <span>{showQuestionSelector ? "Hide Overview" : "Choose / Review All 20 Questions"}</span>
            </button>
          </div>

          {/* 1 to 20 Pill Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {activeQuestions.map((q, idx) => {
              const isAnswered = submittedAnswers.some((a) => a.question_id === q.id);
              const isCurrent = currentIdx === idx;

              return (
                <button
                  key={q.id}
                  onClick={() => handleJumpToQuestion(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                    isCurrent
                      ? "bg-blue-600 text-white shadow-xs scale-105"
                      : isAnswered
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                  }`}
                  title={`Question ${idx + 1}: ${q.difficulty} difficulty`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Expanded Question Selection Drawer */}
          {showQuestionSelector && (
            <div className="mt-4 pt-3 border-t border-slate-100 max-h-64 overflow-y-auto space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase">
                Select Any Question from the 20-Item Bank:
              </div>
              {activeQuestions.map((q, idx) => {
                const ans = submittedAnswers.find((a) => a.question_id === q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => {
                      handleJumpToQuestion(idx);
                      setShowQuestionSelector(false);
                    }}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                      currentIdx === idx
                        ? "bg-blue-50 border-blue-300 text-blue-900"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-3">
                      <span className="w-5 h-5 rounded bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span className="truncate font-medium">{q.question_text}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 uppercase font-bold">
                        {q.difficulty}
                      </span>
                      {ans ? (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                          ✓ Answered
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Pending</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Main Question Card or Completed Screen */}
      {!isCompleted && currentQ ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          {/* Question Header & Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
              <span className="font-bold text-blue-700">
                Question {currentIdx + 1} of {activeQuestions.length}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                  {currentQ.question_type.replace("_", " ")}
                </span>
                <span className="capitalize text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                  {currentQ.difficulty} Difficulty
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / activeQuestions.length) * 100}%` }}
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
                Type your structured conceptual explanation:
              </label>
              <textarea
                rows={4}
                value={shortAnswerText}
                onChange={(e) => setShortAnswerText(e.target.value)}
                placeholder="State the core mechanism, boundary conditions, and execution consequences..."
                className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-sans"
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
                        ? "bg-blue-50 border-blue-600 text-blue-950 font-bold shadow-xs"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <span>{opt}</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300"
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
              Cognitive calibration correlates your subjective confidence against actual accuracy to isolate high-confidence misconceptions.
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => handleJumpToQuestion(currentIdx - 1)}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNextOrSubmit}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <span>{currentIdx + 1 === activeQuestions.length ? "Submit All 20 Questions & View Diagnosis" : "Next Question"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Completed Results Screen */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              20-Question Diagnostic Assessment Complete
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Evaluation completed for <strong>{currentSubject.name}</strong>. Student responses have been verified against rubric invariants and textbook evidence.
            </p>

            <div className="mt-6 flex items-center justify-center gap-6">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 min-w-[120px]">
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Score</div>
                <div className="text-2xl font-bold text-blue-600">
                  {submittedAnswers.length > 0
                    ? Math.round(
                        (submittedAnswers.reduce((a, b) => a + b.score, 0) / submittedAnswers.length) * 100
                      )
                    : 0}%
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 min-w-[120px]">
                <div className="text-[10px] uppercase font-bold text-slate-400">Correct Answers</div>
                <div className="text-2xl font-bold text-emerald-600">
                  {submittedAnswers.filter((a) => a.is_correct).length} / {submittedAnswers.length}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 min-w-[120px]">
                <div className="text-[10px] uppercase font-bold text-slate-400">Subject Assessed</div>
                <div className="text-xs font-bold text-slate-800 mt-1">
                  {currentSubject.code || "CS"}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                href="/diagnosis"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 shadow-xs"
              >
                <span>View Root-Cause Diagnosis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={handleRetake}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Assessment</span>
              </button>
            </div>
          </div>

          {/* Full 20 Question Breakdown with Grounding Citations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                20-Item Diagnostic Breakdown & Source Grounding
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {currentSubject.name}
              </span>
            </div>

            <div className="space-y-4">
              {submittedAnswers.map((ans, idx) => {
                const q = activeQuestions.find((item) => item.id === ans.question_id);
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
                        <span>Item #{idx + 1}: {q?.question_text}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase shrink-0 bg-white border border-slate-200">
                        Score: {Math.round(ans.score * 100)}%
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 pl-6">
                      <strong>Student Response:</strong> &quot;{ans.student_response}&quot; (Confidence: {ans.confidence_rating})
                    </div>

                    <div className="text-[11px] text-slate-700 pl-6">
                      <strong>Diagnostic Feedback:</strong> {ans.evaluation_details?.feedback || q?.explanation}
                    </div>

                    {q?.citations && q.citations[0] && (
                      <div className="text-[10px] text-blue-700 pl-6 font-medium flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-blue-600" />
                        <span>Source Grounding: {q.citations[0].source_title} (Page {q.citations[0].page_number || "N/A"})</span>
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
