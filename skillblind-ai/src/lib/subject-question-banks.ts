import { QuizQuestion, Subject, Topic, ConceptDependency, StudyMaterial } from "@/types";

export interface SubjectBundle {
  subject: Subject;
  topics: Topic[];
  dependencies: ConceptDependency[];
  materials: StudyMaterial[];
  questions: QuizQuestion[];
}

export const ALL_SUBJECTS: Subject[] = [
  {
    id: "subj-dsa-101",
    user_id: "demo-user-101",
    name: "Data Structures and Algorithms",
    code: "CS201",
    description: "Algorithmic complexity, recursion, linear and non-linear data structures, trees, graphs, and dynamic programming.",
    color: "#2563eb",
    created_at: "2026-10-01T09:00:00Z",
  },
  {
    id: "subj-dbms-102",
    user_id: "demo-user-101",
    name: "Database Management Systems",
    code: "CS301",
    description: "Relational algebra, normalization (1NF-BCNF), ACID transaction management, indexing (B+ Trees), and query optimization.",
    color: "#059669",
    created_at: "2026-10-01T09:00:00Z",
  },
  {
    id: "subj-os-103",
    user_id: "demo-user-101",
    name: "Operating Systems",
    code: "CS302",
    description: "Process synchronization, CPU scheduling, virtual memory paging, deadlock detection, and file system architecture.",
    color: "#d97706",
    created_at: "2026-10-01T09:00:00Z",
  },
  {
    id: "subj-cn-104",
    user_id: "demo-user-101",
    name: "Computer Networks",
    code: "CS401",
    description: "OSI and TCP/IP protocol stacks, sliding window flow control, routing algorithms (OSPF, BGP), and transport protocols.",
    color: "#7c3aed",
    created_at: "2026-10-01T09:00:00Z",
  },
  {
    id: "subj-ml-105",
    user_id: "demo-user-101",
    name: "Machine Learning & AI",
    code: "CS501",
    description: "Supervised and unsupervised models, bias-variance tradeoff, gradient descent optimization, and neural architectures.",
    color: "#dc2626",
    created_at: "2026-10-01T09:00:00Z",
  },
];

// ==========================================
// 1. DATA STRUCTURES & ALGORITHMS (20 Questions)
// ==========================================
export const DSA_TOPICS: Topic[] = [
  { id: "top-dsa-rec", subject_id: "subj-dsa-101", name: "Recursion & Call Stacks", difficulty_level: "intermediate", order_index: 1, created_at: "2026-10-01T09:00:00Z" },
  { id: "top-dsa-arr", subject_id: "subj-dsa-101", name: "Arrays & Two Pointers", difficulty_level: "beginner", order_index: 2, created_at: "2026-10-01T09:00:00Z" },
  { id: "top-dsa-ll", subject_id: "subj-dsa-101", name: "Linked Lists & Pointers", difficulty_level: "intermediate", order_index: 3, created_at: "2026-10-01T09:00:00Z" },
  { id: "top-dsa-stk", subject_id: "subj-dsa-101", name: "Stacks & Queues", difficulty_level: "beginner", order_index: 4, created_at: "2026-10-01T09:00:00Z" },
  { id: "top-dsa-tree", subject_id: "subj-dsa-101", name: "Binary Trees & BST", difficulty_level: "intermediate", order_index: 5, created_at: "2026-10-01T09:00:00Z" },
  { id: "top-dsa-heap", subject_id: "subj-dsa-101", name: "Heaps & Priority Queues", difficulty_level: "intermediate", order_index: 6, created_at: "2026-10-01T09:00:00Z" },
  { id: "top-dsa-hash", subject_id: "subj-dsa-101", name: "Hash Tables & Collisions", difficulty_level: "beginner", order_index: 7, created_at: "2026-10-01T09:00:00Z" },
  { id: "top-dsa-graph", subject_id: "subj-dsa-101", name: "Graph BFS & DFS", difficulty_level: "advanced", order_index: 8, created_at: "2026-10-01T09:00:00Z" },
  { id: "top-dsa-dp", subject_id: "subj-dsa-101", name: "Dynamic Programming", difficulty_level: "advanced", order_index: 9, created_at: "2026-10-01T09:00:00Z" },
  { id: "top-dsa-sort", subject_id: "subj-dsa-101", name: "Sorting & Search Algorithms", difficulty_level: "intermediate", order_index: 10, created_at: "2026-10-01T09:00:00Z" },
];

