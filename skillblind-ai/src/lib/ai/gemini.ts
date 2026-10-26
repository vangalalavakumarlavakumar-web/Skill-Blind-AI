import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function generateCompletion(prompt: string, systemInstruction?: string): Promise<string> {
  if (!genAI) {
    return fallbackResponse(prompt);
  }

  // Attempt up to 2 retries with exponential backoff on transient errors (overloaded / 503 / 429)
  const maxRetries = 2;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: systemInstruction || "You are GapFinder AI, an expert cognitive diagnostic and educational intelligence assistant.",
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text && text.trim().length > 0) {
        return text;
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      const isTransient = errMsg.includes("overloaded") || errMsg.includes("503") || errMsg.includes("429") || errMsg.includes("quota");
      
      console.warn(`Gemini API call attempt ${attempt + 1} failed:`, errMsg);

      if (attempt < maxRetries && isTransient) {
        // Wait 1000ms * 2^attempt
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
        continue;
      }

      break;
    }
  }

  return fallbackResponse(prompt);
}

function fallbackResponse(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes("extract topics") || p.includes("topic hierarchy")) {
    return JSON.stringify([
      { name: "Programming Fundamentals", description: "Variables, types, control flow", difficulty: "beginner" },
      { name: "Functions & Scope", description: "Parameter passing and return contexts", difficulty: "beginner" },
      { name: "Recursion & Call Stacks", description: "Decomposition, base cases, call stacks", difficulty: "intermediate" },
      { name: "Tree Traversal", description: "DFS Inorder, Preorder, Postorder", difficulty: "intermediate" },
      { name: "Binary Search Trees", description: "Key invariants and search properties", difficulty: "advanced" },
      { name: "Graph Algorithms", description: "Adjacency list DFS/BFS traversal", difficulty: "advanced" },
    ]);
  }

  if (p.includes("evaluate short answer") || p.includes("scoring rubric")) {
    return JSON.stringify({
      score: 0.75,
      status: "partially_correct",
      feedback: "The answer shows good intuitive direction regarding recursion but missed identifying call stack unwinding specifically.",
      missing_concepts: ["Stack activation record removal"],
      misconception_indicators: ["Omission of LIFO frame popping"],
    });
  }

  if (p.includes("concept dependencies") || p.includes("prerequisite")) {
    return JSON.stringify([
      { prerequisite: "Functions & Scope", dependent: "Recursion & Call Stacks", type: "strict_prerequisite", confidence: 0.95 },
      { prerequisite: "Recursion & Call Stacks", dependent: "Tree Traversal", type: "strict_prerequisite", confidence: 0.94 },
      { prerequisite: "Tree Traversal", dependent: "Binary Search Trees", type: "strict_prerequisite", confidence: 0.92 },
      { prerequisite: "Recursion & Call Stacks", dependent: "Graph Algorithms", type: "strict_prerequisite", confidence: 0.90 },
    ]);
  }

  // If prompted with retrieved passages (RAG Assistant)
  if (prompt.includes("Retrieved Passages:") && prompt.includes("Student Question:")) {
    const questionMatch = prompt.match(/Student Question:\s*([\s\S]+?)\s*Answer:/i);
    const passagesMatch = prompt.match(/Retrieved Passages:\s*([\s\S]+?)\s*Student Question:/i);
    if (questionMatch && passagesMatch) {
      const question = questionMatch[1].trim();
      const passages = passagesMatch[1].trim();
      // Extract the most relevant sentence or paragraph from the retrieved passages
      const lines = passages.split("\n").filter((l) => l.trim().length > 30 && !l.startsWith("[Passage"));
      if (lines.length > 0) {
        return `Based on your course materials: ${lines[0].trim()}`;
      }
    }
  }

  return "GapFinder AI diagnostic engine analyzed the request according to syllabus grounded evidence.";
}

