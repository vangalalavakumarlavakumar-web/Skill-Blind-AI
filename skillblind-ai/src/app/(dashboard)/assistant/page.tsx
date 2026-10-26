"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Send,
  BookOpen,
  Brain,
  ShieldCheck,
  HelpCircle,
  FileText,
} from "lucide-react";
import { getInitialState, saveState, SkillBlindState } from "@/lib/storage";
import { askGroundedAssistant } from "@/lib/services/rag-assistant-service";
import { ChatMessage } from "@/types";

export default function AssistantPage() {
  const [state, setState] = useState<SkillBlindState | null>(null);
  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const s = getInitialState();
    setState(s);
    if (s.chatSessions.length > 0 && s.chatSessions[0].messages) {
      setMessages(s.chatSessions[0].messages);
    }
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || !state) return;

    const query = inputQuery.trim();
    setInputQuery("");

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now().toString().slice(-4)}`,
      session_id: "cs-01",
      sender: "user",
      content: query,
      is_grounded: true,
      created_at: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setIsSearching(true);

    try {
      const result = await askGroundedAssistant(query, state.chunks, "CS201 Uploaded Textbook & Notes");

      const botMsg: ChatMessage = {
        id: `msg-bot-${Date.now().toString().slice(-4)}`,
        session_id: "cs-01",
        sender: "assistant",
        content: result.answer,
        citations: result.citations,
        is_grounded: result.isGrounded,
        created_at: new Date().toISOString(),
      };

      const finalMessages = [...nextMessages, botMsg];
      setMessages(finalMessages);

      // Persist in state
      const updatedSession = {
        id: "cs-01",
        user_id: state.user?.id || "demo-user-101",
        subject_id: state.subject.id,
        title: query.slice(0, 30),
        created_at: new Date().toISOString(),
        messages: finalMessages,
      };

      const updatedState = { ...state, chatSessions: [updatedSession] };
      saveState(updatedState);
      setState(updatedState);
    } catch (err) {
      console.error("RAG search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const sampleQuestions = [
    "Why does tree traversal crash when node == null is missing?",
    "What is the difference between Inorder and Preorder traversal?",
    "What happens during call stack unwinding?",
    "How does quantum superposition work in quantum computing?", // Will trigger the honest fallback!
  ];

  if (!state) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-teal-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Strictly Grounded Academic Assistant</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">RAG Concept Explainer</h1>
        <p className="text-xs text-slate-500 mt-1">
          Ask questions about your uploaded materials. Responses are synthesised strictly from your indexed course chunks with verbatim citations.
        </p>
      </div>

      {/* Strict Truthfulness Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900 text-slate-300 text-xs flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Zero-Hallucination Guardrail Active:</strong> If a fact is missing from your uploaded files, the assistant will explicitly respond: <em>&quot;I couldn&apos;t find enough evidence in your uploaded materials to answer this accurately.&quot;</em>
          </span>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 min-h-[420px] max-h-[560px] overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl text-xs space-y-2 leading-relaxed ${
                msg.sender === "user"
                  ? "bg-teal-600 text-white rounded-tr-xs"
                  : "bg-slate-50 border border-slate-200/80 text-slate-900 rounded-tl-xs"
              }`}
            >
              <div className="font-sans whitespace-pre-wrap">{msg.content}</div>

              {/* Citations Footer */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1.5 text-[11px] text-slate-600">
                  <div className="font-bold text-teal-700 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Grounding Citations from Uploaded Materials:</span>
                  </div>
                  {msg.citations.map((cite, i) => (
                    <div key={i} className="p-2 rounded bg-white border border-slate-200 text-[10px]">
                      <span className="font-semibold text-slate-800">{cite.source_title}</span>
                      {cite.page_number && <span className="text-slate-500"> (Page {cite.page_number})</span>}
                      <p className="italic text-slate-600 mt-0.5">&quot;{cite.excerpt}&quot;</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">
              {msg.sender === "user" ? "You" : "GapFinder AI Tutor"}
            </span>
          </div>
        ))}

        {isSearching && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic py-2">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span>Searching vector embeddings and synthesizing grounded response...</span>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      <div>
        <div className="text-[11px] font-semibold text-slate-500 mb-2">Try asking a syllabus-grounded question:</div>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setInputQuery(q)}
              className="text-left text-[11px] px-3 py-1.5 rounded-lg bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-200 text-slate-700 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask a question about your uploaded syllabus, notes, or chapters..."
          className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
        />
        <button
          type="submit"
          disabled={isSearching || !inputQuery.trim()}
          className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask Tutor</span>
        </button>
      </form>
    </div>
  );
}