export const DSA_QUESTIONS: QuizQuestion[] = [
  {
    id: "q-dsa-01",
    topic_id: "top-dsa-rec",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "In a recursive function int f(int n) { if (n <= 1) return 1; return n * f(n - 1); }, what critical issue occurs if the line 'if (n <= 1) return 1;' is deleted?",
    options: [
      "The program enters an infinite recursion loop until the OS terminates it with a CallStackOverflow exception",
      "The function automatically returns 0 for negative values",
      "The compiler flags a syntax error at compile time",
      "The function converts itself into an iterative loop automatically"
    ],
    correct_answer: "The program enters an infinite recursion loop until the OS terminates it with a CallStackOverflow exception",
    explanation: "Without a base case, recursive calls push activation records onto the call stack indefinitely until available stack memory is exhausted.",
    source_chunk_ids: ["chk-01"],
    citations: [{ source_title: "Chapter 3: Recursion and Call Stack Mechanics.pdf", page_number: 3, excerpt: "Without a strictly verified base case, execution leads to runtime CallStackExceeded exception." }]
  },
  {
    id: "q-dsa-02",
    topic_id: "top-dsa-rec",
    question_type: "short_answer",
    difficulty: "hard",
    question_text: "Describe the behavior of stack frames during the 'unwinding phase' of recursion when a leaf null node is encountered in depth-first search.",
    correct_answer: "During unwinding, the topmost stack frame is popped off the call stack, restoring the parent caller's local variables and program counter to execute subsequent lines.",
    explanation: "Activation records are popped in LIFO order; the return value propagates back up to the caller function.",
    scoring_rubric: { required_keywords: ["pop", "stack frame", "unwinding", "caller", "activation record"], partial_credit_threshold: 0.5 },
    source_chunk_ids: ["chk-02"],
    citations: [{ source_title: "Chapter 3: Recursion and Call Stack Mechanics.pdf", page_number: 7, excerpt: "When reaching the base case, return values are propagated back up during the unwinding phase." }]
  },
  {
    id: "q-dsa-03",
    topic_id: "top-dsa-tree",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "Given a valid Binary Search Tree (BST), which traversal produces the keys in strictly ascending sorted order?",
    options: ["Inorder (Left, Root, Right)", "Preorder (Root, Left, Right)", "Postorder (Left, Right, Root)", "Level Order (BFS)"],
    correct_answer: "Inorder (Left, Root, Right)",
    explanation: "In a BST, all keys in the left subtree are smaller than root and right subtree keys are greater. Inorder traversal (Left-Root-Right) prints them in monotonic ascending order.",
    source_chunk_ids: ["chk-04"],
    citations: [{ source_title: "Chapter 5: Binary Trees & Tree Traversals.pdf", page_number: 18, excerpt: "An Inorder traversal of a valid BST always visits elements in strictly ascending sorted order." }]
  },
  {
    id: "q-dsa-04",
    topic_id: "top-dsa-tree",
    question_type: "scenario_based",
    difficulty: "hard",
    question_text: "A student implements a recursive function to compute tree height. For any tree with height > 1, the program crashes with Segmentation Fault. They wrote: int height(Node* root) { return 1 + max(height(root->left), height(root->right)); }. What is missing?",
    options: [
      "Base condition check: if (root == nullptr) return 0;",
      "Memory allocation with malloc for every recursive invocation",
      "Swapping root->left and root->right calls",
      "Using a queue instead of recursion"
    ],
    correct_answer: "Base condition check: if (root == nullptr) return 0;",
    explanation: "When reaching leaf nodes, their left and right pointers are nullptr. Attempting to dereference root->left on nullptr without a guard causes an immediate segmentation fault.",
    source_chunk_ids: ["chk-03"],
    citations: [{ source_title: "Chapter 5: Binary Trees & Tree Traversals.pdf", page_number: 12, excerpt: "If the base condition (node == null) is evaluated incorrectly, traversal visits invalid memory." }]
  },
  {
    id: "q-dsa-05",
    topic_id: "top-dsa-tree",
    question_type: "true_false",
    difficulty: "easy",
    question_text: "In a valid Binary Search Tree with unique elements, the maximum value is always located at the rightmost descendant node.",
    options: ["True", "False"],
    correct_answer: "True",
    explanation: "Because right children are always greater than their ancestors in a BST, following right pointers until reaching a node without a right child yields the maximum element.",
    source_chunk_ids: ["chk-04"],
    citations: [{ source_title: "Chapter 5: Binary Trees & Tree Traversals.pdf", page_number: 19, excerpt: "Maximum key in a BST resides at the extreme right terminal node." }]
  },
  {
    id: "q-dsa-06",
    topic_id: "top-dsa-sort",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "What is the worst-case time complexity of standard QuickSort when the pivot is always chosen as the first element on an already sorted array?",
    options: ["O(N^2)", "O(N log N)", "O(N)", "O(log N)"],
    correct_answer: "O(N^2)",
    explanation: "If the array is already sorted and the pivot is the first element, partitions are maximally unbalanced (0 and N-1 elements), resulting in N recursive levels each taking O(N) work, yielding O(N^2).",
    source_chunk_ids: ["chk-01"],
    citations: [{ source_title: "CS201 Official Syllabus & Course Outline.pdf", page_number: 4, excerpt: "Unbalanced partition choices degrade QuickSort to O(N^2) quadratic runtime." }]
  },
  {
    id: "q-dsa-07",
    topic_id: "top-dsa-ll",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "In Floyd's Cycle Detection Algorithm for linked lists (Tortoise and Hare), what are the step rates of the two pointers?",
    options: [
      "Slow advances 1 node per iteration, fast advances 2 nodes per iteration",
      "Slow advances 2 nodes, fast advances 4 nodes",
      "Both pointers advance 1 node from opposite ends of the list",
      "Slow pointer remains at head while fast pointer traverses the entire list"
    ],
    correct_answer: "Slow advances 1 node per iteration, fast advances 2 nodes per iteration",
    explanation: "Floyd's algorithm uses two pointers: slow moves by 1 node, fast moves by 2 nodes. If a cycle exists, the distance between them decreases by 1 in each step until they meet.",
    source_chunk_ids: ["chk-01"],
    citations: [{ source_title: "CS201 Official Syllabus & Course Outline.pdf", page_number: 3, excerpt: "Cycle detection using Floyd's two-pointer algorithm operates in O(N) time and O(1) space." }]
  },
  {
    id: "q-dsa-08",
    topic_id: "top-dsa-stk",
    question_type: "multiple_choice",
    difficulty: "easy",
    question_text: "Which data structure follows the Last-In First-Out (LIFO) protocol?",
    options: ["Stack", "Queue", "Binary Heap", "Hash Table"],
    correct_answer: "Stack",
    explanation: "A Stack enforces LIFO semantics: the most recently pushed element is the first one popped.",
    source_chunk_ids: ["chk-01"],
    citations: [{ source_title: "Chapter 3: Recursion and Call Stack Mechanics.pdf", page_number: 2, excerpt: "Stacks operate strictly under Last-In First-Out (LIFO) order." }]
  },
  {
    id: "q-dsa-09",
    topic_id: "top-dsa-graph",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "Which graph traversal algorithm guarantees finding the shortest path (in terms of minimum number of edges) in an unweighted graph?",
    options: ["Breadth-First Search (BFS)", "Depth-First Search (DFS)", "Inorder Traversal", "Topological Sort"],
    correct_answer: "Breadth-First Search (BFS)",
    explanation: "BFS explores vertices level by level using a queue, guaranteeing that the first time a target vertex is visited, it is along the path with the fewest edges.",
    source_chunk_ids: ["chk-01"],
    citations: [{ source_title: "CS201 Official Syllabus & Course Outline.pdf", page_number: 5, excerpt: "BFS on unweighted graphs discovers minimum edge distance in O(V + E) time." }]
  },
  {
    id: "q-dsa-10",
    topic_id: "top-dsa-graph",
    question_type: "scenario_based",
    difficulty: "hard",
    question_text: "In Dijkstra's algorithm for single-source shortest paths, why does the presence of negative-weight edges cause the algorithm to produce incorrect results?",
    options: [
      "The greedy assumption that a visited vertex's distance is permanently finalized is violated if a subsequent negative edge yields a shorter path",
      "Negative weights cause heap index errors in the priority queue",
      "Dijkstra only functions on undirected trees",
      "Division by zero occurs in distance relaxation"
    ],
    correct_answer: "The greedy assumption that a visited vertex's distance is permanently finalized is violated if a subsequent negative edge yields a shorter path",
    explanation: "Dijkstra is a greedy algorithm that finalizes distances upon extraction from the priority queue. A negative weight edge could later reduce the distance of an already-finalized vertex, breaking the greedy invariant.",
    source_chunk_ids: ["chk-01"],
    citations: [{ source_title: "CS201 Official Syllabus & Course Outline.pdf", page_number: 5, excerpt: "Dijkstra requires all edge weights to be non-negative (w(u, v) >= 0)." }]
  },
  {
    id: "q-dsa-11",
    topic_id: "top-dsa-dp",
    question_type: "multiple_choice",
    difficulty: "hard",
    question_text: "What are the two foundational properties required for a problem to be solvable via Dynamic Programming?",
    options: [
      "Optimal Substructure and Overlapping Subproblems",
      "Greedy Choice Property and Divide-and-Conquer",
      "Linear Independence and Matrix Symmetry",
      "Monotonicity and Constant Memory"
    ],
    correct_answer: "Optimal Substructure and Overlapping Subproblems",
    explanation: "Optimal substructure means an optimal solution contains optimal solutions to subproblems. Overlapping subproblems means subproblems are revisited repeatedly, making memoization/tabulation effective.",
    source_chunk_ids: ["chk-01"],
    citations: [{ source_title: "CS201 Official Syllabus & Course Outline.pdf", page_number: 6, excerpt: "Dynamic programming applies strictly when problems demonstrate optimal substructure and overlapping subproblems." }]
  },
  {
    id: "q-dsa-12",
    topic_id: "top-dsa-dp",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "What is the primary difference between Memoization and Tabulation in Dynamic Programming?",
    options: [
      "Memoization is top-down (recursive with cache), while Tabulation is bottom-up (iterative table filling)",
      "Memoization operates in O(1) space, while Tabulation requires O(N!) space",
      "Tabulation cannot solve shortest path problems",
      "Memoization does not store previously computed results"
    ],
    correct_answer: "Memoization is top-down (recursive with cache), while Tabulation is bottom-up (iterative table filling)",
    explanation: "Memoization follows a top-down recursive breakdown saving results in a hash table or array, while Tabulation starts from the base cases and iteratively builds the solution table.",
    source_chunk_ids: ["chk-01"],
    citations: [{ source_title: "CS201 Official Syllabus & Course Outline.pdf", page_number: 6, excerpt: "Memoization (top-down) versus Tabulation (bottom-up) represents the dual paradigms of DP." }]
  },
  {
    id: "q-dsa-13",
    topic_id: "top-dsa-hash",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "In separate chaining for hash collision resolution, what happens to the worst-case lookup time if all N keys hash to the exact same bucket?",
    options: ["O(N)", "O(1)", "O(log N)", "O(N log N)"],
    correct_answer: "O(N)",
    explanation: "If all N keys map to the same bucket, the bucket's linked list contains N elements, degrading search to a linear scan of O(N).",
    source_chunk_ids: ["chk-01"],
    citations: [{ source_title: "CS201 Official Syllabus & Course Outline.pdf", page_number: 3, excerpt: "Hash table worst-case degenerates to O(N) when hash collisions concentrate in a single bucket." }]
  },
  {
    id: "q-dsa-14",
    topic_id: "top-dsa-heap",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "In a Max-Heap represented as an array where the root is at index 0, what is the formula for the left child of node at index i?",
    options: ["2 * i + 1", "2 * i + 2", "i / 2", "2 * i"],
    correct_answer: "2 * i + 1",
    explanation: "For a 0-indexed binary heap array, node i has left child at 2i + 1, right child at 2i + 2, and parent at floor((i - 1) / 2).",
    source_chunk_ids: ["chk-01"],
    citations: [{ source_title: "CS201 Official Syllabus & Course Outline.pdf", page_number: 4, excerpt: "Array-based binary heap indexing: left = 2i + 1, right = 2i + 2." }]
  },
  {
    id: "q-dsa-15",
    topic_id: "top-dsa-sort",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "Why is MergeSort generally preferred over QuickSort for sorting linked lists?",
    options: [
      "MergeSort does not require random access indexing and can merge linked list nodes in-place with O(1) auxiliary space",
      "MergeSort has O(log N) worst case time complexity",
      "QuickSort cannot operate on pointers",
      "MergeSort requires fewer comparisons than binary search"
    ],
    correct_answer: "MergeSort does not require random access indexing and can merge linked list nodes in-place with O(1) auxiliary space",
    explanation: "Linked lists allow O(1) pointer updates without contiguous memory shifting. MergeSort only requires sequential access, making it ideally matched to linked lists.",
    source_chunk_ids: ["chk-01"],
    citations: [{ source_title: "CS201 Official Syllabus & Course Outline.pdf", page_number: 4, excerpt: "MergeSort achieves optimal performance on linked structures due to sequential access patterns." }]
  },
  {
    id: "q-dsa-16",
    topic_id: "top-dsa-tree",
    question_type: "multiple_choice",
    difficulty: "hard",
    question_text: "In an AVL Tree, what is the maximum permissible difference between the heights of the left and right subtrees of any node?",
    options: ["1", "0", "2", "log N"],
    correct_answer: "1",
    explanation: "The AVL balance factor invariant requires |height(left) - height(right)| <= 1 for every node in the tree.",
    source_chunk_ids: ["chk-04"],
    citations: [{ source_title: "Chapter 5: Binary Trees & Tree Traversals.pdf", page_number: 22, excerpt: "AVL balance factor must remain strictly in the range {-1, 0, +1}." }]
  },
  {
    id: "q-dsa-17",
    topic_id: "top-dsa-graph",
    question_type: "multiple_choice",
    difficulty: "hard",
    question_text: "What condition is required for a graph to possess a valid Topological Sort?",
    options: [
      "It must be a Directed Acyclic Graph (DAG)",
      "It must be an undirected bipartite graph",
      "It must be completely connected with no cut vertices",
      "It must contain an Eulerian circuit"
    ],
    correct_answer: "It must be a Directed Acyclic Graph (DAG)",
    explanation: "Topological sorting arranges vertices linearly such that for every directed edge u -> v, u appears before v. Cycles make this ordering impossible; hence the graph must be a DAG.",
    source_chunk_ids: ["chk-01"],
    citations: [{ source_title: "CS201 Official Syllabus & Course Outline.pdf", page_number: 5, excerpt: "Topological sorting is strictly defined for Directed Acyclic Graphs (DAGs)." }]
  },
  {
    id: "q-dsa-18",
    topic_id: "top-dsa-sort",
    question_type: "multiple_choice",
    difficulty: "easy",
    question_text: "Binary Search requires which precondition to be satisfied on the input array?",
    options: [
      "The array elements must be sorted in monotonic order",
      "The array size must be an exact power of 2",
      "The array elements must all be distinct positive integers",
      "The array must be implemented as a linked list"
    ],
    correct_answer: "The array elements must be sorted in monotonic order",
    explanation: "Binary search eliminates half the search space at each comparison by comparing the target with the midpoint, which strictly requires sorted order.",
    source_chunk_ids: ["chk-01"],
    citations: [{ source_title: "CS201 Official Syllabus & Course Outline.pdf", page_number: 2, excerpt: "Binary search precondition: elements must be arranged in sorted sequence." }]
  },
  {
    id: "q-dsa-19",
    topic_id: "top-dsa-arr",
    question_type: "scenario_based",
    difficulty: "medium",
    question_text: "To remove duplicates from a sorted array in-place with O(1) extra memory, which algorithmic paradigm is most optimal?",
    options: [
      "Two Pointers (slow reader, fast scanner)",
      "Depth-First Search recursion",
      "Converting to a Min-Heap",
      "Matrix transposition"
    ],
    correct_answer: "Two Pointers (slow reader, fast scanner)",
    explanation: "A slow write pointer and a fast read pointer can traverse the sorted array in O(N) time and O(1) auxiliary space, copying unique elements forward.",
    source_chunk_ids: ["chk-01"],
    citations: [{ source_title: "CS201 Official Syllabus & Course Outline.pdf", page_number: 2, excerpt: "Two-pointer techniques achieve in-place linear manipulation on sorted sequences." }]
  },
  {
    id: "q-dsa-20",
    topic_id: "top-dsa-tree",
    question_type: "short_answer",
    difficulty: "hard",
    question_text: "Explain why Inorder traversal alone is insufficient to uniquely reconstruct an arbitrary binary tree, and state what additional traversal is required.",
    correct_answer: "Inorder provides left-root-right relationships but does not reveal which element is the root. Pairing Inorder with either Preorder or Postorder uniquely identifies the root at each step.",
    explanation: "Preorder or Postorder gives the root node directly (first or last element). Finding that root in the Inorder sequence then splits the left and right subtrees.",
    scoring_rubric: { required_keywords: ["root", "Preorder", "Postorder", "subtree", "unique"], partial_credit_threshold: 0.5 },
    source_chunk_ids: ["chk-03", "chk-04"],
    citations: [{ source_title: "Chapter 5: Binary Trees & Tree Traversals.pdf", page_number: 16, excerpt: "Reconstruction of a binary tree requires Inorder traversal paired with either Preorder or Postorder." }]
  },
];

