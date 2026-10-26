import {
  Profile,
  Subject,
  StudyMaterial,
  DocumentChunk,
  Topic,
  ConceptDependency,
  QuizQuestion,
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
} from "@/types";

export const DEMO_USER: Profile = {
  id: "demo-user-101",
  email: "lava.kumar@skillblind.ai",
  full_name: "Lava Kumar",
  role: "student",
  target_score: 85,
  available_hours_per_day: 2,
  exam_date: "2026-11-20",
  created_at: "2026-10-01T09:00:00Z",
  updated_at: "2026-10-25T14:30:00Z",
};

export const DEMO_SUBJECT: Subject = {
  id: "subj-dsa-101",
  user_id: DEMO_USER.id,
  name: "Data Structures and Algorithms",
  code: "CS201",
  description: "Core computer science foundation covering complexity, recursion, linear and non-linear data structures.",
  color: "#3b82f6",
  created_at: "2026-10-01T09:00:00Z",
};

export const DEMO_MATERIALS: StudyMaterial[] = [
  {
    id: "mat-01",
    user_id: DEMO_USER.id,
    subject_id: DEMO_SUBJECT.id,
    title: "CS201 Official Syllabus & Course Outline.pdf",
    document_type: "syllabus",
    file_name: "CS201_Syllabus.pdf",
    file_size: 420000,
    status: "processed",
    total_pages: 6,
    chunk_count: 8,
    created_at: "2026-10-02T10:00:00Z",
    updated_at: "2026-10-02T10:05:00Z",
  },
  {
    id: "mat-02",
    user_id: DEMO_USER.id,
    subject_id: DEMO_SUBJECT.id,
    title: "Chapter 3: Recursion and Call Stack Mechanics.pdf",
    document_type: "textbook",
    file_name: "Chapter3_Recursion.pdf",
    file_size: 1850000,
    status: "processed",
    total_pages: 24,
    chunk_count: 18,
    created_at: "2026-10-03T11:20:00Z",
    updated_at: "2026-10-03T11:25:00Z",
  },
  {
    id: "mat-03",
    user_id: DEMO_USER.id,
    subject_id: DEMO_SUBJECT.id,
    title: "Chapter 5: Binary Trees & Tree Traversals.pdf",
    document_type: "textbook",
    file_name: "Chapter5_Trees.pdf",
    file_size: 2450000,
    status: "processed",
    total_pages: 32,
    chunk_count: 24,
    created_at: "2026-10-04T09:15:00Z",
    updated_at: "2026-10-04T09:22:00Z",
  },
  {
    id: "mat-04",
    user_id: DEMO_USER.id,
    subject_id: DEMO_SUBJECT.id,
    title: "Fall 2025 Midterm Diagnostic Exam Paper.pdf",
    document_type: "exam_paper",
    file_name: "CS201_Midterm_2025.pdf",
    file_size: 920000,
    status: "processed",
    total_pages: 10,
    chunk_count: 12,
    created_at: "2026-10-05T14:00:00Z",
    updated_at: "2026-10-05T14:05:00Z",
  },
];

export const DEMO_CHUNKS: DocumentChunk[] = [
  {
    id: "chk-01",
    study_material_id: "mat-02",
    user_id: DEMO_USER.id,
    chunk_index: 1,
    page_number: 3,
    section_heading: "3.1 Anatomy of a Recursive Function",
    content:
      "A recursive function consists of two essential components: (1) A Base Case that terminates recursion without making further recursive calls, preventing infinite recursion and stack overflow; (2) A Recursive Step that decomposes the input into smaller subproblems and calls the function recursively. Without a strictly verified base case, execution leads to runtime CallStackExceeded exception.",
    created_at: "2026-10-03T11:25:00Z",
  },
  {
    id: "chk-02",
    study_material_id: "mat-02",
    user_id: DEMO_USER.id,
    chunk_index: 2,
    page_number: 7,
    section_heading: "3.3 Call Stack Activation Records",
    content:
      "Each recursive invocation allocates a new Stack Frame (Activation Record) containing parameter values, local variables, and the return address. When a function reaches the base case, return values are propagated back up through the stack during the unwinding phase. Misunderstanding stack unwinding is the #1 cause of errors when accumulating tree values or tracking path state.",
    created_at: "2026-10-03T11:25:00Z",
  },
  {
    id: "chk-03",
    study_material_id: "mat-03",
    user_id: DEMO_USER.id,
    chunk_index: 1,
    page_number: 12,
    section_heading: "5.2 Depth-First Tree Traversals",
    content:
      "Depth-First Search (DFS) on binary trees comprises three primary orders: Inorder (Left, Root, Right), Preorder (Root, Left, Right), and Postorder (Left, Right, Root). Because a tree is a recursively defined data structure where each child node is the root of a subtree, traversal functions are inherently recursive. If the base condition (node == null) is evaluated incorrectly, traversal visits invalid memory or produces corrupted outputs.",
    created_at: "2026-10-04T09:22:00Z",
  },
  {
    id: "chk-04",
    study_material_id: "mat-03",
    user_id: DEMO_USER.id,
    chunk_index: 2,
    page_number: 18,
    section_heading: "5.4 Inorder Traversal on Binary Search Trees (BST)",
    content:
      "An Inorder traversal of a valid Binary Search Tree always visits elements in strictly ascending sorted order. The standard recursive implementation first recurses on node.left, prints or processes node.val, and finally recurses on node.right. The time complexity is O(N) and the auxiliary space on the call stack is O(H), where H is tree height.",
    created_at: "2026-10-04T09:22:00Z",
  },
];

