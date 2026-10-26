"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  BookOpen,
  FileCheck,
  AlertCircle,
  Eye,
  Trash2,
  HelpCircle,
  Plus,
} from "lucide-react";
import { getInitialState, saveState, SkillBlindState, switchActiveSubject } from "@/lib/storage";
import { StudyMaterial, DocumentChunk, Topic, Subject, Quiz } from "@/types";
import { chunkText } from "@/lib/services/document-service";
import { generateQuestionsFromDocument } from "@/lib/services/question-generator-service";

export default function MaterialsPage() {
  const [state, setState] = useState<SkillBlindState | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("subj-dsa-101");
  const [selectedDoc, setSelectedDoc] = useState<StudyMaterial | null>(null);
  const [docChunks, setDocChunks] = useState<DocumentChunk[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadType, setUploadType] = useState<StudyMaterial["document_type"]>("lecture_notes");
  const [uploadText, setUploadText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const s = getInitialState();
    setState(s);
    const subId = s.activeSubjectId || s.subject.id;
    setSelectedSubjectId(subId);

    const subjectMaterials = s.materials.filter((m) => m.subject_id === subId);
    if (subjectMaterials.length > 0) {
      setSelectedDoc(subjectMaterials[0]);
      setDocChunks(s.chunks.filter((c) => c.study_material_id === subjectMaterials[0].id));
    } else if (s.materials.length > 0) {
      setSelectedDoc(s.materials[0]);
      setDocChunks(s.chunks.filter((c) => c.study_material_id === s.materials[0].id));
    }
  }, []);

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    if (!state) return;

    const updated = switchActiveSubject(subjectId);
    setState(updated);

    const subjectMaterials = updated.materials.filter((m) => m.subject_id === subjectId);
    if (subjectMaterials.length > 0) {
      setSelectedDoc(subjectMaterials[0]);
      setDocChunks(updated.chunks.filter((c) => c.study_material_id === subjectMaterials[0].id));
    } else {
      setSelectedDoc(null);
      setDocChunks([]);
    }
  };

  const handleSelectDoc = (doc: StudyMaterial) => {
    setSelectedDoc(doc);
    if (state) {
      const chunks = state.chunks.filter((c) => c.study_material_id === doc.id);
      setDocChunks(chunks);
    }
  };

  // Direct File Picker Handler (PDF / Text)
  const handleFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !state) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("subjectId", selectedSubjectId);

      const res = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to parse PDF file");
      }

      const data = await res.json();
      const extractedText = data.extractedText || "";

      const newMaterialId = `mat-${Date.now().toString().slice(-4)}`;
      const newChunks = chunkText(extractedText, newMaterialId, state.user?.id || "demo-user-101");

      const newMaterial: StudyMaterial = {
        id: newMaterialId,
        user_id: state.user?.id || "demo-user-101",
        subject_id: selectedSubjectId,
        title: file.name,
        document_type: uploadType,
        file_name: file.name,
        file_size: file.size,
        status: "processed",
        total_pages: data.totalPages || 1,
        chunk_count: newChunks.length,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Also generate 20 comprehensive diagnostic questions from this material!
      const generatedQuestions = generateQuestionsFromDocument(
        file.name,
        newChunks,
        selectedSubjectId,
        20
      );

      const newQuiz: Quiz = {
        id: `quiz-${Date.now().toString().slice(-4)}`,
        subject_id: selectedSubjectId,
        user_id: state.user?.id || "demo-user-101",
        title: `Diagnostic Assessment: ${file.name}`,
        description: `20 source-grounded diagnostic questions synthesized from ${file.name}`,
        topic_ids: generatedQuestions.map((q) => q.topic_id),
        questions_count: 20,
        created_at: new Date().toISOString(),
        questions: generatedQuestions,
      };

      const updatedState: SkillBlindState = {
        ...state,
        materials: [newMaterial, ...state.materials],
        chunks: [...newChunks, ...state.chunks],
        quizzes: [newQuiz, ...state.quizzes],
      };

      saveState(updatedState);
      setState(updatedState);
      setSelectedDoc(newMaterial);
      setDocChunks(newChunks);
      alert(`PDF "${file.name}" ingested successfully! 20 diagnostic questions generated and ready in the Diagnostic Assessment module.`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to process PDF");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Manual Text Ingestion
  const handleManualUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadText.trim() || !state) return;

    setIsUploading(true);

    setTimeout(() => {
      const newMaterialId = `mat-${Date.now().toString().slice(-4)}`;
      const newChunks = chunkText(uploadText, newMaterialId, state.user?.id || "demo-user-101");

      const newMaterial: StudyMaterial = {
        id: newMaterialId,
        user_id: state.user?.id || "demo-user-101",
        subject_id: selectedSubjectId,
        title: uploadTitle,
        document_type: uploadType,
        file_name: `${uploadTitle.replace(/\s+/g, "_")}.txt`,
        file_size: uploadText.length,
        status: "processed",
        total_pages: Math.ceil(uploadText.length / 800),
        chunk_count: newChunks.length,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const generatedQuestions = generateQuestionsFromDocument(
        uploadTitle,
        newChunks,
        selectedSubjectId,
        20
      );

      const newQuiz: Quiz = {
        id: `quiz-${Date.now().toString().slice(-4)}`,
        subject_id: selectedSubjectId,
        user_id: state.user?.id || "demo-user-101",
        title: `Diagnostic Assessment: ${uploadTitle}`,
        description: `20 questions synthesized from ${uploadTitle}`,
        topic_ids: generatedQuestions.map((q) => q.topic_id),
        questions_count: 20,
        created_at: new Date().toISOString(),
        questions: generatedQuestions,
      };

      const updatedState: SkillBlindState = {
        ...state,
        materials: [newMaterial, ...state.materials],
        chunks: [...newChunks, ...state.chunks],
        quizzes: [newQuiz, ...state.quizzes],
      };

      saveState(updatedState);
      setState(updatedState);
      setSelectedDoc(newMaterial);
      setDocChunks(newChunks);
      setIsUploading(false);
      setUploadTitle("");
      setUploadText("");
      alert("Material ingested! 20 diagnostic questions generated.");
    }, 600);
  };

  if (!state) return null;

  const filteredMaterials = state.materials.filter((m) => m.subject_id === selectedSubjectId);
  const currentSubject = state.subjects.find((s) => s.id === selectedSubjectId) || state.subject;

  return (
    <div className="space-y-6">
      {/* Page Header with Subject Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            Document Repository & Evidence Store
          </span>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5">
            Course Material Ingestion & 20-Question Synthesis
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload syllabi, notes, textbooks, and past exam papers. The platform parses text, chunks sections, and synthesizes 20-question diagnostic assessments.
          </p>
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-semibold text-slate-700">Subject:</span>
            <select
              value={selectedSubjectId}
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

          <Link
            href="/quiz"
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Launch Quiz (20 Qs)</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Upload Options & Document List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Panel (PDF + Text) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Upload className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Upload PDF for {currentSubject.code || currentSubject.name}
            </h2>
          </div>

          {/* Direct PDF File Picker Button */}
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-blue-400 transition-colors bg-slate-50/50">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md"
              onChange={handleFilePicked}
              disabled={isUploading}
              className="hidden"
              id="material-pdf-upload-input"
            />
            <label
              htmlFor="material-pdf-upload-input"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-800">
                {isUploading ? "Extracting & Synthesizing 20 Questions..." : "Select Course PDF File"}
              </div>
              <div className="text-[10px] text-slate-500">
                Automatically extracts text, creates chunks, and generates 20 questions
              </div>
            </label>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[10px] font-semibold text-slate-400 uppercase">Or Paste Text</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Manual Text Ingestion Form */}
          <form onSubmit={handleManualUpload} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title</label>
              <input
                type="text"
                placeholder="e.g. Unit 3: CPU Scheduling Notes.pdf"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Document Category</label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="syllabus">Official Syllabus</option>
                <option value="textbook">Textbook Chapter</option>
                <option value="lecture_notes">Lecture Notes</option>
                <option value="exam_paper">Previous Exam Paper</option>
                <option value="other">Supporting Material</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Content Excerpt or Extracted Text
              </label>
              <textarea
                rows={4}
                placeholder="Paste course notes, lecture slides, or chapter text here..."
                value={uploadText}
                onChange={(e) => setUploadText(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-[11px]"
              />
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              {isUploading ? (
                <span>Extracting & Synthesizing...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Process Material & Generate 20 Qs</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing Materials List for Selected Subject */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Indexed Documents ({filteredMaterials.length})
              </h2>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              {currentSubject.code || "Subject"}
            </span>
          </div>

          <div className="mt-4 space-y-2.5 flex-1 overflow-y-auto max-h-[480px]">
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((mat) => {
                const isSelected = selectedDoc?.id === mat.id;
                return (
                  <div
                    key={mat.id}
                    onClick={() => handleSelectDoc(mat)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50/70 border-blue-400 shadow-xs"
                        : "bg-white hover:bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <FileText className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                        <div>
                          <div className="text-xs font-bold text-slate-900 leading-tight">{mat.title}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 capitalize flex items-center gap-1.5">
                            <span>{mat.document_type.replace("_", " ")}</span>
                            <span>•</span>
                            <span>{mat.total_pages || 1} pages</span>
                            <span>•</span>
                            <span>{mat.chunk_count || 0} chunks</span>
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 shrink-0">
                        Indexed
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                No materials uploaded yet for {currentSubject.name}. Upload a PDF above!
              </div>
            )}
          </div>
        </div>

        {/* Document Chunks Inspector */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">RAG Chunks & Evidence</h2>
              <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                {selectedDoc?.title || "Select a document"}
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
              {docChunks.length} Chunks
            </span>
          </div>

          <div className="mt-4 space-y-3 flex-1 overflow-y-auto max-h-[480px]">
            {docChunks.length > 0 ? (
              docChunks.map((chunk) => (
                <div key={chunk.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-bold text-blue-700 mb-1.5 pb-1 border-b border-slate-200/60">
                    <span>Page {chunk.page_number || "N/A"} • Chunk #{chunk.chunk_index}</span>
                    <span className="text-slate-400 font-mono font-normal">{chunk.id}</span>
                  </div>
                  {chunk.section_heading && (
                    <div className="text-[11px] font-bold text-slate-800 mb-1">
                      {chunk.section_heading}
                    </div>
                  )}
                  <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                    {chunk.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center text-xs text-slate-400 py-12">
                No chunks available. Select an indexed document from the middle list.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