// ==========================================
// 2. DATABASE MANAGEMENT SYSTEMS (20 Questions)
// ==========================================
export const DBMS_TOPICS: Topic[] = [
  { id: "top-dbms-acid", subject_id: "subj-dbms-102", name: "ACID Transactions & Concurrency", difficulty_level: "intermediate", order_index: 1, created_at: "2026-10-01T09:00:00Z" },
  { id: "top-dbms-norm", subject_id: "subj-dbms-102", name: "Relational Normalization (1NF-BCNF)", difficulty_level: "advanced", order_index: 2, created_at: "2026-10-01T09:00:00Z" },
  { id: "top-dbms-idx", subject_id: "subj-dbms-102", name: "Indexing & B+ Tree Structures", difficulty_level: "intermediate", order_index: 3, created_at: "2026-10-01T09:00:00Z" },
  { id: "top-dbms-sql", subject_id: "subj-dbms-102", name: "SQL Query Execution & Joins", difficulty_level: "intermediate", order_index: 4, created_at: "2026-10-01T09:00:00Z" },
  { id: "top-dbms-rec", subject_id: "subj-dbms-102", name: "Crash Recovery & Write-Ahead Logs", difficulty_level: "advanced", order_index: 5, created_at: "2026-10-01T09:00:00Z" },
];

export const DBMS_QUESTIONS: QuizQuestion[] = [
  {
    id: "q-dbms-01",
    topic_id: "top-dbms-acid",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "In the ACID properties of database transactions, what does 'Atomicity' guarantee?",
    options: [
      "All operations in a transaction execute completely, or none of them execute (all-or-nothing)",
      "Transactions produce the same outcome as if executed serially",
      "Committed data survives system crashes and power failures",
      "Data conforms to all integrity constraints and foreign keys"
    ],
    correct_answer: "All operations in a transaction execute completely, or none of them execute (all-or-nothing)",
    explanation: "Atomicity ensures that a transaction is treated as a single indivisible unit of work.",
    source_chunk_ids: [],
    citations: [{ source_title: "Database System Concepts (Silberschatz)", page_number: 620, excerpt: "Atomicity: Either all operations of the transaction are reflected properly in the database, or none are." }]
  },
  {
    id: "q-dbms-02",
    topic_id: "top-dbms-norm",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "A relational table is in Second Normal Form (2NF) if and only if it is in 1NF and what additional condition is satisfied?",
    options: [
      "Every non-prime attribute is fully functionally dependent on the entire primary key (no partial dependencies)",
      "No non-prime attribute depends transitively on the primary key",
      "Every determinant is a candidate key",
      "All multi-valued dependencies are eliminated"
    ],
    correct_answer: "Every non-prime attribute is fully functionally dependent on the entire primary key (no partial dependencies)",
    explanation: "2NF eliminates partial dependencies where an attribute depends on only a portion of a composite primary key.",
    source_chunk_ids: [],
    citations: [{ source_title: "Fundamentals of Database Systems (Elmasri)", page_number: 485, excerpt: "2NF requires the absence of partial dependencies on any candidate key." }]
  },
  {
    id: "q-dbms-03",
    topic_id: "top-dbms-norm",
    question_type: "multiple_choice",
    difficulty: "hard",
    question_text: "What type of dependency is specifically prohibited by Third Normal Form (3NF)?",
    options: ["Transitive Dependency (X -> Y and Y -> Z where Z is non-prime)", "Partial Dependency on composite key", "Trivial functional dependency", "Reflexive dependency"],
    correct_answer: "Transitive Dependency (X -> Y and Y -> Z where Z is non-prime)",
    explanation: "3NF requires that no non-prime attribute depends transitively on the primary key via another non-prime attribute.",
    source_chunk_ids: [],
    citations: [{ source_title: "Fundamentals of Database Systems", page_number: 490, excerpt: "3NF disallows transitive dependencies between non-prime attributes." }]
  },
  {
    id: "q-dbms-04",
    topic_id: "top-dbms-norm",
    question_type: "multiple_choice",
    difficulty: "hard",
    question_text: "What makes Boyce-Codd Normal Form (BCNF) strictly stronger than 3NF?",
    options: [
      "In BCNF, for every functional dependency X -> Y, X must be a superkey",
      "BCNF permits partial dependencies on composite keys",
      "BCNF allows multi-valued dependencies",
      "BCNF does not require 1NF"
    ],
    correct_answer: "In BCNF, for every functional dependency X -> Y, X must be a superkey",
    explanation: "3NF allows X -> A if A is a prime attribute even if X is not a superkey; BCNF removes this exception.",
    source_chunk_ids: [],
    citations: [{ source_title: "Database System Concepts", page_number: 312, excerpt: "A relation is in BCNF if every determinant in non-trivial dependencies is a superkey." }]
  },
  {
    id: "q-dbms-05",
    topic_id: "top-dbms-idx",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "Why are B+ Trees preferred over standard B-Trees for database indexing and range scans?",
    options: [
      "All data pointers reside exclusively in the leaf nodes, which are linked sequentially for efficient range queries",
      "B+ Trees have O(1) worst-case search complexity",
      "B+ Trees require zero disk I/O operations",
      "B+ Trees only support integer keys"
    ],
    correct_answer: "All data pointers reside exclusively in the leaf nodes, which are linked sequentially for efficient range queries",
    explanation: "In B+ Trees, internal nodes only store routing keys, allowing higher fan-out. Leaf nodes form a linked list, enabling fast sequential range scans.",
    source_chunk_ids: [],
    citations: [{ source_title: "Database System Concepts", page_number: 450, excerpt: "B+ tree leaves are doubly linked, enabling high performance contiguous range searches." }]
  },
  {
    id: "q-dbms-06",
    topic_id: "top-dbms-idx",
    question_type: "true_false",
    difficulty: "easy",
    question_text: "A database table can possess multiple Clustered Indexes simultaneously.",
    options: ["True", "False"],
    correct_answer: "False",
    explanation: "A clustered index physically sorts the actual data rows on disk. Since data rows can only be stored in one physical order, there can be at most one clustered index per table.",
    source_chunk_ids: [],
    citations: [{ source_title: "Database System Concepts", page_number: 442, excerpt: "Only one clustered index is possible because data records can have only one physical sequence on disk." }]
  },
  {
    id: "q-dbms-07",
    topic_id: "top-dbms-acid",
    question_type: "multiple_choice",
    difficulty: "hard",
    question_text: "Under SQL transaction isolation levels, what concurrency phenomenon occurs when Transaction A reads a range of rows, Transaction B inserts a new row matching that range, and Transaction A re-reads and discovers the new row?",
    options: ["Phantom Read", "Dirty Read", "Non-Repeatable Read", "Lost Update"],
    correct_answer: "Phantom Read",
    explanation: "A phantom read occurs when rows that satisfy a search condition appear in a subsequent query within the same transaction due to a concurrent commit.",
    source_chunk_ids: [],
    citations: [{ source_title: "Database System Concepts", page_number: 645, excerpt: "Phantom phenomena occur when concurrent insertions alter range query cardinality." }]
  },
  {
    id: "q-dbms-08",
    topic_id: "top-dbms-acid",
    question_type: "scenario_based",
    difficulty: "hard",
    question_text: "Two transactions hold locks: T1 holds exclusive lock on Record X and requests Record Y. T2 holds exclusive lock on Record Y and requests Record X. Neither can proceed. What is this state and how does the engine detect it?",
    options: [
      "Deadlock; detected by cycles in the Wait-For Graph",
      "Starvation; detected by CPU utilization counters",
      "Cache thrashing; detected by memory page faults",
      "Dirty read anomaly; detected by parity bits"
    ],
    correct_answer: "Deadlock; detected by cycles in the Wait-For Graph",
    explanation: "This is a mutual dependency deadlock. The DBMS constructs a directed Wait-For Graph where vertices represent transactions; a directed cycle indicates deadlock.",
    source_chunk_ids: [],
    citations: [{ source_title: "Database System Concepts", page_number: 678, excerpt: "A cycle in a Wait-For Graph represents an active deadlock between waiting transactions." }]
  },
  {
    id: "q-dbms-09",
    topic_id: "top-dbms-acid",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "What does the Two-Phase Locking (2PL) protocol guarantee?",
    options: [
      "Conflict Serializability of transaction execution schedules",
      "Zero deadlocks under all workloads",
      "Immediate commit without disk writes",
      "Elimination of all foreign key constraints"
    ],
    correct_answer: "Conflict Serializability of transaction execution schedules",
    explanation: "Basic 2PL (growing phase where locks are acquired, shrinking phase where locks are released) guarantees conflict serializable schedules, though it does not prevent deadlocks.",
    source_chunk_ids: [],
    citations: [{ source_title: "Database System Concepts", page_number: 670, excerpt: "Two-Phase Locking (2PL) guarantees conflict serializability for concurrent transactions." }]
  },
  {
    id: "q-dbms-10",
    topic_id: "top-dbms-sql",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "What is the logical execution order of clauses in an SQL query containing SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY?",
    options: [
      "FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY",
      "SELECT -> FROM -> WHERE -> GROUP BY -> HAVING -> ORDER BY",
      "FROM -> SELECT -> WHERE -> ORDER BY -> GROUP BY -> HAVING",
      "WHERE -> FROM -> GROUP BY -> SELECT -> HAVING -> ORDER BY"
    ],
    correct_answer: "FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY",
    explanation: "SQL logical query processing starts by evaluating tables (FROM), filtering rows (WHERE), grouping (GROUP BY), filtering groups (HAVING), projecting columns (SELECT), and sorting (ORDER BY).",
    source_chunk_ids: [],
    citations: [{ source_title: "SQL Query Performance Tuning", page_number: 55, excerpt: "Logical query processing order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY." }]
  },
  {
    id: "q-dbms-11",
    topic_id: "top-dbms-rec",
    question_type: "multiple_choice",
    difficulty: "hard",
    question_text: "What is the fundamental rule of the Write-Ahead Logging (WAL) protocol?",
    options: [
      "Log records describing changes must be flushed to non-volatile storage before corresponding dirty database pages are written to disk",
      "Database pages must be written to disk before log records are generated",
      "Logs are written only upon system shutdown",
      "Logs must be encrypted with public key infrastructure"
    ],
    correct_answer: "Log records describing changes must be flushed to non-volatile storage before corresponding dirty database pages are written to disk",
    explanation: "WAL guarantees durability and atomicity by ensuring that undo/redo log records reach disk prior to any in-place page modification on disk.",
    source_chunk_ids: [],
    citations: [{ source_title: "Database System Concepts", page_number: 720, excerpt: "Write-Ahead Logging ensures log records reach stable storage before data pages are flushed." }]
  },
  {
    id: "q-dbms-12",
    topic_id: "top-dbms-rec",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "In database recovery, what is the purpose of Checkpointing?",
    options: [
      "To bound the volume of log records that must be scanned and reprocessed during recovery after a system crash",
      "To permanently disable foreign key checks",
      "To encrypt table partitions",
      "To generate automated primary keys"
    ],
    correct_answer: "To bound the volume of log records that must be scanned and reprocessed during recovery after a system crash",
    explanation: "Checkpointing flushes dirty buffer pages to disk and records a safe mark in the log, avoiding the need to replay logs from the beginning of time.",
    source_chunk_ids: [],
    citations: [{ source_title: "Database System Concepts", page_number: 725, excerpt: "Checkpoints bound the search window in log records during crash recovery." }]
  },
  {
    id: "q-dbms-13",
    topic_id: "top-dbms-sql",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "What is the key difference between a Primary Key and a Unique constraint in SQL?",
    options: [
      "Primary Key columns disallow NULL values entirely, whereas Unique constraint columns can accept NULL values (subject to DBMS NULL rules)",
      "Unique constraints can only be applied to numerical columns",
      "Primary keys cannot be referenced by foreign keys",
      "A table can have multiple primary keys"
    ],
    correct_answer: "Primary Key columns disallow NULL values entirely, whereas Unique constraint columns can accept NULL values (subject to DBMS NULL rules)",
    explanation: "Primary Keys mandate uniqueness and NOT NULL. Unique constraints enforce uniqueness across non-null entries.",
    source_chunk_ids: [],
    citations: [{ source_title: "Fundamentals of Database Systems", page_number: 88, excerpt: "Primary keys enforce NOT NULL implicitly; unique constraints permit NULL entries." }]
  },
  {
    id: "q-dbms-14",
    topic_id: "top-dbms-sql",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "What does the ON DELETE CASCADE option on a Foreign Key definition enforce?",
    options: [
      "When a parent table row is deleted, all referencing child rows are automatically deleted as well",
      "The deletion is aborted and raises an error",
      "The foreign key is converted into a primary key",
      "The entire database schema is deleted"
    ],
    correct_answer: "When a parent table row is deleted, all referencing child rows are automatically deleted as well",
    explanation: "CASCADE ensures referential integrity by automatically propagating parent row deletions down to dependent child rows.",
    source_chunk_ids: [],
    citations: [{ source_title: "Database System Concepts", page_number: 110, excerpt: "ON DELETE CASCADE propagates parent tuple deletion across foreign key links." }]
  },
  {
    id: "q-dbms-15",
    topic_id: "top-dbms-sql",
    question_type: "scenario_based",
    difficulty: "hard",
    question_text: "A database query joins Table A (10 million rows) and Table B (500 rows) on equality of ID with no indexes. Which physical join algorithm is the query optimizer most likely to select for optimal throughput?",
    options: [
      "Hash Join (building an in-memory hash table on the smaller Table B, then streaming Table A)",
      "Nested Loop Join without index (5 billion comparison scans)",
      "Cartesian Cross Join",
      "Random Sample Join"
    ],
    correct_answer: "Hash Join (building an in-memory hash table on the smaller Table B, then streaming Table A)",
    explanation: "When one relation fits in memory and join condition is equi-join, Hash Join builds a hash table on the small relation in O(M) and probes with the large relation in O(N).",
    source_chunk_ids: [],
    citations: [{ source_title: "Database System Concepts", page_number: 530, excerpt: "Hash Join is optimal for unindexed equi-joins where build relation fits in memory." }]
  },
  {
    id: "q-dbms-16",
    topic_id: "top-dbms-acid",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "Which transaction isolation level completely prevents Dirty Reads, Non-Repeatable Reads, and Phantom Reads?",
    options: ["Serializable", "Repeatable Read", "Read Committed", "Read Uncommitted"],
    correct_answer: "Serializable",
    explanation: "Serializable is the highest ANSI SQL isolation level, preventing all dirty reads, fuzzy reads, and phantom tuples.",
    source_chunk_ids: [],
    citations: [{ source_title: "Database System Concepts", page_number: 648, excerpt: "Serializable isolation guarantees full isolation from dirty, non-repeatable, and phantom reads." }]
  },
  {
    id: "q-dbms-17",
    topic_id: "top-dbms-norm",
    question_type: "short_answer",
    difficulty: "hard",
    question_text: "Explain the difference between Lossless Join Decomposition and Dependency Preserving Decomposition in database normalization.",
    correct_answer: "Lossless join decomposition guarantees that reconstructing the original table via natural join yields exactly the original rows without spurious tuples. Dependency preservation ensures every functional dependency can be verified using individual decomposed tables without joins.",
    explanation: "Both are desirable: Lossless join prevents data corruption, while dependency preservation allows constraint checking without expensive multi-table joins.",
    scoring_rubric: { required_keywords: ["spurious tuples", "natural join", "functional dependency", "reconstruction"], partial_credit_threshold: 0.5 },
    source_chunk_ids: [],
    citations: [{ source_title: "Database System Concepts", page_number: 335, excerpt: "Lossless join avoids spurious tuples; dependency preservation verifies FDs locally." }]
  },
  {
    id: "q-dbms-18",
    topic_id: "top-dbms-idx",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "Why can creating too many indexes on a database table impair overall system performance?",
    options: [
      "Every INSERT, UPDATE, and DELETE operation must update every index on the table, increasing write latency and storage overhead",
      "Indexes cause queries to randomly return incorrect results",
      "Indexes reduce network bandwidth to zero",
      "Indexes disable the SQL query optimizer"
    ],
    correct_answer: "Every INSERT, UPDATE, and DELETE operation must update every index on the table, increasing write latency and storage overhead",
    explanation: "Indexes speed up read queries but impose a direct write penalty because each modification requires updating multiple index B+ trees and logging.",
    source_chunk_ids: [],
    citations: [{ source_title: "Database System Concepts", page_number: 440, excerpt: "Index maintenance overhead increases logarithmically with every added index during write workloads." }]
  },
  {
    id: "q-dbms-19",
    topic_id: "top-dbms-sql",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "What is the operational distinction between WHERE and HAVING in SQL?",
    options: [
      "WHERE filters individual rows prior to aggregation, while HAVING filters grouped rows after aggregation functions (e.g. COUNT, SUM) execute",
      "HAVING can only be used with primary keys",
      "WHERE can evaluate aggregate functions like AVG() directly",
      "WHERE and HAVING are completely identical in functionality"
    ],
    correct_answer: "WHERE filters individual rows prior to aggregation, while HAVING filters grouped rows after aggregation functions (e.g. COUNT, SUM) execute",
    explanation: "WHERE filters rows before GROUP BY. HAVING filters aggregated group metrics calculated by aggregation functions.",
    source_chunk_ids: [],
    citations: [{ source_title: "Fundamentals of Database Systems", page_number: 140, excerpt: "WHERE applies to individual tuples; HAVING applies to summary group records." }]
  },
  {
    id: "q-dbms-20",
    topic_id: "top-dbms-acid",
    question_type: "multiple_choice",
    difficulty: "hard",
    question_text: "According to the CAP Theorem in distributed databases, in the presence of a Network Partition (P), which trade-off must a system make?",
    options: [
      "Choose between Consistency (C) and Availability (A)",
      "Choose between Atomicity and Durability",
      "Choose between Encryption and Indexing",
      "Choose between SQL and NoSQL"
    ],
    correct_answer: "Choose between Consistency (C) and Availability (A)",
    explanation: "When network partitions occur between distributed nodes, a system can either remain consistent (rejecting writes that cannot be synced) or available (accepting writes with stale reads).",
    source_chunk_ids: [],
    citations: [{ source_title: "Designing Data-Intensive Applications (Kleppmann)", page_number: 334, excerpt: "The CAP theorem forces a choice between Consistency and Availability during network partitions." }]
  },
];

