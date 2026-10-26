import {
  Profile,
  Subject,
  StudyMaterial,
  DocumentChunk,
  Topic,
  ConceptDependency,
  Quiz,
  QuizAttempt,
  StudentAnswer,
  MisconceptionPattern,
  RootCauseDiagnosis,
  TopicMastery,
  LearningRiskPrediction,
  LearningIntervention,
  RevisionPlan,
  TransferAssessment,
  ChatMessage,
  ChatSession,
} from "@/types";
import {
  DEMO_USER,
  DEMO_SUBJECT,
  DEMO_MATERIALS,
  DEMO_CHUNKS,
  DEMO_TOPICS,
  DEMO_DEPENDENCIES,
  DEMO_QUIZ,
  DEMO_ATTEMPT,
  DEMO_TOPIC_MASTERY,
  DEMO_MISCONCEPTIONS,
  DEMO_ROOT_CAUSE,
  DEMO_PREDICTIONS,
  DEMO_INTERVENTIONS,
  DEMO_REVISION_PLAN,
  DEMO_TRANSFER_ASSESSMENT,
} from "./demo-data";

export interface SkillBlindState {
  user: Profile | null;
  subject: Subject;
  materials: StudyMaterial[];
  chunks: DocumentChunk[];
  topics: Topic[];
  dependencies: ConceptDependency[];
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  mastery: TopicMastery[];
  misconceptions: MisconceptionPattern[];
  rootCauses: RootCauseDiagnosis[];
  predictions: LearningRiskPrediction[];
  interventions: LearningIntervention[];
  revisionPlan: RevisionPlan;
  transferAssessments: TransferAssessment[];
  chatSessions: ChatSession[];
}

const STORAGE_KEY = "skillblind_state_v1";

export function getInitialState(): SkillBlindState {
  if (typeof window === "undefined") {
    return {
      user: DEMO_USER,
      subject: DEMO_SUBJECT,
      materials: DEMO_MATERIALS,
      chunks: DEMO_CHUNKS,
      topics: DEMO_TOPICS,
      dependencies: DEMO_DEPENDENCIES,
      quizzes: [DEMO_QUIZ],
      attempts: [DEMO_ATTEMPT],
      mastery: DEMO_TOPIC_MASTERY,
      misconceptions: DEMO_MISCONCEPTIONS,
      rootCauses: [DEMO_ROOT_CAUSE],
      predictions: DEMO_PREDICTIONS,
      interventions: DEMO_INTERVENTIONS,
      revisionPlan: DEMO_REVISION_PLAN,
      transferAssessments: [DEMO_TRANSFER_ASSESSMENT],
      chatSessions: [
        {
          id: "cs-01",
          user_id: DEMO_USER.id,
          subject_id: DEMO_SUBJECT.id,
          title: "Recursion Stack Clarification",
          created_at: "2026-10-24T12:00:00Z",
          messages: [
            {
              id: "msg-01",
              session_id: "cs-01",
              sender: "user",
              content: "Why does tree traversal crash when node == null is missing?",
              is_grounded: true,
              created_at: "2026-10-24T12:01:00Z",
            },
            {
              id: "msg-02",
              session_id: "cs-01",
              sender: "assistant",
              content:
                "According to your uploaded material (Chapter 5: Page 12), tree traversal is inherently recursive. When you reach a leaf node, its left and right child pointers are null. If you don't check `node == null`, the traversal method will attempt to dereference a null pointer or execute another recursive call indefinitely, resulting in a runtime CallStackExceeded exception or segmentation fault.",
              citations: [
                {
                  source_title: "Chapter 5: Binary Trees & Tree Traversals.pdf",
                  page_number: 12,
                  section: "5.2 Depth-First Tree Traversals",
                  excerpt: "If the base condition (node == null) is evaluated incorrectly, traversal visits invalid memory or overflows the stack.",
                },
              ],
              is_grounded: true,
              created_at: "2026-10-24T12:01:05Z",
            },
          ],
        },
      ],
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to load local state, using demo default", e);
  }

  const initial = {
    user: DEMO_USER,
    subject: DEMO_SUBJECT,
    materials: DEMO_MATERIALS,
    chunks: DEMO_CHUNKS,
    topics: DEMO_TOPICS,
    dependencies: DEMO_DEPENDENCIES,
    quizzes: [DEMO_QUIZ],
    attempts: [DEMO_ATTEMPT],
    mastery: DEMO_TOPIC_MASTERY,
    misconceptions: DEMO_MISCONCEPTIONS,
    rootCauses: [DEMO_ROOT_CAUSE],
    predictions: DEMO_PREDICTIONS,
    interventions: DEMO_INTERVENTIONS,
    revisionPlan: DEMO_REVISION_PLAN,
    transferAssessments: [DEMO_TRANSFER_ASSESSMENT],
    chatSessions: [],
  };

  saveState(initial);
  return initial;
}

export function saveState(state: SkillBlindState): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
  }
}

export function resetToDemoState(): SkillBlindState {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
  return getInitialState();
}
