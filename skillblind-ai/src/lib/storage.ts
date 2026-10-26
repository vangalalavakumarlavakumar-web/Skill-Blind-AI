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
  DEMO_ATTEMPT,
  DEMO_TOPIC_MASTERY,
  DEMO_MISCONCEPTIONS,
  DEMO_ROOT_CAUSE,
  DEMO_PREDICTIONS,
  DEMO_INTERVENTIONS,
  DEMO_REVISION_PLAN,
  DEMO_TRANSFER_ASSESSMENT,
} from "./demo-data";
import {
  ALL_SUBJECTS,
  DSA_QUESTIONS,
  DBMS_QUESTIONS,
  OS_QUESTIONS,
  CN_QUESTIONS,
  DSA_TOPICS,
  DBMS_TOPICS,
  OS_TOPICS,
  CN_TOPICS,
  ALL_DEPENDENCIES,
} from "./subject-question-banks";

export interface SkillBlindState {
  user: Profile | null;
  subject: Subject;
  subjects: Subject[];
  activeSubjectId: string;
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

const STORAGE_KEY = "skillblind_state_v2";

export function createInitialQuizzes(): Quiz[] {
  return [
    {
      id: "quiz-dsa-20",
      subject_id: "subj-dsa-101",
      user_id: "demo-user-101",
      title: "Comprehensive Diagnostic Assessment: Data Structures & Algorithms",
      description: "20 in-depth diagnostic items evaluating recursion stack frames, trees, search, sorting, graphs, and dynamic programming.",
      topic_ids: DSA_TOPICS.map((t) => t.id),
      questions_count: DSA_QUESTIONS.length,
      is_transfer_assessment: false,
      created_at: "2026-10-24T10:00:00Z",
      questions: DSA_QUESTIONS,
    },
    {
      id: "quiz-dbms-20",
      subject_id: "subj-dbms-102",
      user_id: "demo-user-101",
      title: "Comprehensive Diagnostic Assessment: Database Management Systems",
      description: "20 diagnostic items covering ACID properties, 1NF-BCNF normalization, B+ Tree indexing, and query optimization.",
      topic_ids: DBMS_TOPICS.map((t) => t.id),
      questions_count: DBMS_QUESTIONS.length,
      is_transfer_assessment: false,
      created_at: "2026-10-24T10:00:00Z",
      questions: DBMS_QUESTIONS,
    },
    {
      id: "quiz-os-20",
      subject_id: "subj-os-103",
      user_id: "demo-user-101",
      title: "Comprehensive Diagnostic Assessment: Operating Systems",
      description: "20 diagnostic questions analyzing process scheduling, critical section synchronization, page faults, and deadlocks.",
      topic_ids: OS_TOPICS.map((t) => t.id),
      questions_count: OS_QUESTIONS.length,
      is_transfer_assessment: false,
      created_at: "2026-10-24T10:00:00Z",
      questions: OS_QUESTIONS,
    },
    {
      id: "quiz-cn-20",
      subject_id: "subj-cn-104",
      user_id: "demo-user-101",
      title: "Comprehensive Diagnostic Assessment: Computer Networks",
      description: "20 diagnostic items testing TCP/IP 3-way handshakes, CIDR subnetting, congestion control, and routing protocols.",
      topic_ids: CN_TOPICS.map((t) => t.id),
      questions_count: CN_QUESTIONS.length,
      is_transfer_assessment: false,
      created_at: "2026-10-24T10:00:00Z",
      questions: CN_QUESTIONS,
    },
  ];
}

export function getInitialState(): SkillBlindState {
  const initialQuizzes = createInitialQuizzes();

  if (typeof window === "undefined") {
    return {
      user: DEMO_USER,
      subject: ALL_SUBJECTS[0],
      subjects: ALL_SUBJECTS,
      activeSubjectId: ALL_SUBJECTS[0].id,
      materials: DEMO_MATERIALS,
      chunks: DEMO_CHUNKS,
      topics: [...DSA_TOPICS, ...DBMS_TOPICS, ...OS_TOPICS, ...CN_TOPICS],
      dependencies: DEMO_DEPENDENCIES,
      quizzes: initialQuizzes,
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
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure subjects and 20 questions and dependencies are always populated
      if (
        !parsed.subjects ||
        parsed.subjects.length < 4 ||
        (parsed.quizzes[0]?.questions?.length || 0) < 10 ||
        (parsed.dependencies?.length || 0) < 10
      ) {
        parsed.subjects = ALL_SUBJECTS;
        parsed.quizzes = initialQuizzes;
        parsed.topics = [...DSA_TOPICS, ...DBMS_TOPICS, ...OS_TOPICS, ...CN_TOPICS];
        parsed.dependencies = ALL_DEPENDENCIES;
        if (!parsed.activeSubjectId) parsed.activeSubjectId = ALL_SUBJECTS[0].id;
        if (!parsed.subject) parsed.subject = ALL_SUBJECTS[0];
        saveState(parsed);
      }
      return parsed;
    }
  } catch (e) {
    console.error("Failed to load local state, using demo default", e);
  }

  const initial: SkillBlindState = {
    user: DEMO_USER,
    subject: ALL_SUBJECTS[0],
    subjects: ALL_SUBJECTS,
    activeSubjectId: ALL_SUBJECTS[0].id,
    materials: DEMO_MATERIALS,
    chunks: DEMO_CHUNKS,
    topics: [...DSA_TOPICS, ...DBMS_TOPICS, ...OS_TOPICS, ...CN_TOPICS],
    dependencies: ALL_DEPENDENCIES,
    quizzes: initialQuizzes,
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

export function switchActiveSubject(subjectId: string): SkillBlindState {
  const current = getInitialState();
  const found = current.subjects.find((s) => s.id === subjectId) || current.subjects[0];
  const updated: SkillBlindState = {
    ...current,
    subject: found,
    activeSubjectId: found.id,
  };
  saveState(updated);
  return updated;
}

export function resetToDemoState(): SkillBlindState {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("skillblind_state_v1");
  }
  return getInitialState();
}