// ==========================================
// 3. OPERATING SYSTEMS (20 Questions)
// ==========================================
export const OS_TOPICS: Topic[] = [
  { id: "top-os-proc", subject_id: "subj-os-103", name: "Process & Thread Scheduling", difficulty_level: "intermediate", order_index: 1, created_at: "2026-10-01T09:00:00Z" },
  { id: "top-os-sync", subject_id: "subj-os-103", name: "Synchronization & Semaphores", difficulty_level: "advanced", order_index: 2, created_at: "2026-10-01T09:00:00Z" },
  { id: "top-os-dl", subject_id: "subj-os-103", name: "Deadlocks & Banker's Algorithm", difficulty_level: "advanced", order_index: 3, created_at: "2026-10-01T09:00:00Z" },
  { id: "top-os-vm", subject_id: "subj-os-103", name: "Virtual Memory & Page Replacement", difficulty_level: "intermediate", order_index: 4, created_at: "2026-10-01T09:00:00Z" },
  { id: "top-os-fs", subject_id: "subj-os-103", name: "File Systems & Storage I/O", difficulty_level: "intermediate", order_index: 5, created_at: "2026-10-01T09:00:00Z" },
];

export const OS_QUESTIONS: QuizQuestion[] = [
  {
    id: "q-os-01",
    topic_id: "top-os-proc",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "What is the primary difference in memory sharing between processes and threads within the same process?",
    options: [
      "Threads share the same address space, heap, and open files, but possess private stacks and program counters",
      "Processes share the same stack, while threads allocate separate address spaces",
      "Threads cannot communicate with one another",
      "Processes have identical memory limits regardless of OS architecture"
    ],
    correct_answer: "Threads share the same address space, heap, and open files, but possess private stacks and program counters",
    explanation: "Threads of a process share code, data, heap, and OS resources, but maintain individual execution contexts (registers, PC, stack).",
    source_chunk_ids: [],
    citations: [{ source_title: "Operating System Concepts (Silberschatz)", page_number: 162, excerpt: "Threads within a process share address space, heap, and files, with dedicated stack and registers." }]
  },
  {
    id: "q-os-02",
    topic_id: "top-os-proc",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "What hardware and software actions constitute a CPU 'Context Switch' between two processes?",
    options: [
      "Saving the state (registers, PC, memory pointers) of the running process into its Process Control Block (PCB) and loading the state of the scheduled process",
      "Reformatting the hard drive swap space",
      "Terminating all child processes",
      "Flushing the BIOS NVRAM"
    ],
    correct_answer: "Saving the state (registers, PC, memory pointers) of the running process into its Process Control Block (PCB) and loading the state of the scheduled process",
    explanation: "A context switch preserves the current execution state in the PCB and restores another process's state to achieve multitasking.",
    source_chunk_ids: [],
    citations: [{ source_title: "Operating System Concepts", page_number: 112, excerpt: "Context switching saves execution state in the current PCB and loads the next PCB." }]
  },
  {
    id: "q-os-03",
    topic_id: "top-os-proc",
    question_type: "scenario_based",
    difficulty: "hard",
    question_text: "In Round Robin CPU scheduling, what is the consequence of selecting a Time Quantum that is extremely large relative to process burst times?",
    options: [
      "Round Robin degenerates into First-Come First-Served (FCFS) scheduling",
      "Context switching overhead exceeds 90% of CPU time",
      "Processes starve indefinitely",
      "Deadlock occurs on all I/O channels"
    ],
    correct_answer: "Round Robin degenerates into First-Come First-Served (FCFS) scheduling",
    explanation: "If the time quantum is larger than any burst, every process runs to completion before preempting, matching FCFS behavior.",
    source_chunk_ids: [],
    citations: [{ source_title: "Operating System Concepts", page_number: 275, excerpt: "If time quantum q is extremely large, RR scheduling policy degenerates into FCFS." }]
  },
  {
    id: "q-os-04",
    topic_id: "top-os-sync",
    question_type: "multiple_choice",
    difficulty: "hard",
    question_text: "Which three requirements must any valid solution to the Critical Section problem satisfy?",
    options: [
      "Mutual Exclusion, Progress, and Bounded Waiting",
      "Atomicity, Consistency, and Durability",
      "Paging, Segmentation, and Compaction",
      "FIFO, LRU, and Optimal Replacement"
    ],
    correct_answer: "Mutual Exclusion, Progress, and Bounded Waiting",
    explanation: "Mutual Exclusion (only one in critical section), Progress (selection of next entrant cannot be postponed indefinitely), Bounded Waiting (limit on waits).",
    source_chunk_ids: [],
    citations: [{ source_title: "Operating System Concepts", page_number: 260, excerpt: "Critical section solutions must guarantee Mutual Exclusion, Progress, and Bounded Waiting." }]
  },
  {
    id: "q-os-05",
    topic_id: "top-os-sync",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "What is the operational behavior of Dijkstra's Semaphore wait() [P()] and signal() [V()] operations on integer S?",
    options: [
      "wait() decrements S and blocks if S < 0; signal() increments S and wakes a waiting process",
      "wait() increments S; signal() terminates the process",
      "Both wait() and signal() reset S to zero",
      "wait() causes a kernel panic if S == 0"
    ],
    correct_answer: "wait() decrements S and blocks if S < 0; signal() increments S and wakes a waiting process",
    explanation: "Atomic wait() decrements count and suspends if unavailable. signal() increments count and notifies sleeping threads.",
    source_chunk_ids: [],
    citations: [{ source_title: "Operating System Concepts", page_number: 270, excerpt: "wait() decrements the semaphore atomically; signal() increments and unblocks." }]
  },
  {
    id: "q-os-06",
    topic_id: "top-os-dl",
    question_type: "multiple_choice",
    difficulty: "hard",
    question_text: "Which of the following are the four necessary Coffman conditions that must hold simultaneously for a Deadlock to occur?",
    options: [
      "Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait",
      "Atomicity, Consistency, Isolation, and Durability",
      "Read, Write, Execute, and Delete",
      "Paging, Swapping, Thrashing, and Overheating"
    ],
    correct_answer: "Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait",
    explanation: "Deadlock can only arise if all 4 conditions coexist. Breaking any single condition prevents deadlock.",
    source_chunk_ids: [],
    citations: [{ source_title: "Operating System Concepts", page_number: 318, excerpt: "Coffman deadlock conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait." }]
  },
  {
    id: "q-os-07",
    topic_id: "top-os-dl",
    question_type: "scenario_based",
    difficulty: "hard",
    question_text: "In Banker's Algorithm for deadlock avoidance, a system state is formally declared 'Safe' if what condition is met?",
    options: [
      "There exists at least one safe sequence <P1, P2, ... Pn> in which all processes can obtain maximum resources and terminate",
      "All resources currently have zero allocated processes",
      "No process has requested more than 1 MB of memory",
      "The system CPU utilization is below 50%"
    ],
    correct_answer: "There exists at least one safe sequence <P1, P2, ... Pn> in which all processes can obtain maximum resources and terminate",
    explanation: "A safe state guarantees that even if all processes request their declared maximum claims, they can execute in some safe order without deadlocking.",
    source_chunk_ids: [],
    citations: [{ source_title: "Operating System Concepts", page_number: 330, excerpt: "A state is safe if there exists a safe sequence of resource allocation without entering deadlock." }]
  },
  {
    id: "q-os-08",
    topic_id: "top-os-vm",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "What is a 'Page Fault' in an operating system with demand paging?",
    options: [
      "A hardware interrupt triggered when a program attempts to access a page of memory whose Valid bit in the page table is 0 (not loaded in physical RAM)",
      "A physical hardware failure in the DRAM chip",
      "An invalid pointer write to kernel memory",
      "A disk sector corruption error"
    ],
    correct_answer: "A hardware interrupt triggered when a program attempts to access a page of memory whose Valid bit in the page table is 0 (not loaded in physical RAM)",
    explanation: "A page fault traps to the OS kernel to fetch the missing page from backing disk swap into an available physical frame and update the page table.",
    source_chunk_ids: [],
    citations: [{ source_title: "Operating System Concepts", page_number: 400, excerpt: "Access to an invalid page entry triggers a page-fault trap into the operating system." }]
  },
  {
    id: "q-os-09",
    topic_id: "top-os-vm",
    question_type: "multiple_choice",
    difficulty: "hard",
    question_text: "What phenomenon is referred to as 'Belady's Anomaly' in page replacement algorithms?",
    options: [
      "In FIFO page replacement, allocating more physical page frames can paradoxically increase the total number of page faults for certain reference strings",
      "LRU page replacement causes memory fragmentation",
      "Optimal page replacement requires infinite hardware memory",
      "Virtual address translation slows down as process size shrinks"
    ],
    correct_answer: "In FIFO page replacement, allocating more physical page frames can paradoxically increase the total number of page faults for certain reference strings",
    explanation: "Belady discovered that under FIFO, increasing frames does not strictly decrease page faults, unlike stack algorithms such as LRU.",
    source_chunk_ids: [],
    citations: [{ source_title: "Operating System Concepts", page_number: 412, excerpt: "Belady's anomaly: FIFO page replacement fault rate may increase as allocated frames increase." }]
  },
  {
    id: "q-os-10",
    topic_id: "top-os-vm",
    question_type: "scenario_based",
    difficulty: "hard",
    question_text: "What causes 'Thrashing' in virtual memory systems, and how can the operating system resolve it?",
    options: [
      "A process spends more time paging in/out pages from disk than executing instructions; resolved by suspending processes using the Working Set Model",
      "DRAM overheating due to bus frequency; resolved by lowering clock speeds",
      "Deadlock between GPU and CPU; resolved by rebooting",
      "Excessive network packet loss on loopback interface"
    ],
    correct_answer: "A process spends more time paging in/out pages from disk than executing instructions; resolved by suspending processes using the Working Set Model",
    explanation: "When sum of working sets exceeds physical frames, the system thrashes. The OS must decrease the degree of multiprogramming by swapping out processes.",
    source_chunk_ids: [],
    citations: [{ source_title: "Operating System Concepts", page_number: 425, excerpt: "Thrashing occurs when active working sets exceed physical memory capacity." }]
  },
  {
    id: "q-os-11",
    topic_id: "top-os-vm",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "What role does the Translation Lookaside Buffer (TLB) play in memory management units?",
    options: [
      "An on-chip associative cache that stores recent virtual-to-physical page translations to avoid multi-level page table memory lookups",
      "A backup disk drive for swap space",
      "A buffer that encrypts network packets",
      "A register that stores the process ID"
    ],
    correct_answer: "An on-chip associative cache that stores recent virtual-to-physical page translations to avoid multi-level page table memory lookups",
    explanation: "TLB cache hits resolve virtual addresses in 1 CPU cycle, avoiding 2-4 DRAM accesses for multi-level page tables.",
    source_chunk_ids: [],
    citations: [{ source_title: "Operating System Concepts", page_number: 370, excerpt: "The TLB is a high-speed hardware cache for virtual-to-physical address translations." }]
  },
  {
    id: "q-os-12",
    topic_id: "top-os-vm",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "What is the distinction between Internal and External Fragmentation in memory allocation?",
    options: [
      "Internal fragmentation is unused space within an allocated fixed block; External fragmentation is unallocated space scattered between blocks too small to satisfy requests",
      "Internal fragmentation affects hard disks, external fragmentation affects RAM",
      "External fragmentation only occurs in paging systems",
      "Internal fragmentation can be eliminated via compaction"
    ],
    correct_answer: "Internal fragmentation is unused space within an allocated fixed block; External fragmentation is unallocated space scattered between blocks too small to satisfy requests",
    explanation: "Paging exhibits internal fragmentation in the last page frame. Variable-size segmentation causes external fragmentation between allocated regions.",
    source_chunk_ids: [],
    citations: [{ source_title: "Operating System Concepts", page_number: 362, excerpt: "Internal fragmentation: wasted space inside allocated units. External fragmentation: unallocated memory scattered across address space." }]
  },
  {
    id: "q-os-13",
    topic_id: "top-os-proc",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "How does a standard user program switch execution privilege into Kernel Mode to perform an I/O operation?",
    options: [
      "By triggering a software interrupt (System Call / Trap instruction)",
      "By directly modifying the CPU privilege bit in user space",
      "By overclocking the memory bus",
      "By writing to the physical hard drive directly"
    ],
    correct_answer: "By triggering a software interrupt (System Call / Trap instruction)",
    explanation: "Hardware prevents user mode code from accessing I/O directly. A trap/syscall shifts CPU privilege mode and vectors into the kernel's syscall dispatch table.",
    source_chunk_ids: [],
    citations: [{ source_title: "Operating System Concepts", page_number: 60, excerpt: "System calls invoke software interrupts (traps) that transfer control safely to kernel mode." }]
  },
  {
    id: "q-os-14",
    topic_id: "top-os-fs",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "In UNIX-like file systems, what metadata does an Inode (index node) store?",
    options: [
      "File permissions, owner, size, timestamps, and pointers to data blocks (excluding the file's filename)",
      "The filename and the user password",
      "The entire binary content of the file",
      "The physical sector track coordinates of the CPU"
    ],
    correct_answer: "File permissions, owner, size, timestamps, and pointers to data blocks (excluding the file's filename)",
    explanation: "Filenames are stored in directory tables mapping name -> inode number. The inode itself stores file metadata and direct/indirect block pointers.",
    source_chunk_ids: [],
    citations: [{ source_title: "Operating System Concepts", page_number: 485, excerpt: "Inodes store file attributes and block pointers; directory entries map names to inode numbers." }]
  },
  {
    id: "q-os-15",
    topic_id: "top-os-proc",
    question_type: "multiple_choice",
    difficulty: "hard",
    question_text: "In UNIX fork() system call, what is the Copy-on-Write (COW) optimization?",
    options: [
      "Parent and child processes share the same physical memory pages read-only until one attempts a write, at which point a private page copy is allocated",
      "All memory is copied immediately byte-for-byte upon fork() invocation",
      "Child processes are banned from modifying file systems",
      "Writes are deferred until process exit"
    ],
    correct_answer: "Parent and child processes share the same physical memory pages read-only until one attempts a write, at which point a private page copy is allocated",
    explanation: "COW prevents copying millions of memory pages when fork() is immediately followed by exec(), only duplicating pages that are actually mutated.",
    source_chunk_ids: [],
    citations: [{ source_title: "Operating System Concepts", page_number: 395, excerpt: "Copy-on-write defers page duplication until either process writes to a shared page." }]
  },
  {
    id: "q-os-16",
    topic_id: "top-os-sync",
    question_type: "multiple_choice",
    difficulty: "hard",
    question_text: "In the classic Producer-Consumer problem with a bounded buffer of size N, what semaphores are required to prevent race conditions and buffer overflow/underflow?",
    options: [
      "A binary mutex for buffer access, a counting semaphore 'empty' initialized to N, and a counting semaphore 'full' initialized to 0",
      "A single integer counter",
      "Two boolean flags without atomic operations",
      "A time-delay sleep timer"
    ],
    correct_answer: "A binary mutex for buffer access, a counting semaphore 'empty' initialized to N, and a counting semaphore 'full' initialized to 0",
    explanation: "empty tracks free slots (starts at N), full tracks available items (starts at 0), and mutex ensures mutual exclusion on buffer mutation.",
    source_chunk_ids: [],
    citations: [{ source_title: "Operating System Concepts", page_number: 280, excerpt: "Bounded buffer requires empty semaphore (N), full semaphore (0), and mutual exclusion lock." }]
  },
  {
    id: "q-os-17",
    topic_id: "top-os-proc",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "What is 'Starvation' in CPU scheduling, and which scheduling algorithm is especially vulnerable to it?",
    options: [
      "Indefinite blocking of low-priority or long processes; common in Shortest Job First (SJF) and strict Priority Scheduling",
      "Depletion of power from the laptop battery",
      "Failure of RAM memory refresh cycles",
      "Round Robin with small time quantums"
    ],
    correct_answer: "Indefinite blocking of low-priority or long processes; common in Shortest Job First (SJF) and strict Priority Scheduling",
    explanation: "If short or high-priority jobs continually arrive, long or low-priority processes may never be granted CPU time. Aging resolves starvation.",
    source_chunk_ids: [],
    citations: [{ source_title: "Operating System Concepts", page_number: 272, excerpt: "Starvation occurs when ready processes wait indefinitely; SJF can starve long bursts." }]
  },
  {
    id: "q-os-18",
    topic_id: "top-os-fs",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "In disk scheduling algorithms, how does SCAN (Elevator Algorithm) navigate disk tracks?",
    options: [
      "The disk arm moves in one direction servicing requests until reaching the end of the disk, then reverses direction",
      "It randomly selects sectors to equalize spindle wear",
      "It always services the request with the highest track number first",
      "It stays stationary on track 0"
    ],
    correct_answer: "The disk arm moves in one direction servicing requests until reaching the end of the disk, then reverses direction",
    explanation: "SCAN moves from one end toward the other servicing cylinders on the path, reversing at the boundary like an elevator.",
    source_chunk_ids: [],
    citations: [{ source_title: "Operating System Concepts", page_number: 520, excerpt: "The SCAN algorithm services requests while sweeping across cylinders in alternating directions." }]
  },
  {
    id: "q-os-19",
    topic_id: "top-os-sync",
    question_type: "short_answer",
    difficulty: "hard",
    question_text: "Define Priority Inversion and describe how Priority Inheritance protocol prevents it.",
    correct_answer: "Priority Inversion occurs when a high-priority task is blocked waiting for a lock held by a low-priority task, while an intermediate-priority task preempts the low-priority task. Priority Inheritance temporarily elevates the low-priority lock-holder's priority to match the high-priority task until the lock is released.",
    explanation: "Priority inheritance ensures the low-priority process finishes its critical section promptly without being preempted by middle-priority tasks.",
    scoring_rubric: { required_keywords: ["Priority Inversion", "high-priority", "low-priority", "preemption", "elevation", "inheritance"], partial_credit_threshold: 0.5 },
    source_chunk_ids: [],
    citations: [{ source_title: "Operating System Concepts", page_number: 295, excerpt: "Priority inheritance temporarily boosts lower priority lock-holders to prevent unbounded inversion." }]
  },
  {
    id: "q-os-20",
    topic_id: "top-os-proc",
    question_type: "true_false",
    difficulty: "easy",
    question_text: "A Zombie Process in UNIX is a child process that has completed execution but remains in the process table because its parent has not yet executed wait() to read its exit status.",
    options: ["True", "False"],
    correct_answer: "True",
    explanation: "Until the parent reaps the child using wait() or waitpid(), the child's entry in the process table is retained as a zombie.",
    source_chunk_ids: [],
    citations: [{ source_title: "Operating System Concepts", page_number: 125, excerpt: "A process that has terminated but whose parent has not yet called wait() is known as a zombie." }]
  },
];