export const DEMO_TOPICS: Topic[] = [
  {
    id: "top-prog-fund",
    subject_id: DEMO_SUBJECT.id,
    parent_id: null,
    name: "Programming Fundamentals",
    description: "Memory models, variables, scope, primitives, and control flow.",
    difficulty_level: "beginner",
    order_index: 1,
    created_at: "2026-10-02T10:00:00Z",
  },
  {
    id: "top-functions",
    subject_id: DEMO_SUBJECT.id,
    parent_id: "top-prog-fund",
    name: "Functions & Scope",
    description: "Function definitions, parameters, return values, and execution contexts.",
    difficulty_level: "beginner",
    order_index: 2,
    created_at: "2026-10-02T10:00:00Z",
  },
  {
    id: "top-recursion",
    subject_id: DEMO_SUBJECT.id,
    parent_id: "top-functions",
    name: "Recursion & Call Stacks",
    description: "Recursive decomposition, base cases, call stack frames, and unwinding.",
    difficulty_level: "intermediate",
    order_index: 3,
    created_at: "2026-10-02T10:00:00Z",
  },
  {
    id: "top-arrays",
    subject_id: DEMO_SUBJECT.id,
    parent_id: null,
    name: "Arrays & Strings",
    description: "Contiguous memory layouts, indexing, and linear scans.",
    difficulty_level: "beginner",
    order_index: 4,
    created_at: "2026-10-02T10:00:00Z",
  },
  {
    id: "top-linked-lists",
    subject_id: DEMO_SUBJECT.id,
    parent_id: null,
    name: "Linked Lists",
    description: "Pointer-based linear structures, nodes, insertion, and reversal.",
    difficulty_level: "intermediate",
    order_index: 5,
    created_at: "2026-10-02T10:00:00Z",
  },
  {
    id: "top-tree-traversal",
    subject_id: DEMO_SUBJECT.id,
    parent_id: null,
    name: "Tree Traversal (DFS/BFS)",
    description: "Recursive Inorder, Preorder, Postorder and iterative Level Order.",
    difficulty_level: "intermediate",
    order_index: 6,
    created_at: "2026-10-02T10:00:00Z",
  },
  {
    id: "top-binary-trees",
    subject_id: DEMO_SUBJECT.id,
    parent_id: null,
    name: "Binary Search Trees (BST)",
    description: "BST properties, search, insertion, deletion, and height balancing.",
    difficulty_level: "advanced",
    order_index: 7,
    created_at: "2026-10-02T10:00:00Z",
  },
  {
    id: "top-graphs",
    subject_id: DEMO_SUBJECT.id,
    parent_id: null,
    name: "Graph Algorithms",
    description: "Adjacency lists, DFS, BFS, topological sort, cycle detection.",
    difficulty_level: "advanced",
    order_index: 8,
    created_at: "2026-10-02T10:00:00Z",
  },
];

