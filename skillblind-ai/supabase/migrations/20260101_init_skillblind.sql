-- SkillBlind AI - Comprehensive Supabase Migration
-- Enables pgvector, creates 24 core relational tables, foreign keys, RLS policies, and performance indexes.

CREATE EXTENSION IF NOT EXISTS vector;

-- 1. profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  target_score INT DEFAULT 85,
  available_hours_per_day NUMERIC DEFAULT 2.0,
  exam_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. subjects
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. study_materials
CREATE TABLE IF NOT EXISTS study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('syllabus', 'textbook', 'lecture_notes', 'exam_paper', 'other')),
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'processed', 'failed')),
  total_pages INT DEFAULT 1,
  chunk_count INT DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. document_chunks (with pgvector embedding)
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_material_id UUID NOT NULL REFERENCES study_materials(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  chunk_index INT NOT NULL,
  page_number INT,
  section_heading TEXT,
  token_count INT,
  embedding vector(768),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. topics
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  difficulty_level TEXT NOT NULL DEFAULT 'intermediate' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  order_index INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. concept_dependencies (Core prerequisite directed graph)
CREATE TABLE IF NOT EXISTS concept_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  prerequisite_topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  dependent_topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL DEFAULT 'strict_prerequisite' CHECK (relationship_type IN ('strict_prerequisite', 'helpful_foundation', 'co_requisite')),
  confidence NUMERIC NOT NULL DEFAULT 0.9 CHECK (confidence >= 0 AND confidence <= 1.0),
  source_evidence TEXT,
  user_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. topic_source_mappings
CREATE TABLE IF NOT EXISTS topic_source_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  study_material_id UUID NOT NULL REFERENCES study_materials(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. quizzes
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  topic_ids JSONB DEFAULT '[]',
  questions_count INT NOT NULL DEFAULT 5,
  is_transfer_assessment BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. quiz_questions
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'scenario_based')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question_text TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  scoring_rubric JSONB,
  source_chunk_ids JSONB DEFAULT '[]',
  citations JSONB DEFAULT '[]'
);

-- 10. quiz_attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL,
  total_questions INT NOT NULL,
  correct_answers INT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- 11. student_answers
CREATE TABLE IF NOT EXISTS student_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  student_response TEXT NOT NULL,
  confidence_rating TEXT CHECK (confidence_rating IN ('guessing', 'somewhat', 'confident')),
  is_correct BOOLEAN NOT NULL,
  score NUMERIC NOT NULL DEFAULT 0.0,
  time_spent_seconds INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. answer_evaluations
CREATE TABLE IF NOT EXISTS answer_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answer_id UUID NOT NULL REFERENCES student_answers(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('correct', 'partially_correct', 'incorrect')),
  feedback TEXT NOT NULL,
  missing_concepts JSONB DEFAULT '[]',
  misconception_indicators JSONB DEFAULT '[]',
  grounding_citation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. misconception_patterns
CREATE TABLE IF NOT EXISTS misconception_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  pattern_name TEXT NOT NULL,
  description TEXT NOT NULL,
  frequency INT DEFAULT 1,
  high_confidence_errors INT DEFAULT 0,
  sample_student_responses JSONB DEFAULT '[]',
  identified_at TIMESTAMPTZ DEFAULT now(),
  resolved BOOLEAN DEFAULT false
);

-- 14. root_cause_diagnoses
CREATE TABLE IF NOT EXISTS root_cause_diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  observed_topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  root_cause_topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  observed_issue TEXT NOT NULL,
  hypothesized_cause TEXT NOT NULL,
  confidence_level NUMERIC NOT NULL,
  evidence_citations JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'hypothesis' CHECK (status IN ('hypothesis', 'confirmed', 'resolved')),
  recommended_intervention TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 15. topic_mastery
CREATE TABLE IF NOT EXISTS topic_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  mastery_score NUMERIC NOT NULL DEFAULT 0.0,
  status TEXT NOT NULL DEFAULT 'insufficient_evidence' CHECK (status IN ('weak', 'developing', 'strong', 'insufficient_evidence')),
  questions_attempted INT DEFAULT 0,
  questions_correct INT DEFAULT 0,
  last_assessed_at TIMESTAMPTZ,
  UNIQUE(user_id, topic_id)
);

-- 16. learning_risk_predictions
CREATE TABLE IF NOT EXISTS learning_risk_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  risk_score NUMERIC NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('high', 'moderate', 'low', 'insufficient')),
  contributing_factors JSONB DEFAULT '[]',
  supporting_history TEXT,
  recommended_preventive_action TEXT,
  calculated_at TIMESTAMPTZ DEFAULT now()
);

-- 17. learning_interventions
CREATE TABLE IF NOT EXISTS learning_interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  diagnosis_id UUID REFERENCES root_cause_diagnoses(id) ON DELETE SET NULL,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  intervention_type TEXT NOT NULL CHECK (intervention_type IN ('review_foundational', 'worked_example', 'tracing_exercise', 'practice_quiz', 'reading')),
  rationale TEXT NOT NULL,
  estimated_duration_minutes INT NOT NULL,
  source_excerpt TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  completed_at TIMESTAMPTZ
);

-- 18. revision_plans
CREATE TABLE IF NOT EXISTS revision_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_exam_date DATE,
  daily_study_hours NUMERIC DEFAULT 2.0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 19. revision_tasks
CREATE TABLE IF NOT EXISTS revision_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES revision_plans(id) ON DELETE CASCADE,
  intervention_id UUID REFERENCES learning_interventions(id) ON DELETE SET NULL,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_date DATE NOT NULL,
  estimated_minutes INT NOT NULL,
  completed BOOLEAN DEFAULT false,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified_passed', 'needs_further_review'))
);

-- 20. transfer_assessments
CREATE TABLE IF NOT EXISTS transfer_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  intervention_id UUID NOT NULL REFERENCES learning_interventions(id) ON DELETE CASCADE,
  original_topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  baseline_score NUMERIC NOT NULL,
  verification_score NUMERIC NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('mastery_verified', 'needs_more_practice')),
  new_context_scenario TEXT NOT NULL,
  question_id TEXT NOT NULL,
  evaluated_at TIMESTAMPTZ DEFAULT now(),
  improvement_delta NUMERIC NOT NULL
);

-- 21. chat_sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 22. chat_messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
  content TEXT NOT NULL,
  citations JSONB DEFAULT '[]',
  is_grounded BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 23. classes
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 24. class_memberships
CREATE TABLE IF NOT EXISTS class_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(class_id, student_id)
);

-- Indexes for high-performance querying
CREATE INDEX IF NOT EXISTS idx_chunks_material ON document_chunks(study_material_id);
CREATE INDEX IF NOT EXISTS idx_chunks_user ON document_chunks(user_id);
CREATE INDEX IF NOT EXISTS idx_dependencies_prereq ON concept_dependencies(prerequisite_topic_id);
CREATE INDEX IF NOT EXISTS idx_dependencies_dep ON concept_dependencies(dependent_topic_id);
CREATE INDEX IF NOT EXISTS idx_answers_attempt ON student_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_mastery_user ON topic_mastery(user_id);
CREATE INDEX IF NOT EXISTS idx_root_cause_user ON root_cause_diagnoses(user_id);

-- Row Level Security (RLS) Enablement
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE root_cause_diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_risk_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfer_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Sample RLS Policy: Users can only read and manage their own study materials
CREATE POLICY "Users can only access their own study materials"
ON study_materials FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own chunks"
ON document_chunks FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own diagnoses"
ON root_cause_diagnoses FOR ALL
USING (auth.uid() = user_id);