// ==========================================
// 4. COMPUTER NETWORKS (20 Questions)
// ==========================================
export const CN_TOPICS: Topic[] = [
  { id: "top-cn-osi", subject_id: "subj-cn-104", name: "OSI & TCP/IP Layer Architectures", difficulty_level: "beginner", order_index: 1, created_at: "2026-10-01T09:00:00Z" },
  { id: "top-cn-tcp", subject_id: "subj-cn-104", name: "TCP Protocol, Handshakes & Congestion", difficulty_level: "advanced", order_index: 2, created_at: "2026-10-01T09:00:00Z" },
  { id: "top-cn-ip", subject_id: "subj-cn-104", name: "IP Addressing, CIDR & Subnetting", difficulty_level: "intermediate", order_index: 3, created_at: "2026-10-01T09:00:00Z" },
  { id: "top-cn-rout", subject_id: "subj-cn-104", name: "Routing Protocols (OSPF, BGP)", difficulty_level: "advanced", order_index: 4, created_at: "2026-10-01T09:00:00Z" },
  { id: "top-cn-app", subject_id: "subj-cn-104", name: "Application Protocols & Security (DNS, TLS)", difficulty_level: "intermediate", order_index: 5, created_at: "2026-10-01T09:00:00Z" },
];

export const CN_QUESTIONS: QuizQuestion[] = [
  {
    id: "q-cn-01",
    topic_id: "top-cn-osi",
    question_type: "multiple_choice",
    difficulty: "easy",
    question_text: "Which layer of the OSI 7-layer model is responsible for end-to-end reliable transmission, port addressing, and error recovery?",
    options: ["Transport Layer (Layer 4)", "Network Layer (Layer 3)", "Data Link Layer (Layer 2)", "Session Layer (Layer 5)"],
    correct_answer: "Transport Layer (Layer 4)",
    explanation: "Layer 4 (Transport, e.g. TCP) provides process-to-process communication, port multiplexing, and end-to-end reliability.",
    source_chunk_ids: [],
    citations: [{ source_title: "Computer Networking: A Top-Down Approach (Kurose)", page_number: 45, excerpt: "The Transport Layer provides logical communication between application processes on different hosts." }]
  },
  {
    id: "q-cn-02",
    topic_id: "top-cn-tcp",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "What sequence of packets establishes a standard TCP connection in the 3-Way Handshake?",
    options: [
      "SYN -> SYN-ACK -> ACK",
      "SYN -> ACK -> DATA",
      "ACK -> SYN -> SYN-ACK",
      "PING -> PONG -> CONNECT"
    ],
    correct_answer: "SYN -> SYN-ACK -> ACK",
    explanation: "Client sends SYN(seq=x); server responds with SYN(seq=y), ACK(x+1); client confirms with ACK(y+1).",
    source_chunk_ids: [],
    citations: [{ source_title: "Computer Networking: A Top-Down Approach", page_number: 250, excerpt: "TCP connection establishment utilizes a three-way handshake: SYN, SYN-ACK, ACK." }]
  },
  {
    id: "q-cn-03",
    topic_id: "top-cn-tcp",
    question_type: "scenario_based",
    difficulty: "hard",
    question_text: "What is the key functional difference between TCP Flow Control and TCP Congestion Control?",
    options: [
      "Flow Control prevents the sender from overwhelming the receiver's buffer; Congestion Control prevents the sender from overwhelming network routers and links",
      "Flow Control operates on UDP; Congestion Control operates on IP",
      "Flow Control encrypts payload; Congestion Control sets IP TTL",
      "There is no difference; they are identical mechanisms"
    ],
    correct_answer: "Flow Control prevents the sender from overwhelming the receiver's buffer; Congestion Control prevents the sender from overwhelming network routers and links",
    explanation: "Flow control uses receiver advertised window (rwnd). Congestion control uses congestion window (cwnd) computed via AIMD and loss signals.",
    source_chunk_ids: [],
    citations: [{ source_title: "Computer Networking: A Top-Down Approach", page_number: 260, excerpt: "Flow control protects the receiver's buffer; congestion control protects the shared network infrastructure." }]
  },
  {
    id: "q-cn-04",
    topic_id: "top-cn-ip",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "For the CIDR IPv4 subnet 192.168.10.0/26, how many total usable host IP addresses are available?",
    options: ["62", "64", "126", "30"],
    correct_answer: "62",
    explanation: "A /26 mask has 32 - 26 = 6 host bits, giving 2^6 = 64 total addresses. Subtracting 2 (network address and broadcast address) leaves 62 usable host addresses.",
    source_chunk_ids: [],
    citations: [{ source_title: "Computer Networks (Tanenbaum)", page_number: 375, excerpt: "Usable hosts in a CIDR block equals 2^(32 - prefix) - 2." }]
  },
  {
    id: "q-cn-05",
    topic_id: "top-cn-ip",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "What is the purpose of the Address Resolution Protocol (ARP)?",
    options: [
      "To resolve a known IP address to its corresponding physical hardware MAC address on a local area network",
      "To translate domain names into IP addresses",
      "To dynamically assign IP addresses to new clients",
      "To route packets across Autonomous Systems"
    ],
    correct_answer: "To resolve a known IP address to its corresponding physical hardware MAC address on a local area network",
    explanation: "ARP operates between Layer 2 and Layer 3, broadcasting a query for an IP address to learn its Link Layer MAC address.",
    source_chunk_ids: [],
    citations: [{ source_title: "Computer Networking: A Top-Down Approach", page_number: 460, excerpt: "ARP resolves Layer 3 IP addresses to Layer 2 physical MAC addresses on local broadcast segments." }]
  },
  {
    id: "q-cn-06",
    topic_id: "top-cn-app",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "What four messages comprise the DORA process in DHCP address allocation?",
    options: [
      "Discover, Offer, Request, Acknowledge",
      "Dial, Open, Receive, Accept",
      "Detect, Order, Route, Authenticate",
      "Define, Output, Repeat, Abort"
    ],
    correct_answer: "Discover, Offer, Request, Acknowledge",
    explanation: "DHCP client broadcasts Discover; server offers IP with Offer; client requests with Request; server finalizes lease with Acknowledge.",
    source_chunk_ids: [],
    citations: [{ source_title: "Computer Networking: A Top-Down Approach", page_number: 355, excerpt: "DHCP address lease follows the 4-step DORA exchange." }]
  },
  {
    id: "q-cn-07",
    topic_id: "top-cn-app",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "In DNS (Domain Name System), what type of resource record maps a hostname directly to an IPv4 address?",
    options: ["A Record", "AAAA Record", "CNAME Record", "MX Record"],
    correct_answer: "A Record",
    explanation: "A records map hostnames to 32-bit IPv4 addresses. AAAA records map hostnames to 128-bit IPv6 addresses.",
    source_chunk_ids: [],
    citations: [{ source_title: "Computer Networking: A Top-Down Approach", page_number: 140, excerpt: "An 'A' record maps a canonical hostname to its corresponding IPv4 address." }]
  },
  {
    id: "q-cn-08",
    topic_id: "top-cn-tcp",
    question_type: "scenario_based",
    difficulty: "hard",
    question_text: "In a SYN Flood Denial-of-Service attack, how does the attacker exhaust server resources and what defense solves it?",
    options: [
      "Attacker sends endless SYN packets without completing the handshake, filling the SYN backlog queue; mitigated by SYN Cookies",
      "Attacker floods bandwidth with ICMP packets; mitigated by increasing MTU",
      "Attacker cracks the TLS private key; mitigated by AES-256",
      "Attacker alters ARP tables; mitigated by static IP assignments"
    ],
    correct_answer: "Attacker sends endless SYN packets without completing the handshake, filling the SYN backlog queue; mitigated by SYN Cookies",
    explanation: "SYN cookies encode connection state into the initial sequence number, eliminating the need to allocate server memory until the final ACK arrives.",
    source_chunk_ids: [],
    citations: [{ source_title: "Computer Networking: A Top-Down Approach", page_number: 255, excerpt: "SYN cookies defend against state exhaustion by encoding connection parameters into sequence numbers." }]
  },
  {
    id: "q-cn-09",
    topic_id: "top-cn-rout",
    question_type: "multiple_choice",
    difficulty: "hard",
    question_text: "Which routing algorithm algorithmizes Link-State routing in protocols such as OSPF?",
    options: ["Dijkstra's Shortest Path Algorithm", "Bellman-Ford Algorithm", "Floyd-Warshall Algorithm", "Kruskal's Minimum Spanning Tree"],
    correct_answer: "Dijkstra's Shortest Path Algorithm",
    explanation: "OSPF uses link-state advertisements (LSAs) flooded to all nodes; each router executes Dijkstra's algorithm to compute shortest path trees.",
    source_chunk_ids: [],
    citations: [{ source_title: "Computer Networking: A Top-Down Approach", page_number: 380, excerpt: "OSPF employs Dijkstra's algorithm to compute minimum cost paths across link-state databases." }]
  },
  {
    id: "q-cn-10",
    topic_id: "top-cn-rout",
    question_type: "multiple_choice",
    difficulty: "hard",
    question_text: "What major flaw in Distance Vector routing protocols (e.g., RIP) causes routing loops, and what technique mitigates it?",
    options: [
      "Count-to-Infinity problem; mitigated by Split Horizon with Poison Reverse",
      "Buffer overflow; mitigated by TCP sliding windows",
      "Packet fragmentation; mitigated by Path MTU discovery",
      "MAC collision; mitigated by CSMA/CD"
    ],
    correct_answer: "Count-to-Infinity problem; mitigated by Split Horizon with Poison Reverse",
    explanation: "When a link fails, distance-vector updates propagate slowly, causing routers to increment metrics toward infinity. Split Horizon prevents reporting a route back to its origin.",
    source_chunk_ids: [],
    citations: [{ source_title: "Computer Networks", page_number: 415, excerpt: "The count-to-infinity problem in distance vector routing is counteracted by split horizon and poison reverse." }]
  },
  {
    id: "q-cn-11",
    topic_id: "top-cn-rout",
    question_type: "multiple_choice",
    difficulty: "hard",
    question_text: "Why is Border Gateway Protocol (BGP) classified as a Path-Vector protocol rather than a standard Distance-Vector protocol?",
    options: [
      "BGP route advertisements include the entire sequence of Autonomous System (AS) numbers traversing the route, enabling loop detection",
      "BGP runs exclusively on Layer 2 switches",
      "BGP does not use TCP for transport",
      "BGP only supports IPv6"
    ],
    correct_answer: "BGP route advertisements include the entire sequence of Autonomous System (AS) numbers traversing the route, enabling loop detection",
    explanation: "BGP includes the AS-PATH attribute. If a router sees its own AS in the path vector, it immediately rejects the advertisement to prevent loops.",
    source_chunk_ids: [],
    citations: [{ source_title: "Computer Networking: A Top-Down Approach", page_number: 405, excerpt: "BGP path vector lists every autonomous system along the route to guarantee loop avoidance." }]
  },
  {
    id: "q-cn-12",
    topic_id: "top-cn-tcp",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "Why does UDP have lower latency and lower overhead than TCP?",
    options: [
      "UDP is connectionless with an 8-byte header and performs no handshakes, acknowledgments, retransmissions, or reordering",
      "UDP runs in kernel ring 0 while TCP runs in user space",
      "UDP uses optical fiber routing while TCP uses copper wires",
      "UDP packets cannot be dropped by routers"
    ],
    correct_answer: "UDP is connectionless with an 8-byte header and performs no handshakes, acknowledgments, retransmissions, or reordering",
    explanation: "UDP sends datagrams without state setup or delivery guarantees, making it ideal for real-time gaming, audio, and DNS lookups.",
    source_chunk_ids: [],
    citations: [{ source_title: "Computer Networking: A Top-Down Approach", page_number: 215, excerpt: "UDP provides best-effort connectionless delivery with minimal 8-byte header overhead." }]
  },
  {
    id: "q-cn-13",
    topic_id: "top-cn-ip",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "What is the purpose of Network Address Translation (NAT) in IPv4 networks?",
    options: [
      "To map multiple private RFC 1918 IP addresses onto a single public IPv4 address using port multiplexing (NAPT/PAT)",
      "To convert ASCII text into binary streams",
      "To assign MAC addresses to network interfaces",
      "To encrypt Wi-Fi radio transmissions"
    ],
    correct_answer: "To map multiple private RFC 1918 IP addresses onto a single public IPv4 address using port multiplexing (NAPT/PAT)",
    explanation: "NAT mitigates IPv4 address exhaustion by letting entire private LANs share a single globally routable public address.",
    source_chunk_ids: [],
    citations: [{ source_title: "Computer Networking: A Top-Down Approach", page_number: 360, excerpt: "NAT translates private IP space into globally registered addresses using dynamic port mappings." }]
  },
  {
    id: "q-cn-14",
    topic_id: "top-cn-app",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "What major performance limitation of HTTP/1.1 does HTTP/2 overcome using Multiplexing?",
    options: [
      "Head-of-Line (HoL) blocking at the application layer over a single TCP connection",
      "Inability to transmit images",
      "Lack of SSL encryption",
      "Requirement for UDP hardware"
    ],
    correct_answer: "Head-of-Line (HoL) blocking at the application layer over a single TCP connection",
    explanation: "HTTP/1.1 pipelining suffered HoL blocking if a response was delayed. HTTP/2 interleaves binary frames for multiple requests on a single connection.",
    source_chunk_ids: [],
    citations: [{ source_title: "Computer Networking: A Top-Down Approach", page_number: 120, excerpt: "HTTP/2 binary framing multiplexes multiple concurrent streams across a shared TCP link." }]
  },
  {
    id: "q-cn-15",
    topic_id: "top-cn-app",
    question_type: "multiple_choice",
    difficulty: "hard",
    question_text: "In the TLS (Transport Layer Security) handshake, what is the role of asymmetric encryption versus symmetric encryption?",
    options: [
      "Asymmetric encryption is used during the initial handshake to authenticate the server and securely exchange a symmetric session key; symmetric encryption then encrypts bulk data",
      "Symmetric encryption authenticates certificates; asymmetric encryption encrypts bulk data",
      "Asymmetric encryption is used for UDP; symmetric encryption is used for TCP",
      "Both algorithms are executed simultaneously on every byte of traffic"
    ],
    correct_answer: "Asymmetric encryption is used during the initial handshake to authenticate the server and securely exchange a symmetric session key; symmetric encryption then encrypts bulk data",
    explanation: "Asymmetric cryptography (RSA/ECDH) is computationally expensive, so it is used only to negotiate a shared secret. Fast symmetric ciphers (AES-GCM) encrypt the data payload.",
    source_chunk_ids: [],
    citations: [{ source_title: "Computer Networking: A Top-Down Approach", page_number: 620, excerpt: "TLS leverages asymmetric public-key cryptography for key exchange and symmetric ciphers for payload encryption." }]
  },
  {
    id: "q-cn-16",
    topic_id: "top-cn-osi",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "In Ethernet networks (IEEE 802.3), how does CSMA/CD handle media access and packet collisions?",
    options: [
      "Carrier Sense (listen before talk), Multiple Access (shared medium), Collision Detection (abort upon collision and wait a random exponential backoff interval)",
      "Tokens are passed sequentially between hosts in a ring",
      "Packets are sent on predefined frequency time slots (TDMA)",
      "Collisions are ignored because Ethernet is lossless"
    ],
    correct_answer: "Carrier Sense (listen before talk), Multiple Access (shared medium), Collision Detection (abort upon collision and wait a random exponential backoff interval)",
    explanation: "If two transmitters detect collision simultaneously, both emit a jam signal, abort transmission, and back off according to binary exponential backoff.",
    source_chunk_ids: [],
    citations: [{ source_title: "Computer Networks", page_number: 290, excerpt: "CSMA/CD listens before transmitting and executes truncated binary exponential backoff upon collision." }]
  },
  {
    id: "q-cn-17",
    topic_id: "top-cn-ip",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "What happens when an IP packet larger than the Maximum Transmission Unit (MTU) arrives at a router and the 'Don't Fragment' (DF) flag is set to 1?",
    options: [
      "The router drops the packet and transmits an ICMP 'Destination Unreachable - Fragmentation Needed' message back to the source",
      "The router fragments the packet anyway",
      "The router compresses the payload without loss",
      "The packet is converted into a UDP broadcast"
    ],
    correct_answer: "The router drops the packet and transmits an ICMP 'Destination Unreachable - Fragmentation Needed' message back to the source",
    explanation: "This ICMP response forms the core mechanism of Path MTU Discovery (PMTUD), enabling endpoints to calibrate optimal packet sizes.",
    source_chunk_ids: [],
    citations: [{ source_title: "Computer Networking: A Top-Down Approach", page_number: 345, excerpt: "If DF=1 and packet > MTU, routers drop the packet and signal ICMP Type 3 Code 4." }]
  },
  {
    id: "q-cn-18",
    topic_id: "top-cn-tcp",
    question_type: "multiple_choice",
    difficulty: "medium",
    question_text: "What is the function of the TCP TIME-WAIT state following connection termination?",
    options: [
      "To ensure the final ACK was received by the remote peer and to allow lingering delayed duplicate segments from the connection to expire in the network",
      "To charge the client's network billing meter",
      "To wait for DNS cache to refresh",
      "To re-establish the connection automatically"
    ],
    correct_answer: "To ensure the final ACK was received by the remote peer and to allow lingering delayed duplicate segments from the connection to expire in the network",
    explanation: "TIME-WAIT lasts 2 * MSL (Maximum Segment Lifetime), ensuring delayed packets do not corrupt subsequent new connections on the same port tuple.",
    source_chunk_ids: [],
    citations: [{ source_title: "TCP/IP Illustrated (Stevens)", page_number: 242, excerpt: "TIME-WAIT state persists for 2MSL to drain lingering packets and guarantee clean termination." }]
  },
  {
    id: "q-cn-19",
    topic_id: "top-cn-app",
    question_type: "short_answer",
    difficulty: "hard",
    question_text: "Explain how DNS Recursive Resolution works when a client requests an uncached domain like 'exam.university.edu'.",
    correct_answer: "The client queries its local DNS resolver. The resolver iteratively contacts: (1) Root DNS Server for the .edu TLD servers, (2) .edu TLD server for university.edu authoritative nameservers, (3) university.edu authoritative server for the A record of 'exam', which is returned and cached.",
    explanation: "Hierarchical delegation allows distributed scaling across Root -> TLD -> Authoritative nameservers.",
    scoring_rubric: { required_keywords: ["resolver", "Root", "TLD", "Authoritative", "cache", "iterative"], partial_credit_threshold: 0.5 },
    source_chunk_ids: [],
    citations: [{ source_title: "Computer Networking: A Top-Down Approach", page_number: 145, excerpt: "Recursive DNS resolution queries Root, TLD, and Authoritative hierarchy sequentially." }]
  },
  {
    id: "q-cn-20",
    topic_id: "top-cn-osi",
    question_type: "true_false",
    difficulty: "easy",
    question_text: "A Layer 2 Network Switch inspects IP packet headers to make forwarding decisions.",
    options: ["True", "False"],
    correct_answer: "False",
    explanation: "Layer 2 switches forward Ethernet frames based strictly on MAC address tables. Layer 3 routers inspect IP packet headers.",
    source_chunk_ids: [],
    citations: [{ source_title: "Computer Networks", page_number: 310, excerpt: "Layer 2 switches operate exclusively on Link Layer MAC addresses." }]
  },
];

