// Complete Type Definitions for SkillBlind AI

export type UserRole = "student" | "teacher" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  target_score?: number;
  available_hours_per_day?: number;
  exam_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  user_id: string;
  name: string;
  code?: string;
  description?: string;
  color?: string;
  created_at: string;
}

export type DocumentType = "syllabus" | "textbook" | "lecture_notes" | "exam_paper" | "other";
export type ProcessingStatus = "uploaded" | "processing" | "processed" | "failed";

export interface StudyMaterial {
  id: string;
  user_id: string;
  subject_id: string;
  title: string;
  document_type: DocumentType;
  file_name: string;
  file_size: number;
  file_url?: string;
  status: ProcessingStatus;
  total_pages?: number;
  chunk_count?: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentChunk {
  id: string;
  study_material_id: string;
  user_id: string;
  content: string;
  chunk_index: number;
  page_number?: number;
  section_heading?: string;
  embedding?: number[];
  token_count?: number;
  created_at: string;
}

export interface Topic {
  id: string;
  subject_id: string;
  parent_id?: string | null;
  name: string;
  description?: string;
  difficulty_level: "beginner" | "intermediate" | "advanced";
  order_index: number;
  created_at: string;
  children?: Topic[];
}

export interface ConceptDependency {
  id: string;
  subject_id: string;
  prerequisite_topic_id: string;
  dependent_topic_id: string;
  relationship_type: "strict_prerequisite" | "helpful_foundation" | "co_requisite";
  confidence: number; // 0 to 1
  source_evidence: string;
  user_verified: boolean;
  created_at: string;
  // Join properties
  prerequisite?: Topic;
  dependent?: Topic;
}

export type QuestionType = "multiple_choice" | "true_false" | "short_answer" | "scenario_based";
export type QuestionDifficulty = "easy" | "medium" | "hard";
export type ConfidenceRating = "guessing" | "somewhat" | "confident";

export interface QuizQuestion {
  id: string;
  quiz_id?: string;
  topic_id: string;
  question_type: QuestionType;
  difficulty: QuestionDifficulty;
  question_text: string;
  options?: string[]; // for multiple choice
  correct_answer: string;
  explanation: string;
  scoring_rubric?: {
    required_keywords: string[];
    partial_credit_threshold: number;
    sample_flawed_thinking?: string;
  };
  source_chunk_ids: string[];
  citations: {
    source_title: string;
    page_number?: number;
    excerpt: string;
  }[];
  topic?: Topic;
}

export interface Quiz {
  id: string;
  subject_id: string;
  user_id: string;
  title: string;
  description?: string;
  topic_ids: string[];
  questions_count: number;
  is_transfer_assessment?: boolean;
  created_at: string;
  questions?: QuizQuestion[];
}

export interface StudentAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  student_response: string;
  confidence_rating?: ConfidenceRating;
  is_correct: boolean;
  score: number; // 0.0 to 1.0
  evaluation_details?: AnswerEvaluation;
  time_spent_seconds?: number;
  created_at: string;
}

export interface AnswerEvaluation {
  score: number;
  status: "correct" | "partially_correct" | "incorrect";
  feedback: string;
  missing_concepts: string[];
  misconception_indicators: string[];
  grounding_citation?: string;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  completed_at: string;
  answers?: StudentAnswer[];
  quiz?: Quiz;
}

export interface MisconceptionPattern {
  id: string;
  user_id: string;
  topic_id: string;
  pattern_name: string;
  description: string;
  frequency: number;
  high_confidence_errors: number;
  sample_student_responses: string[];
  identified_at: string;
  resolved: boolean;
  topic?: Topic;
}

export interface RootCauseDiagnosis {
  id: string;
  user_id: string;
  subject_id: string;
  observed_topic_id: string;
  root_cause_topic_id: string;
  observed_issue: string; // e.g., "Repeatedly answers tree traversal recursion questions incorrectly"
  hypothesized_cause: string; // e.g., "Missing base case recursion tracing fundamentals"
  confidence_level: number; // 0.0 to 1.0
  evidence_citations: {
    quiz_attempt_id?: string;
    question_text: string;
    student_response: string;
    flaw_identified: string;
  }[];
  status: "hypothesis" | "confirmed" | "resolved";
  recommended_intervention: string;
  created_at: string;
  observed_topic?: Topic;
  root_cause_topic?: Topic;
}

export interface TopicMastery {
  id: string;
  user_id: string;
  topic_id: string;
  mastery_score: number; // 0.0 to 1.0
  status: "weak" | "developing" | "strong" | "insufficient_evidence";
  questions_attempted: number;
  questions_correct: number;
  last_assessed_at?: string;
  topic?: Topic;
}

export type RiskLevel = "high" | "moderate" | "low" | "insufficient";

export interface LearningRiskPrediction {
  id: string;
  user_id: string;
  topic_id: string;
  risk_score: number; // 0.0 to 1.0 (estimated learning-risk score)
  risk_level: RiskLevel;
  contributing_factors: {
    factor: string;
    weight: number;
    impact: "increases_risk" | "decreases_risk" | "neutral";
    description: string;
  }[];
  supporting_history: string;
  recommended_preventive_action: string;
  calculated_at: string;
  topic?: Topic;
}

export interface LearningIntervention {
  id: string;
  user_id: string;
  diagnosis_id?: string;
  topic_id: string;
  title: string;
  intervention_type: "review_foundational" | "worked_example" | "tracing_exercise" | "practice_quiz" | "reading";
  rationale: string;
  estimated_duration_minutes: number;
  source_excerpt?: string;
  status: "pending" | "in_progress" | "completed";
  completed_at?: string;
  topic?: Topic;
}

export interface RevisionTask {
  id: string;
  plan_id: string;
  intervention_id?: string;
  topic_id: string;
  title: string;
  description: string;
  scheduled_date: string;
  estimated_minutes: number;
  completed: boolean;
  verification_status: "pending" | "verified_passed" | "needs_further_review";
  topic?: Topic;
}

export interface RevisionPlan {
  id: string;
  user_id: string;
  subject_id: string;
  title: string;
  target_exam_date?: string;
  daily_study_hours: number;
  tasks: RevisionTask[];
  created_at: string;
}

export interface TransferAssessment {
  id: string;
  user_id: string;
  intervention_id: string;
  original_topic_id: string;
  baseline_score: number;
  verification_score: number;
  status: "mastery_verified" | "needs_more_practice";
  new_context_scenario: string;
  question_id: string;
  evaluated_at: string;
  improvement_delta: number;
  original_topic?: Topic;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  sender: "user" | "assistant";
  content: string;
  citations?: {
    source_title: string;
    page_number?: number;
    section?: string;
    excerpt: string;
  }[];
  is_grounded: boolean;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  subject_id: string;
  title: string;
  created_at: string;
  messages?: ChatMessage[];
}
