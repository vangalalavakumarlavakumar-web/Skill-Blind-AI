import {
  Topic,
  ConceptDependency,
  TopicMastery,
  LearningRiskPrediction,
  RiskLevel,
} from "@/types";

export interface RiskScoringWeights {
  prerequisiteDeficitWeight: number; // default 0.45
  downstreamComplexityWeight: number; // default 0.25
  evidenceUncertaintyWeight: number; // default 0.20
  recencyDecayWeight: number; // default 0.10
}

export const DEFAULT_WEIGHTS: RiskScoringWeights = {
  prerequisiteDeficitWeight: 0.45,
  downstreamComplexityWeight: 0.25,
  evidenceUncertaintyWeight: 0.20,
  recencyDecayWeight: 0.10,
};

export function calculateLearningRiskPredictions(
  topics: Topic[],
  dependencies: ConceptDependency[],
  masteryList: TopicMastery[],
  userId: string,
  weights: RiskScoringWeights = DEFAULT_WEIGHTS
): LearningRiskPrediction[] {
  const masteryMap = new Map(masteryList.map((m) => [m.topic_id, m]));
  const predictions: LearningRiskPrediction[] = [];

  topics.forEach((topic) => {
    const directPrereqs = dependencies.filter((d) => d.dependent_topic_id === topic.id);
    const selfMastery = masteryMap.get(topic.id);

    // If topic has no prerequisites and is already strong, low risk
    if (directPrereqs.length === 0 && selfMastery?.status === "strong") {
      return;
    }

    // Factor 1: Prerequisite Deficit (0 to 1)
    let prereqDeficitScore = 0;
    let worstPrereqName = "";

    if (directPrereqs.length > 0) {
      let totalDeficit = 0;
      directPrereqs.forEach((dep) => {
        const pMastery = masteryMap.get(dep.prerequisite_topic_id);
        const pScore = pMastery ? pMastery.mastery_score : 0.5;
        const deficit = 1.0 - pScore;
        totalDeficit += deficit * dep.confidence;

        if (deficit > prereqDeficitScore) {
          prereqDeficitScore = deficit;
          const pTopic = topics.find((t) => t.id === dep.prerequisite_topic_id);
          worstPrereqName = pTopic ? pTopic.name : "Prerequisite";
        }
      });
      prereqDeficitScore = Math.min(1.0, totalDeficit / directPrereqs.length);
    }

    // Factor 2: Downstream Complexity based on Difficulty Level
    let complexityScore = 0.3;
    if (topic.difficulty_level === "advanced") complexityScore = 0.85;
    else if (topic.difficulty_level === "intermediate") complexityScore = 0.55;

    // Factor 3: Assessment Evidence Uncertainty
    const attempts = selfMastery ? selfMastery.questions_attempted : 0;
    const evidenceUncertainty = attempts === 0 ? 0.9 : attempts === 1 ? 0.5 : 0.1;

    // Factor 4: Recency decay
    const recencyDecay = 0.2;

    // Total weighted risk score
    const totalRiskScore = Math.min(
      0.98,
      prereqDeficitScore * weights.prerequisiteDeficitWeight +
        complexityScore * weights.downstreamComplexityWeight +
        evidenceUncertainty * weights.evidenceUncertaintyWeight +
        recencyDecay * weights.recencyDecayWeight
    );

    // Categorize risk level
    let riskLevel: RiskLevel = "low";
    if (attempts === 0 && prereqDeficitScore < 0.3) {
      riskLevel = "insufficient";
    } else if (totalRiskScore >= 0.6 || (prereqDeficitScore >= 0.6 && topic.difficulty_level === "advanced")) {
      riskLevel = "high";
    } else if (totalRiskScore >= 0.4) {
      riskLevel = "moderate";
    } else {
      riskLevel = "low";
    }

    // Contributing factors breakdown
    const contributingFactors = [
      {
        factor: "Prerequisite Foundation Deficit",
        weight: weights.prerequisiteDeficitWeight,
        impact: prereqDeficitScore >= 0.5 ? ("increases_risk" as const) : ("decreases_risk" as const),
        description:
          directPrereqs.length > 0
            ? `Prerequisite '${worstPrereqName}' has estimated deficit of ${Math.round(prereqDeficitScore * 100)}%.`
            : "No strict upstream prerequisites registered.",
      },
      {
        factor: "Inherent Concept Complexity",
        weight: weights.downstreamComplexityWeight,
        impact: complexityScore >= 0.6 ? ("increases_risk" as const) : ("neutral" as const),
        description: `Classified as ${topic.difficulty_level} cognitive load.`,
      },
      {
        factor: "Direct Evidence Availability",
        weight: weights.evidenceUncertaintyWeight,
        impact: evidenceUncertainty > 0.4 ? ("increases_risk" as const) : ("decreases_risk" as const),
        description: `${attempts} diagnostic questions attempted to date.`,
      },
    ];

    predictions.push({
      id: `pred-${topic.id}`,
      user_id: userId,
      topic_id: topic.id,
      risk_score: Math.round(totalRiskScore * 100) / 100,
      risk_level: riskLevel,
      contributing_factors: contributingFactors,
      supporting_history: `Estimated based on ${directPrereqs.length} prerequisite chains and observed assessment attempts.`,
      recommended_preventive_action:
        riskLevel === "high"
          ? `High attention needed: Address prerequisite '${worstPrereqName}' before starting comprehensive practice on '${topic.name}'.`
          : riskLevel === "moderate"
          ? `Review foundational worked examples before progressing to timed assessments.`
          : `Maintain concept retention with scheduled spaced review.`,
      calculated_at: new Date().toISOString(),
      topic,
    });
  });

  return predictions.sort((a, b) => b.risk_score - a.risk_score);
}