// ==========================================
// CONCEPT DEPENDENCY DEFINITIONS
// ==========================================
export const DSA_DEPENDENCIES: ConceptDependency[] = [
  {
    id: "dep-dsa-01",
    subject_id: "subj-dsa-101",
    prerequisite_topic_id: "top-dsa-arr",
    dependent_topic_id: "top-dsa-ll",
    relationship_type: "strict_prerequisite",
    confidence: 0.96,
    source_evidence: "Pointer mechanics and linked dynamic memory build upon array index concepts.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
  {
    id: "dep-dsa-02",
    subject_id: "subj-dsa-101",
    prerequisite_topic_id: "top-dsa-ll",
    dependent_topic_id: "top-dsa-stk",
    relationship_type: "strict_prerequisite",
    confidence: 0.94,
    source_evidence: "LIFO Stacks and FIFO Queues are implemented via dynamic linked list nodes.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
  {
    id: "dep-dsa-03",
    subject_id: "subj-dsa-101",
    prerequisite_topic_id: "top-dsa-stk",
    dependent_topic_id: "top-dsa-rec",
    relationship_type: "strict_prerequisite",
    confidence: 0.98,
    source_evidence: "Understanding call stack activation records requires LIFO stack mechanics.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
  {
    id: "dep-dsa-04",
    subject_id: "subj-dsa-101",
    prerequisite_topic_id: "top-dsa-rec",
    dependent_topic_id: "top-dsa-tree",
    relationship_type: "strict_prerequisite",
    confidence: 0.97,
    source_evidence: "Tree depth-first traversals are formulated recursively via subtree decompositions.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
  {
    id: "dep-dsa-05",
    subject_id: "subj-dsa-101",
    prerequisite_topic_id: "top-dsa-tree",
    dependent_topic_id: "top-dsa-heap",
    relationship_type: "helpful_foundation",
    confidence: 0.91,
    source_evidence: "Binary Heaps are complete binary trees mapped to array indices.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
  {
    id: "dep-dsa-06",
    subject_id: "subj-dsa-101",
    prerequisite_topic_id: "top-dsa-tree",
    dependent_topic_id: "top-dsa-graph",
    relationship_type: "strict_prerequisite",
    confidence: 0.95,
    source_evidence: "Graph DFS and BFS generalize tree traversal to cyclic adjacency graphs.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
  {
    id: "dep-dsa-07",
    subject_id: "subj-dsa-101",
    prerequisite_topic_id: "top-dsa-rec",
    dependent_topic_id: "top-dsa-dp",
    relationship_type: "strict_prerequisite",
    confidence: 0.99,
    source_evidence: "Dynamic programming memoizes overlapping subproblems from recursive formulations.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
  {
    id: "dep-dsa-08",
    subject_id: "subj-dsa-101",
    prerequisite_topic_id: "top-dsa-arr",
    dependent_topic_id: "top-dsa-sort",
    relationship_type: "strict_prerequisite",
    confidence: 0.95,
    source_evidence: "Sorting algorithms operate directly on contiguous memory partitions.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
];

export const DBMS_DEPENDENCIES: ConceptDependency[] = [
  {
    id: "dep-dbms-01",
    subject_id: "subj-dbms-102",
    prerequisite_topic_id: "top-dbms-sql",
    dependent_topic_id: "top-dbms-norm",
    relationship_type: "strict_prerequisite",
    confidence: 0.97,
    source_evidence: "Normalization requires understanding relational schemas and functional dependencies.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
  {
    id: "dep-dbms-02",
    subject_id: "subj-dbms-102",
    prerequisite_topic_id: "top-dbms-norm",
    dependent_topic_id: "top-dbms-idx",
    relationship_type: "strict_prerequisite",
    confidence: 0.94,
    source_evidence: "B+ Tree indexing structures are built upon normalized primary and candidate keys.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
  {
    id: "dep-dbms-03",
    subject_id: "subj-dbms-102",
    prerequisite_topic_id: "top-dbms-idx",
    dependent_topic_id: "top-dbms-acid",
    relationship_type: "strict_prerequisite",
    confidence: 0.95,
    source_evidence: "Transaction concurrency (2PL and locking) operates directly on indexed page blocks and row identifiers.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
  {
    id: "dep-dbms-04",
    subject_id: "subj-dbms-102",
    prerequisite_topic_id: "top-dbms-acid",
    dependent_topic_id: "top-dbms-rec",
    relationship_type: "strict_prerequisite",
    confidence: 0.98,
    source_evidence: "Crash recovery algorithms (ARIES) enforce transaction atomicity and durability via write-ahead logs.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
];

export const OS_DEPENDENCIES: ConceptDependency[] = [
  {
    id: "dep-os-01",
    subject_id: "subj-os-103",
    prerequisite_topic_id: "top-os-proc",
    dependent_topic_id: "top-os-sync",
    relationship_type: "strict_prerequisite",
    confidence: 0.98,
    source_evidence: "Synchronization primitives protect shared memory between concurrent processes and threads.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
  {
    id: "dep-os-02",
    subject_id: "subj-os-103",
    prerequisite_topic_id: "top-os-sync",
    dependent_topic_id: "top-os-dl",
    relationship_type: "strict_prerequisite",
    confidence: 0.96,
    source_evidence: "Deadlocks arise from circular wait conditions on mutually exclusive synchronization locks.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
  {
    id: "dep-os-03",
    subject_id: "subj-os-103",
    prerequisite_topic_id: "top-os-proc",
    dependent_topic_id: "top-os-vm",
    relationship_type: "strict_prerequisite",
    confidence: 0.95,
    source_evidence: "Virtual memory paging translates process address spaces via hardware page tables.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
  {
    id: "dep-os-04",
    subject_id: "subj-os-103",
    prerequisite_topic_id: "top-os-vm",
    dependent_topic_id: "top-os-fs",
    relationship_type: "helpful_foundation",
    confidence: 0.92,
    source_evidence: "File systems utilize virtual memory page cache buffers for disk block caching.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
];

export const CN_DEPENDENCIES: ConceptDependency[] = [
  {
    id: "dep-cn-01",
    subject_id: "subj-cn-104",
    prerequisite_topic_id: "top-cn-osi",
    dependent_topic_id: "top-cn-ip",
    relationship_type: "strict_prerequisite",
    confidence: 0.98,
    source_evidence: "IP addressing and CIDR subnetting operate at Network Layer 3 of the OSI/TCP-IP model.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
  {
    id: "dep-cn-02",
    subject_id: "subj-cn-104",
    prerequisite_topic_id: "top-cn-ip",
    dependent_topic_id: "top-cn-tcp",
    relationship_type: "strict_prerequisite",
    confidence: 0.97,
    source_evidence: "TCP 3-way handshakes and flow control rely on underlying IP host-to-host packet routing.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
  {
    id: "dep-cn-03",
    subject_id: "subj-cn-104",
    prerequisite_topic_id: "top-cn-ip",
    dependent_topic_id: "top-cn-rout",
    relationship_type: "strict_prerequisite",
    confidence: 0.96,
    source_evidence: "Routing algorithms (OSPF, BGP) construct forwarding tables based on destination IP subnets.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
  {
    id: "dep-cn-04",
    subject_id: "subj-cn-104",
    prerequisite_topic_id: "top-cn-tcp",
    dependent_topic_id: "top-cn-app",
    relationship_type: "strict_prerequisite",
    confidence: 0.95,
    source_evidence: "Application protocols (TLS, DNS, HTTP/2) run on top of Transport layer TCP and UDP sockets.",
    user_verified: true,
    created_at: "2026-10-02T10:05:00Z",
  },
];

export const ALL_DEPENDENCIES: ConceptDependency[] = [
  ...DSA_DEPENDENCIES,
  ...DBMS_DEPENDENCIES,
  ...OS_DEPENDENCIES,
  ...CN_DEPENDENCIES,
];

// Helper to get questions for any subject
export function getQuestionsForSubject(subjectId: string): QuizQuestion[] {
  switch (subjectId) {
    case "subj-dsa-101":
      return DSA_QUESTIONS;
    case "subj-dbms-102":
      return DBMS_QUESTIONS;
    case "subj-os-103":
      return OS_QUESTIONS;
    case "subj-cn-104":
      return CN_QUESTIONS;
    default:
      return DSA_QUESTIONS;
  }
}

export function getDependenciesForSubject(subjectId: string): ConceptDependency[] {
  switch (subjectId) {
    case "subj-dsa-101":
      return DSA_DEPENDENCIES;
    case "subj-dbms-102":
      return DBMS_DEPENDENCIES;
    case "subj-os-103":
      return OS_DEPENDENCIES;
    case "subj-cn-104":
      return CN_DEPENDENCIES;
    default:
      return DSA_DEPENDENCIES;
  }
}
