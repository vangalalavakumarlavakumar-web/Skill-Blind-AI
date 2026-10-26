import { chunkText } from "../src/lib/services/document-service";
import { evaluateAnswer } from "../src/lib/services/quiz-service";
import { performRootCauseDiagnosis } from "../src/lib/services/root-cause-service";
import { calculateLearningRiskPredictions } from "../src/lib/services/predictive-risk-service";
import { searchChunks } from "../src/lib/services/rag-assistant-service";
import { buildConceptGraph } from "../src/lib/services/concept-graph-service";
import {
  DEMO_TOPICS,
  DEMO_DEPENDENCIES,
  DEMO_TOPIC_MASTERY,
  DEMO_QUESTIONS,
  DEMO_STUDENT_ANSWERS,
  DEMO_CHUNKS,
} from "../src/lib/demo-data";

console.log("=== SkillBlind AI Automated Verification Suite ===");

let passed = 0;
let total = 0;

function assert(condition: boolean, testName: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`[PASS] ${testName}`);
  } else {
    console.error(`[FAIL] ${testName}`);
  }
}

// 1. Text Chunking Test
const sampleText = "Paragraph 1: Recursion requires a base case to terminate execution safely.\n\nParagraph 2: Tree traversal visits nodes recursively in Inorder or Preorder.";
const chunks = chunkText(sampleText, "mat-test", "user-test", { maxChunkSize: 100, overlap: 20 });
assert(chunks.length >= 2, "Document chunking produces valid sliding-window chunks");
assert(chunks[0].content.includes("Recursion"), "Chunk 1 contains expected text content");

// 2. Objective Quiz Evaluation Test
const mcqQuestion = DEMO_QUESTIONS[0];
const correctEval = evaluateAnswer(mcqQuestion, mcqQuestion.correct_answer, "confident");
assert(correctEval.isCorrect === true && correctEval.score === 1.0, "Objective MCQ correct answer yields 100% score");

const wrongEval = evaluateAnswer(mcqQuestion, "It speeds up execution by skipping positive values", "confident");
assert(wrongEval.isCorrect === false && wrongEval.score === 0.0, "Objective MCQ wrong answer yields 0% score");
assert(
  wrongEval.evaluation.misconception_indicators.some((m) => m.includes("High-confidence")),
  "High-confidence incorrect answer flags high-confidence misconception indicator"
);

// 3. Short Answer Rubric Evaluation Test
const shortQ = DEMO_QUESTIONS[1];
const strongAnswer = "The base case triggers and pops the stack frame. Variables in the caller context are restored during unwinding.";
const shortEval = evaluateAnswer(shortQ, strongAnswer, "confident");
assert(shortEval.score >= 0.7 && shortEval.evaluation.status === "correct", "Short answer matching rubric keywords receives passing score");

const flawedAnswer = "Variables get reset to zero and the function restarts from the top.";
const flawedEval = evaluateAnswer(shortQ, flawedAnswer, "confident");
assert(flawedEval.score <= 0.4, "Flawed mental model fails short answer rubric");

// 4. Concept Graph & Bottleneck Detection Test
const graph = buildConceptGraph(DEMO_TOPICS, DEMO_DEPENDENCIES, DEMO_TOPIC_MASTERY);
const recursionNode = graph.nodes.find((n) => n.id === "top-recursion");
assert(recursionNode !== undefined, "Concept graph contains Recursion node");
assert(recursionNode?.isPrerequisiteBottleneck === true, "Recursion correctly identified as Prerequisite Bottleneck");

// 5. Root-Cause Diagnosis Test
const diagnosis = performRootCauseDiagnosis({
  userId: "user-test",
  subjectId: "subj-test",
  answers: DEMO_STUDENT_ANSWERS,
  questions: DEMO_QUESTIONS,
  topics: DEMO_TOPICS,
  dependencies: DEMO_DEPENDENCIES,
  masteryList: DEMO_TOPIC_MASTERY,
});
assert(diagnosis.diagnoses.length > 0, "Root-cause engine identifies at least one diagnosis");
const treeDiagnosis = diagnosis.diagnoses.find((d) => d.observed_topic_id === "top-tree-traversal");
assert(treeDiagnosis !== undefined, "Tree traversal failure diagnosed");
assert(
  treeDiagnosis?.root_cause_topic_id === "top-recursion",
  "Tree traversal error correctly traced back to foundational prerequisite: Recursion & Call Stacks"
);
assert(treeDiagnosis?.evidence_citations.length! > 0, "Diagnosis includes supporting student evidence citations");

// 6. Predictive Learning-Risk Scoring Test
const predictions = calculateLearningRiskPredictions(
  DEMO_TOPICS,
  DEMO_DEPENDENCIES,
  DEMO_TOPIC_MASTERY,
  "user-test"
);
assert(predictions.length > 0, "Predictive risk engine generates downstream predictions");
const graphRisk = predictions.find((p) => p.topic_id === "top-graphs");
assert(graphRisk !== undefined, "Predicts risk for downstream Graph Algorithms");
assert(graphRisk?.risk_level === "high", "Graph Algorithms flagged as High Attention Needed due to recursion deficit");

// 7. RAG Search Relevance & Zero-Evidence Test
const relevantMatches = searchChunks("recursive call stack unwinding", DEMO_CHUNKS);
assert(relevantMatches.length > 0, "RAG search finds relevant chunks for recursive unwinding");
assert(relevantMatches[0].chunk.content.includes("stack"), "Top chunk matches relevant keyword context");

const irrelevantMatches = searchChunks("quantum entanglement superconducting qubit", DEMO_CHUNKS);
assert(irrelevantMatches.length === 0, "Unrelated query returns 0 chunks, triggering honesty guardrail");

console.log(`\nVerification Complete: ${passed}/${total} Tests Passed.`);
if (passed === total) {
  console.log("All SkillBlind AI diagnostic intelligence systems operational!");
} else {
  process.exit(1);
}
