import { Topic, ConceptDependency, TopicMastery } from "@/types";

export interface GraphNode {
  id: string;
  name: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  masteryScore: number;
  masteryStatus: "weak" | "developing" | "strong" | "insufficient_evidence";
  questionsAttempted: number;
  description?: string;
  isPrerequisiteBottleneck?: boolean;
}

export interface GraphEdge {
  id: string;
  source: string; // prerequisite topic id
  target: string; // dependent topic id
  relationshipType: "strict_prerequisite" | "helpful_foundation" | "co_requisite";
  confidence: number;
  evidence: string;
  verified: boolean;
}

export interface ConceptGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function buildConceptGraph(
  topics: Topic[],
  dependencies: ConceptDependency[],
  masteryList: TopicMastery[]
): ConceptGraphData {
  const masteryMap = new Map<string, TopicMastery>();
  masteryList.forEach((m) => masteryMap.set(m.topic_id, m));

  // Count how many dependent topics each topic has
  const dependentCounts = new Map<string, number>();
  dependencies.forEach((dep) => {
    const current = dependentCounts.get(dep.prerequisite_topic_id) || 0;
    dependentCounts.set(dep.prerequisite_topic_id, current + 1);
  });

  const nodes: GraphNode[] = topics.map((t) => {
    const m = masteryMap.get(t.id);
    const score = m ? m.mastery_score : 0;
    const status = m ? m.status : "insufficient_evidence";
    const attempts = m ? m.questions_attempted : 0;
    const dependents = dependentCounts.get(t.id) || 0;

    // A bottleneck is a weak concept that blocks 2 or more downstream topics
    const isPrerequisiteBottleneck = status === "weak" && dependents >= 1;

    return {
      id: t.id,
      name: t.name,
      difficulty: t.difficulty_level,
      masteryScore: score,
      masteryStatus: status,
      questionsAttempted: attempts,
      description: t.description,
      isPrerequisiteBottleneck,
    };
  });

  const edges: GraphEdge[] = dependencies.map((dep) => ({
    id: dep.id,
    source: dep.prerequisite_topic_id,
    target: dep.dependent_topic_id,
    relationshipType: dep.relationship_type,
    confidence: dep.confidence,
    evidence: dep.source_evidence,
    verified: dep.user_verified,
  }));

  return { nodes, edges };
}

/**
 * Finds all prerequisite topics leading up to a specific target topic
 */
export function getPrerequisiteChain(
  topicId: string,
  dependencies: ConceptDependency[],
  topics: Topic[]
): { immediate: Topic[]; transitive: Topic[] } {
  const topicMap = new Map(topics.map((t) => [t.id, t]));
  const immediateIds = dependencies
    .filter((d) => d.dependent_topic_id === topicId)
    .map((d) => d.prerequisite_topic_id);

  const immediate: Topic[] = [];
  immediateIds.forEach((id) => {
    const t = topicMap.get(id);
    if (t) immediate.push(t);
  });

  const visited = new Set<string>(immediateIds);
  const queue = [...immediateIds];
  const transitiveIds: string[] = [];

  while (queue.length > 0) {
    const curr = queue.shift()!;
    const parentDeps = dependencies
      .filter((d) => d.dependent_topic_id === curr)
      .map((d) => d.prerequisite_topic_id);

    for (const pId of parentDeps) {
      if (!visited.has(pId)) {
        visited.add(pId);
        transitiveIds.push(pId);
        queue.push(pId);
      }
    }
  }

  const transitive: Topic[] = [];
  transitiveIds.forEach((id) => {
    const t = topicMap.get(id);
    if (t) transitive.push(t);
  });

  return { immediate, transitive };
}