export const DEMO_DEPENDENCIES: ConceptDependency[] = [
  {
    id: "dep-01",
    subject_id: DEMO_SUBJECT.id,
    prerequisite_topic_id: "top-prog-fund",
    dependent_topic_id: "top-functions",
    relationship_type: "strict_prerequisite",
    confidence: 0.98,
    source_evidence: "Syllabus Section 1.2: Functions require understanding variable scope and types.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
  {
    id: "dep-02",
    subject_id: DEMO_SUBJECT.id,
    prerequisite_topic_id: "top-functions",
    dependent_topic_id: "top-recursion",
    relationship_type: "strict_prerequisite",
    confidence: 0.96,
    source_evidence: "Chapter 3: Recursive execution relies on stack frames and parameter scoping.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
  {
    id: "dep-03",
    subject_id: DEMO_SUBJECT.id,
    prerequisite_topic_id: "top-recursion",
    dependent_topic_id: "top-tree-traversal",
    relationship_type: "strict_prerequisite",
    confidence: 0.95,
    source_evidence: "Chapter 5 Section 2: Tree traversals are formulated recursively via subtrees.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
  {
    id: "dep-04",
    subject_id: DEMO_SUBJECT.id,
    prerequisite_topic_id: "top-tree-traversal",
    dependent_topic_id: "top-binary-trees",
    relationship_type: "strict_prerequisite",
    confidence: 0.94,
    source_evidence: "Chapter 5 Section 4: BST validation and search heavily depend on Inorder traversal logic.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
  {
    id: "dep-05",
    subject_id: DEMO_SUBJECT.id,
    prerequisite_topic_id: "top-recursion",
    dependent_topic_id: "top-graphs",
    relationship_type: "strict_prerequisite",
    confidence: 0.91,
    source_evidence: "Syllabus Unit 5: DFS graph traversal is an extension of recursive backtracking.",
    user_verified: false,
    created_at: "2026-10-02T10:05:00Z",
  },
];

export const DEMO_QUESTIONS: QuizQuestion[] = [
  {
    id: "q-01",
    topic_id: "top-recursion",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text:
      "In the recursive function `int count(int n) { if (n <= 0) return 0; return 1 + count(n - 1); }`, what is the exact function of `if (n <= 0) return 0;`?",
    options: [
      "It speeds up execution by skipping positive values",
      "It serves as the base case that halts recursion and prevents stack overflow",
      "It reinitializes the call stack frame",
      "It forces the compiler to allocate heap memory",
    ],
    correct_answer: "It serves as the base case that halts recursion and prevents stack overflow",
    explanation:
      "A base case provides the termination condition for recursion. Without `n <= 0`, calls would decrement indefinitely until the OS terminates the program due to stack overflow.",
    source_chunk_ids: ["chk-01"],
    citations: [
      {
        source_title: "Chapter 3: Recursion and Call Stack Mechanics.pdf",
        page_number: 3,
        excerpt: "A recursive function consists of a Base Case that terminates recursion without further calls.",
      },
    ],
  },
  {
    id: "q-02",
    topic_id: "top-recursion",
    question_type: "short_answer",
    difficulty: "hard",
    question_text:
      "Explain what happens to local variables and return values during the 'stack unwinding' phase of a recursive tree traversal when a leaf's child `null` is encountered.",
    correct_answer:
      "When null is reached, the base case triggers. The topmost stack frame pops from the call stack, returning control and any return value to the caller frame. Local variables in the parent frame are restored exactly as they were before the child call.",
    explanation:
      "During stack unwinding, activation records are popped in LIFO order. The return value is supplied to the previous caller expression, and subsequent statements in the parent function resume execution.",
    scoring_rubric: {
      required_keywords: ["base case", "pop", "stack frame", "unwinding", "caller"],
      partial_credit_threshold: 0.5,
      sample_flawed_thinking: "Variables get reset to zero and the function restarts from the top.",
    },
    source_chunk_ids: ["chk-02"],
    citations: [
      {
        source_title: "Chapter 3: Recursion and Call Stack Mechanics.pdf",
        page_number: 7,
        excerpt: "When reaching the base case, return values are propagated back up during the unwinding phase.",
      },
    ],
  },
  {
    id: "q-03",
    topic_id: "top-tree-traversal",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text:
      "For a Binary Search Tree with root 10, left child 5, right child 15, what will be the output of a recursive Inorder traversal?",
    options: ["10, 5, 15", "5, 10, 15", "15, 10, 5", "5, 15, 10"],
    correct_answer: "5, 10, 15",
    explanation:
      "Inorder traversal visits Left, Root, Right. For this tree: Left (5) -> Root (10) -> Right (15), which yields 5, 10, 15.",
    source_chunk_ids: ["chk-03", "chk-04"],
    citations: [
      {
        source_title: "Chapter 5: Binary Trees & Tree Traversals.pdf",
        page_number: 18,
        excerpt: "An Inorder traversal of a valid BST always visits elements in strictly ascending sorted order.",
      },
    ],
  },
  {
    id: "q-04",
    topic_id: "top-tree-traversal",
    question_type: "scenario_based",
    difficulty: "hard",
    question_text:
      "A student writes a recursive method to calculate the maximum depth of a binary tree, but their program enters an infinite loop and crashes on any tree with more than 1 node. What is the most probable defect in their recursive logic?",
    options: [
      "They used heap allocation instead of pointers",
      "They omitted the base case `if (node == null) return 0;` before recursing on left and right children",
      "They visited the right subtree before the left subtree",
      "Binary trees cannot be processed using recursive algorithms",
    ],
    correct_answer: "They omitted the base case `if (node == null) return 0;` before recursing on left and right children",
    explanation:
      "Every recursive tree algorithm must verify if the current node is null. Without this base check, child pointers of leaf nodes (which are null) trigger further recursive calls, exhausting stack memory.",
    source_chunk_ids: ["chk-01", "chk-03"],
    citations: [
      {
        source_title: "Chapter 5: Binary Trees & Tree Traversals.pdf",
        page_number: 12,
        excerpt: "If the base condition (node == null) is evaluated incorrectly, traversal visits invalid memory.",
      },
    ],
  },
  {
    id: "q-05",
    topic_id: "top-binary-trees",
    question_type: "true_false",
    difficulty: "easy",
    question_text:
      "In a valid Binary Search Tree (BST), the right child node can contain a key that is strictly smaller than the parent node.",
    options: ["True", "False"],
    correct_answer: "False",
    explanation:
      "By definition of a BST, every key in the right subtree must be strictly greater than the root/parent key.",
    source_chunk_ids: ["chk-04"],
    citations: [
      {
        source_title: "Chapter 5: Binary Trees & Tree Traversals.pdf",
        page_number: 18,
        excerpt: "In a BST, keys in the left subtree are smaller and keys in the right subtree are greater.",
      },
    ],
  },
];

export const DEMO_QUIZ: Quiz = {
  id: "quiz-dsa-diagnostic",
  subject_id: DEMO_SUBJECT.id,
  user_id: DEMO_USER.id,
  title: "Diagnostic Assessment: Recursion & Binary Tree Traversals",
  description:
    "Comprehensive source-grounded diagnostic quiz evaluating prerequisite recursion mastery and tree traversal application.",
  topic_ids: ["top-recursion", "top-tree-traversal", "top-binary-trees"],
  questions_count: 5,
  is_transfer_assessment: false,
  created_at: "2026-10-24T10:00:00Z",
  questions: DEMO_QUESTIONS,
};

export const DEMO_STUDENT_ANSWERS: StudentAnswer[] = [
  {
    id: "ans-01",
    attempt_id: "att-01",
    question_id: "q-01",
    student_response: "It speeds up execution by skipping positive values",
    confidence_rating: "confident", // High confidence error!
    is_correct: false,
    score: 0.0,
    time_spent_seconds: 45,
    evaluation_details: {
      score: 0.0,
      status: "incorrect",
      feedback:
        "Student confused the base termination condition with an optimization heuristic, despite expressing high confidence.",
      missing_concepts: ["Base case termination", "Stack overflow prevention"],
      misconception_indicators: ["High-confidence prerequisite misconception"],
      grounding_citation: "Chapter 3: Page 3",
    },
    created_at: "2026-10-24T10:05:00Z",
  },
  {
    id: "ans-02",
    attempt_id: "att-01",
    question_id: "q-02",
    student_response:
      "The variables are wiped from memory and the computer starts the algorithm again from the root node.",
    confidence_rating: "confident", // Another high confidence misconception!
    is_correct: false,
    score: 0.15,
    time_spent_seconds: 110,
    evaluation_details: {
      score: 0.15,
      status: "incorrect",
      feedback:
        "Student failed to identify call stack unwinding and LIFO frame popping. Believes the entire function restarts rather than resuming the caller.",
      missing_concepts: ["Call stack activation records", "Stack unwinding", "Caller context restoration"],
      misconception_indicators: ["Flawed mental model of recursive call stacks"],
      grounding_citation: "Chapter 3: Page 7",
    },
    created_at: "2026-10-24T10:08:00Z",
  },
  {
    id: "ans-03",
    attempt_id: "att-01",
    question_id: "q-03",
    student_response: "10, 5, 15",
    confidence_rating: "somewhat",
    is_correct: false,
    score: 0.0,
    time_spent_seconds: 35,
    evaluation_details: {
      score: 0.0,
      status: "incorrect",
      feedback:
        "Selected Preorder order (Root, Left, Right) instead of Inorder (Left, Root, Right). Caused by failing to trace the left subtree recursion first.",
      missing_concepts: ["Inorder traversal sequence (L-N-R)"],
      misconception_indicators: ["Preorder vs Inorder confusion"],
      grounding_citation: "Chapter 5: Page 18",
    },
    created_at: "2026-10-24T10:10:00Z",
  },
  {
    id: "ans-04",
    attempt_id: "att-01",
    question_id: "q-04",
    student_response: "They visited the right subtree before the left subtree",
    confidence_rating: "somewhat",
    is_correct: false,
    score: 0.0,
    time_spent_seconds: 60,
    evaluation_details: {
      score: 0.0,
      status: "incorrect",
      feedback:
        "Failed to diagnose the missing base condition on null pointer. Believed traversal order caused infinite loop instead of base condition absence.",
      missing_concepts: ["Null pointer termination in tree traversal"],
      misconception_indicators: ["Inability to identify missing recursion termination"],
      grounding_citation: "Chapter 5: Page 12",
    },
    created_at: "2026-10-24T10:12:00Z",
  },
  {
    id: "ans-05",
    attempt_id: "att-01",
    question_id: "q-05",
    student_response: "False",
    confidence_rating: "confident",
    is_correct: true,
    score: 1.0,
    time_spent_seconds: 20,
    evaluation_details: {
      score: 1.0,
      status: "correct",
      feedback: "Correctly recognized the fundamental BST key invariant.",
      missing_concepts: [],
      misconception_indicators: [],
      grounding_citation: "Chapter 5: Page 18",
    },
    created_at: "2026-10-24T10:13:00Z",
  },
];

export const DEMO_ATTEMPT: QuizAttempt = {
  id: "att-01",
  quiz_id: DEMO_QUIZ.id,
  user_id: DEMO_USER.id,
  score: 0.23, // 23% overall
  total_questions: 5,
  correct_answers: 1,
  completed_at: "2026-10-24T10:15:00Z",
  answers: DEMO_STUDENT_ANSWERS,
  quiz: DEMO_QUIZ,
};

export const DEMO_TOPIC_MASTERY: TopicMastery[] = [
  {
    id: "mst-01",
    user_id: DEMO_USER.id,
    topic_id: "top-prog-fund",
    mastery_score: 0.92,
    status: "strong",
    questions_attempted: 12,
    questions_correct: 11,
    last_assessed_at: "2026-10-15T10:00:00Z",
  },
  {
    id: "mst-02",
    user_id: DEMO_USER.id,
    topic_id: "top-functions",
    mastery_score: 0.85,
    status: "strong",
    questions_attempted: 10,
    questions_correct: 8,
    last_assessed_at: "2026-10-18T14:00:00Z",
  },
  {
    id: "mst-03",
    user_id: DEMO_USER.id,
    topic_id: "top-recursion",
    mastery_score: 0.28,
    status: "weak",
    questions_attempted: 7,
    questions_correct: 2,
    last_assessed_at: "2026-10-24T10:15:00Z",
  },
  {
    id: "mst-04",
    user_id: DEMO_USER.id,
    topic_id: "top-tree-traversal",
    mastery_score: 0.25,
    status: "weak",
    questions_attempted: 8,
    questions_correct: 2,
    last_assessed_at: "2026-10-24T10:15:00Z",
  },
  {
    id: "mst-05",
    user_id: DEMO_USER.id,
    topic_id: "top-binary-trees",
    mastery_score: 0.55,
    status: "developing",
    questions_attempted: 6,
    questions_correct: 3,
    last_assessed_at: "2026-10-24T10:15:00Z",
  },
  {
    id: "mst-06",
    user_id: DEMO_USER.id,
    topic_id: "top-graphs",
    mastery_score: 0.1,
    status: "insufficient_evidence",
    questions_attempted: 1,
    questions_correct: 0,
    last_assessed_at: undefined,
  },
];

export const DEMO_MISCONCEPTIONS: MisconceptionPattern[] = [
  {
    id: "misc-01",
    user_id: DEMO_USER.id,
    topic_id: "top-recursion",
    pattern_name: "Premature Recursion Termination Confusion",
    description:
      "Student views base cases as discretionary speed optimizations rather than strict termination conditions required for execution correctness.",
    frequency: 3,
    high_confidence_errors: 2,
    sample_student_responses: [
      "It speeds up execution by skipping positive values",
      "Base case is optional if you have enough RAM",
    ],
    identified_at: "2026-10-24T10:16:00Z",
    resolved: false,
  },
  {
    id: "misc-02",
    user_id: DEMO_USER.id,
    topic_id: "top-recursion",
    pattern_name: "Call Stack Reset Illusion",
    description:
      "Student believes that when a sub-call finishes or reaches a leaf, the entire function restarts from scratch rather than resuming the caller's stack frame.",
    frequency: 2,
    high_confidence_errors: 2,
    sample_student_responses: [
      "The variables are wiped from memory and the computer starts the algorithm again from the root node.",
    ],
    identified_at: "2026-10-24T10:16:00Z",
    resolved: false,
  },
];

export const DEMO_ROOT_CAUSE: RootCauseDiagnosis = {
  id: "diag-dsa-01",
  user_id: DEMO_USER.id,
  subject_id: DEMO_SUBJECT.id,
  observed_topic_id: "top-tree-traversal",
  root_cause_topic_id: "top-recursion",
  observed_issue:
    "Observed: Student scored 0% on tree traversal tracing and repeatedly misidentified depth-first outputs and infinite loop root causes.",
  hypothesized_cause:
    "Root Cause Hypothesis: Conceptual blindspot in 'Recursion Base-Cases & Call Stack Unwinding'. The student cannot trace tree traversals because they treat recursive steps as linear resets rather than stack-based frame propagation.",
  confidence_level: 0.92,
  evidence_citations: [
    {
      quiz_attempt_id: "att-01",
      question_text: "Explain what happens to local variables and return values during the stack unwinding phase...",
      student_response: "The variables are wiped from memory and the computer starts the algorithm again from root.",
      flaw_identified: "Belief that recursion restarts linearly instead of popping stack activation records.",
    },
    {
      quiz_attempt_id: "att-01",
      question_text: "What is the exact function of the base case if (n <= 0) return 0?",
      student_response: "It speeds up execution by skipping positive values (Answered with High Confidence).",
      flaw_identified: "High-confidence misconception regarding necessity of base case termination.",
    },
  ],
  status: "hypothesis",
  recommended_intervention:
    "Targeted Intervention: Complete the 'Recursion Call Stack Visual Tracing' interactive walkthrough, followed by stepping through a 3-node Binary Tree traversal step-by-step.",
  created_at: "2026-10-24T10:18:00Z",
};

export const DEMO_PREDICTIONS: LearningRiskPrediction[] = [
  {
    id: "pred-01",
    user_id: DEMO_USER.id,
    topic_id: "top-graphs",
    risk_score: 0.88,
    risk_level: "high",
    contributing_factors: [
      {
        factor: "Critical Prerequisite Failure",
        weight: 0.45,
        impact: "increases_risk",
        description: "Recursion & Call Stacks mastery is only 28%. Graph DFS requires deep recursive backtracking.",
      },
      {
        factor: "Dependent Concept Failure",
        weight: 0.3,
        impact: "increases_risk",
        description: "Tree Traversal (DFS) failed at 25% score.",
      },
      {
        factor: "Lack of Practice Evidence",
        weight: 0.25,
        impact: "increases_risk",
        description: "Only 1 question attempted on Graphs so far.",
      },
    ],
    supporting_history:
      "Historical data shows 94% of students with unresolved recursion misconceptions fail graph cycle detection problems on midterms.",
    recommended_preventive_action:
      "Do not begin Graph Depth-First Search until Recursion Stack Tracing is formally verified with a 75%+ score.",
    calculated_at: "2026-10-24T10:20:00Z",
  },
  {
    id: "pred-02",
    user_id: DEMO_USER.id,
    topic_id: "top-binary-trees",
    risk_score: 0.62,
    risk_level: "moderate",
    contributing_factors: [
      {
        factor: "Partial Understanding of BST Definition",
        weight: 0.35,
        impact: "decreases_risk",
        description: "Correctly answered static invariant question on BST key ordering.",
      },
      {
        factor: "Prerequisite Weakness in Inorder Traversal",
        weight: 0.45,
        impact: "increases_risk",
        description: "BST validation and deletion routines depend entirely on Inorder successor navigation.",
      },
    ],
    supporting_history: "Moderate risk: BST search is intuitive, but BST deletion and rotation will trigger failures.",
    recommended_preventive_action: "Solidify Inorder traversal before attempting AVL Tree self-balancing rotations.",
    calculated_at: "2026-10-24T10:20:00Z",
  },
];

export const DEMO_INTERVENTIONS: LearningIntervention[] = [
  {
    id: "intv-01",
    user_id: DEMO_USER.id,
    diagnosis_id: DEMO_ROOT_CAUSE.id,
    topic_id: "top-recursion",
    title: "Stack Frame Activation & Unwinding Visual Walkthrough",
    intervention_type: "tracing_exercise",
    rationale:
      "Recommended because Recursion is a prerequisite for Tree Traversal, and student demonstrated a high-confidence misconception regarding stack unwinding.",
    estimated_duration_minutes: 25,
    source_excerpt:
      "Chapter 3: Page 7 - Study Figure 3.4 showing how activation records preserve parent state while child calls execute.",
    status: "in_progress",
    created_at: "2026-10-24T10:22:00Z",
  },
  {
    id: "intv-02",
    user_id: DEMO_USER.id,
    diagnosis_id: DEMO_ROOT_CAUSE.id,
    topic_id: "top-tree-traversal",
    title: "Guided Tree Traversal Tracing: Inorder, Preorder, Postorder",
    intervention_type: "worked_example",
    rationale:
      "Reinforces how recursive calls map directly to Left-Root-Right tree navigation with explicit null checks.",
    estimated_duration_minutes: 20,
    source_excerpt: "Chapter 5: Page 14 - Step-by-step trace of a 4-node tree with call stack diagrams.",
    status: "pending",
    created_at: "2026-10-24T10:22:00Z",
  },
];

export const DEMO_REVISION_PLAN: RevisionPlan = {
  id: "plan-dsa-01",
  user_id: DEMO_USER.id,
  subject_id: DEMO_SUBJECT.id,
  title: "Targeted Mastery Roadmap: Recursion to Trees",
  target_exam_date: "2026-11-20",
  daily_study_hours: 2,
  tasks: [
    {
      id: "tsk-01",
      plan_id: "plan-dsa-01",
      intervention_id: "intv-01",
      topic_id: "top-recursion",
      title: "Step 1: Revise Recursion Base-Case & Stack Unwinding Mechanics",
      description: "Read Chapter 3 (Pages 3-8) and trace `factorial(3)` with exact call stack frames.",
      scheduled_date: "2026-10-26",
      estimated_minutes: 30,
      completed: true,
      verification_status: "verified_passed",
    },
    {
      id: "tsk-02",
      plan_id: "plan-dsa-01",
      intervention_id: "intv-02",
      topic_id: "top-tree-traversal",
      title: "Step 2: Trace Inorder Traversal on a 5-node Binary Tree",
      description: "Draw the call stack for each `node.left`, `print(val)`, `node.right` invocation.",
      scheduled_date: "2026-10-27",
      estimated_minutes: 25,
      completed: false,
      verification_status: "pending",
    },
    {
      id: "tsk-03",
      plan_id: "plan-dsa-01",
      topic_id: "top-tree-traversal",
      title: "Step 3: Transfer-of-Knowledge Verification Assessment",
      description: "Apply recursive traversal to a new scenario (Directory File System Tree) to verify true conceptual transfer.",
      scheduled_date: "2026-10-28",
      estimated_minutes: 15,
      completed: false,
      verification_status: "pending",
    },
  ],
  created_at: "2026-10-24T10:25:00Z",
};

export const DEMO_TRANSFER_ASSESSMENT: TransferAssessment = {
  id: "trans-01",
  user_id: DEMO_USER.id,
  intervention_id: "intv-01",
  original_topic_id: "top-tree-traversal",
  baseline_score: 0.25,
  verification_score: 0.85,
  status: "mastery_verified",
  new_context_scenario:
    "New Application Context: Instead of binary trees, student was asked to compute total disk usage of nested directories using recursive file-system tree traversal.",
  question_id: "q-trans-01",
  evaluated_at: "2026-10-25T11:00:00Z",
  improvement_delta: 0.6, // +60% verified improvement!
};
