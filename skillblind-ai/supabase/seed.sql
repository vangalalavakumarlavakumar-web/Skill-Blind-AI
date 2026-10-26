-- SkillBlind AI - Complete Demonstration Seed Script
-- Preloads Data Structures and Algorithms with Concept Dependency Graph,
-- Documents, Chunks, Diagnostic Quiz, Historical High-Confidence Errors, Root Causes, Predictions, and Interventions.

INSERT INTO profiles (id, email, full_name, role, target_score, available_hours_per_day, exam_date)
VALUES 
  ('00000000-0000-0000-0000-000000000101', 'lava.kumar@skillblind.ai', 'Lava Kumar', 'student', 85, 2.0, '2026-11-20')
ON CONFLICT (id) DO NOTHING;

INSERT INTO subjects (id, user_id, name, code, description, color)
VALUES
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 'Data Structures and Algorithms', 'CS201', 'Core computer science foundation covering complexity, recursion, trees, and graphs.', '#3b82f6')
ON CONFLICT (id) DO NOTHING;

-- Topics Hierarchy
INSERT INTO topics (id, subject_id, name, description, difficulty_level, order_index)
VALUES
  ('11111111-1111-1111-1111-111111110001', '00000000-0000-0000-0000-000000000201', 'Programming Fundamentals', 'Memory models, primitive variables, scope, and loops', 'beginner', 1),
  ('11111111-1111-1111-1111-111111110002', '00000000-0000-0000-0000-000000000201', 'Functions & Scope', 'Parameter passing, execution frames, and return values', 'beginner', 2),
  ('11111111-1111-1111-1111-111111110003', '00000000-0000-0000-0000-000000000201', 'Recursion & Call Stacks', 'Recursive decomposition, base termination cases, and activation records', 'intermediate', 3),
  ('11111111-1111-1111-1111-111111110004', '00000000-0000-0000-0000-000000000201', 'Tree Traversal (DFS/BFS)', 'Recursive Inorder, Preorder, Postorder and null pointer handling', 'intermediate', 4),
  ('11111111-1111-1111-1111-111111110005', '00000000-0000-0000-0000-000000000201', 'Binary Search Trees (BST)', 'BST ordering invariants, node search, insertion, and balancing', 'advanced', 5),
  ('11111111-1111-1111-1111-111111110006', '00000000-0000-0000-0000-000000000201', 'Graph Algorithms', 'Adjacency lists, DFS backtracking, BFS queue, cycle detection', 'advanced', 6)
ON CONFLICT (id) DO NOTHING;

-- Concept Dependency Edges
-- Functions -> Recursion -> Tree Traversal -> Binary Trees
INSERT INTO concept_dependencies (id, subject_id, prerequisite_topic_id, dependent_topic_id, relationship_type, confidence, source_evidence, user_verified)
VALUES
  ('22222222-2222-2222-2222-222222220001', '00000000-0000-0000-0000-000000000201', '11111111-1111-1111-1111-111111110001', '11111111-1111-1111-1111-111111110002', 'strict_prerequisite', 0.98, 'Syllabus Section 1: Functions require primitive variable scope mastery.', true),
  ('22222222-2222-2222-2222-222222220002', '00000000-0000-0000-0000-000000000201', '11111111-1111-1111-1111-111111110002', '11111111-1111-1111-1111-111111110003', 'strict_prerequisite', 0.96, 'Chapter 3: Recursive execution relies on stack frames and parameter scoping.', true),
  ('22222222-2222-2222-2222-222222220003', '00000000-0000-0000-0000-000000000201', '11111111-1111-1111-1111-111111110003', '11111111-1111-1111-1111-111111110004', 'strict_prerequisite', 0.95, 'Chapter 5: Tree traversals are formulated recursively via subtrees.', true),
  ('22222222-2222-2222-2222-222222220004', '00000000-0000-0000-0000-000000000201', '11111111-1111-1111-1111-111111110004', '11111111-1111-1111-1111-111111110005', 'strict_prerequisite', 0.94, 'Chapter 5 Section 4: BST validation and search rely on Inorder traversal sequence.', true),
  ('22222222-2222-2222-2222-222222220005', '00000000-0000-0000-0000-000000000201', '11111111-1111-1111-1111-111111110003', '11111111-1111-1111-1111-111111110006', 'strict_prerequisite', 0.91, 'Syllabus Unit 5: DFS graph traversal is an extension of recursive backtracking.', false)
ON CONFLICT (id) DO NOTHING;
