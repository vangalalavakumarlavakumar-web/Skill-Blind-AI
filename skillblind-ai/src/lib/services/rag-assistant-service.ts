import { DocumentChunk, ChatMessage } from "@/types";
import { generateCompletion } from "../ai/gemini";

export interface RAGSearchOptions {
  topK?: number;
  minSimilarity?: number;
}

export function searchChunks(
  query: string,
  chunks: DocumentChunk[],
  options: RAGSearchOptions = {}
): { chunk: DocumentChunk; score: number }[] {
  const topK = options.topK || 4;
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const scored: { chunk: DocumentChunk; score: number }[] = [];

  chunks.forEach((chunk) => {
    const text = (chunk.content + " " + (chunk.section_heading || "")).toLowerCase();
    let score = 0;

    terms.forEach((term) => {
      if (text.includes(term)) {
        score += 1;
        // higher weight if in heading
        if (chunk.section_heading?.toLowerCase().includes(term)) {
          score += 2;
        }
      }
    });

    if (score > 0) {
      scored.push({ chunk, score });
    }
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

export async function askGroundedAssistant(
  question: string,
  chunks: DocumentChunk[],
  sourceDocumentName: string = "Course Materials"
): Promise<{ answer: string; citations: ChatMessage["citations"]; isGrounded: boolean }> {
  const matches = searchChunks(question, chunks, { topK: 3 });

  // If no matching evidence in uploaded materials
  if (matches.length === 0 || matches[0].score < 1) {
    return {
      answer: "I couldn't find enough evidence in your uploaded materials to answer this accurately.",
      citations: [],
      isGrounded: false,
    };
  }

  const citations = matches.map((m) => ({
    source_title: sourceDocumentName,
    page_number: m.chunk.page_number,
    section: m.chunk.section_heading,
    excerpt: m.chunk.content.slice(0, 180) + "...",
  }));

  const contextText = matches
    .map(
      (m, i) =>
        `[Passage ${i + 1} - Page ${m.chunk.page_number || "N/A"} - ${m.chunk.section_heading || "Section"}]:\n${m.chunk.content}`
    )
    .join("\n\n");

  const prompt = `You are the SkillBlind AI Evidence-Grounded Tutor.
Answer the student's question ONLY using the following retrieved passages from their uploaded study material.
Do NOT fabricate any facts, page numbers, or assumptions outside this text.
If the answer cannot be determined from these passages, respond exactly with:
"I couldn't find enough evidence in your uploaded materials to answer this accurately."

Retrieved Passages:
${contextText}

Student Question:
${question}

Answer:`;

  const rawAnswer = await generateCompletion(
    prompt,
    "Strict source-grounded academic tutor. Cite facts only if present in context."
  );

  return {
    answer: rawAnswer.trim(),
    citations,
    isGrounded: true,
  };
}
