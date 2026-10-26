"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { getInitialState, saveState, SkillBlindState } from "@/lib/storage";
import { StudyMaterial, DocumentChunk, Topic } from "@/types";
import { chunkText } from "@/lib/services/document-service";

export default function MaterialsPage() {
  const [state, setState] = useState<SkillBlindState | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<StudyMaterial | null>(null);
  const [docChunks, setDocChunks] = useState<DocumentChunk[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadType, setUploadType] = useState<StudyMaterial["document_type"]>("lecture_notes");
  const [uploadText, setUploadText] = useState("");

  useEffect(() => {
    const s = getInitialState();
    setState(s);
    if (s.materials.length > 0) {
      setSelectedDoc(s.materials[1] || s.materials[0]);
      setDocChunks(s.chunks.filter((c) => c.study_material_id === (s.materials[1]?.id || s.materials[0]?.id)));
    }
  }, []);

  const handleSelectDoc = (doc: StudyMaterial) => {
    setSelectedDoc(doc);
    if (state) {
      const chunks = state.chunks.filter((c) => c.study_material_id === doc.id);
      setDocChunks(chunks);
    }
  };

  const handleManualUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadText.trim() || !state) return;

    setIsUploading(true);

    setTimeout(() => {
      const newMaterialId = `mat-${Date.now().toString().slice(-4)}`;
      const newMaterial: StudyMaterial = {
        id: newMaterialId,
        user_id: state.user?.id || "demo-user-101",
        subject_id: state.subject.id,
        title: uploadTitle,
        document_type: uploadType,
        file_name: `${uploadTitle.replace(/\s+/g, "_")}.txt`,
        file_size: uploadText.length,
        status: "processed",
        total_pages: Math.ceil(uploadText.length / 800),
        chunk_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Chunk the text
      const newChunks = chunkText(uploadText, newMaterialId, state.user?.id || "demo-user-101");
      newMaterial.chunk_count = newChunks.length;

      // Also create a topic if new
      const newTopic: Topic = {
        id: `top-${Date.now().toString().slice(-4)}`,
        subject_id: state.subject.id,
        name: uploadTitle,
        description: `Extracted from ${uploadTitle}`,
        difficulty_level: "intermediate",
        order_index: state.topics.length + 1,
        created_at: new Date().toISOString(),
      };

      const updatedState: SkillBlindState = {
        ...state,
        materials: [newMaterial, ...state.materials],
        chunks: [...newChunks, ...state.chunks],
        topics: [...state.topics, newTopic],
      };

      saveState(updatedState);
      setState(updatedState);
      setSelectedDoc(newMaterial);
      setDocChunks(newChunks);
      setIsUploading(false);
      setUploadTitle("");
      setUploadText("");
      alert("Document successfully ingested, chunked, and vector-indexed!");
    }, 600);
  };

  if (!state) return null;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Study Material Ingestion Studio</h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload syllabi, notes, textbooks, and exam papers. SkillBlind AI parses text, generates chunks, and builds the evidence store.
          </p>
        </div>
      </div>

      {/* Main Grid: Upload Form & Document List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Ingestion Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Upload className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Ingest New Learning Material</h2>
          </div>

          <form onSubmit={handleManualUpload} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title</label>
              <input
                type="text"
                placeholder="e.g. Unit 6: Dynamic Programming Notes.pdf"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Document Category</label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                Content / Notes (Text or Extracted PDF)
              </label>
              <textarea
                rows={5}
                placeholder="Paste course notes, chapter excerpts, or textbook paragraphs here..."
                value={uploadText}
                onChange={(e) => setUploadText(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 space-y-1">
              <div>✓ Automatic sentence splitting & 600-char sliding window</div>
              <div>✓ Heading & page number extraction</div>
              <div>✓ 768-dim vector embedding generation (pgvector)</div>
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              {isUploading ? (
                <span>Extracting & Chunking...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Process & Index Material</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing Materials List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">Indexed Course Materials ({state.materials.length})</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">CS201 Collection</span>
          </div>

          <div className="mt-4 space-y-2.5 flex-1 overflow-y-auto max-h-[480px]">
            {state.materials.map((mat) => {
              const isSelected = selectedDoc?.id === mat.id;
              return (
                <div
                  key={mat.id}
                  onClick={() => handleSelectDoc(mat)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-indigo-50/70 border-indigo-300 shadow-xs"
                      : "bg-white hover:bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <FileText className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? "text-indigo-600" : "text-slate-400"}`} />
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
            })}
          </div>
        </div>

        {/* Document Chunks Inspector */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">RAG Chunk Explorer</h2>
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
                  <div className="flex items-center justify-between text-[10px] font-bold text-indigo-700 mb-1.5 pb-1 border-b border-slate-200/60">
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
                No chunks found for this material.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
