import {
  StudentAnswer,
  QuizQuestion,
  ConceptDependency,
  Topic,
  TopicMastery,
  RootCauseDiagnosis,
  MisconceptionPattern,
} from "@/types";

export interface DiagnosisInput {
  userId: string;
  subjectId: string;
  answers: StudentAnswer[];
  questions: QuizQuestion[];
  topics: Topic[];
  dependencies: ConceptDependency[];
  masteryList: TopicMastery[];
}

export function performRootCauseDiagnosis(input: DiagnosisInput): {
  diagnoses: RootCauseDiagnosis[];
  misconceptions: MisconceptionPattern[];
} {
  const { userId, subjectId, answers, questions, topics, dependencies, masteryList } = input;

  const topicMap = new Map(topics.map((t) => [t.id, t]));
  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const masteryMap = new Map(masteryList.map((m) => [m.topic_id, m]));

  // 1. Group answers by topic
  const topicAnswersMap = new Map<string, { total: number; incorrect: StudentAnswer[]; highConfErrors: number }>();

  answers.forEach((ans) => {
    const q = questionMap.get(ans.question_id);
    if (!q) return;

    const group = topicAnswersMap.get(q.topic_id) || { total: 0, incorrect: [], highConfErrors: 0 };
    group.total++;
    if (!ans.is_correct) {
      group.incorrect.push(ans);
      if (ans.confidence_rating === "confident") {
        group.highConfErrors++;
      }
    }
    topicAnswersMap.set(q.topic_id, group);
  });

  const diagnoses: RootCauseDiagnosis[] = [];
  const misconceptions: MisconceptionPattern[] = [];

  // 2. Identify topics with observed failures (error rate >= 50%)
  topicAnswersMap.forEach((group, observedTopicId) => {
    if (group.incorrect.length === 0) return;
    const observedTopic = topicMap.get(observedTopicId);
    if (!observedTopic) return;

    const errorRate = group.incorrect.length / group.total;
    if (errorRate < 0.5 && group.total >= 2) return; // not struggling significantly

    // 3. Inspect prerequisite chain for this topic
    const prereqDeps = dependencies.filter((d) => d.dependent_topic_id === observedTopicId);

    // Look for weak prerequisites
    let rootCauseTopicId = observedTopicId;
    let hypothesizedCause = "";
    let confidenceLevel = 0.7;

    for (const dep of prereqDeps) {
      const pId = dep.prerequisite_topic_id;
      const pTopic = topicMap.get(pId);
      const pMastery = masteryMap.get(pId);

      // Check if prerequisite is weak or has errors
      const pAnswers = topicAnswersMap.get(pId);
      const isPrereqWeak = (pMastery && pMastery.status === "weak") || (pAnswers && pAnswers.incorrect.length > 0);

      if (isPrereqWeak && pTopic) {
        rootCauseTopicId = pId;
        confidenceLevel = 0.88 + dep.confidence * 0.08;
        hypothesizedCause = `Missing foundational mastery in prerequisite '${pTopic.name}'. Student struggles with advanced application in '${observedTopic.name}' primarily because underlying prerequisite mechanics are ungrounded.`;
        break;
      }
    }

    if (rootCauseTopicId === observedTopicId) {
      // Local misconception within the topic itself
      hypothesizedCause = `Localized conceptual difficulty within '${observedTopic.name}'. Errors stem from flawed mental models or specific rule misapplications rather than missing upstream prerequisites.`;
      confidenceLevel = 0.75;
    }

    // Build evidence citations
    const evidenceCitations = group.incorrect.map((ans) => {
      const q = questionMap.get(ans.question_id);
      return {
        quiz_attempt_id: ans.attempt_id,
        question_text: q ? q.question_text : "Diagnostic question",
        student_response: `${ans.student_response} (Confidence: ${ans.confidence_rating || "unrated"})`,
        flaw_identified: ans.evaluation_details?.feedback || "Failed to identify correct concept",
      };
    });

    const rootCauseTopic = topicMap.get(rootCauseTopicId);

    diagnoses.push({
      id: `diag-${observedTopicId}-${Date.now().toString().slice(-4)}`,
      user_id: userId,
      subject_id: subjectId,
      observed_topic_id: observedTopicId,
      root_cause_topic_id: rootCauseTopicId,
      observed_issue: `Observed: ${group.incorrect.length} of ${group.total} questions in '${observedTopic.name}' answered incorrectly.`,
      hypothesized_cause: hypothesizedCause,
      confidence_level: Math.min(0.96, confidenceLevel),
      evidence_citations: evidenceCitations,
      status: "hypothesis",
      recommended_intervention:
        rootCauseTopicId !== observedTopicId
          ? `Targeted Intervention: Step back to prerequisite '${rootCauseTopic?.name || "Foundations"}'. Complete visual tracing exercises before retrying '${observedTopic.name}'.`
          : `Targeted Intervention: Complete targeted worked-examples and practice problems for '${observedTopic.name}'.`,
      created_at: new Date().toISOString(),
      observed_topic: observedTopic,
      root_cause_topic: rootCauseTopic,
    });

    // Check for misconception pattern if high confidence errors occurred
    if (group.highConfErrors > 0) {
      misconceptions.push({
        id: `misc-${observedTopicId}-${Date.now().toString().slice(-4)}`,
        user_id: userId,
        topic_id: observedTopicId,
        pattern_name: `High-Confidence Misconception in ${observedTopic.name}`,
        description: `Student consistently answered with high subjective confidence despite flawed conceptual execution. Requires cognitive dissonance and explicit counter-examples to unlearn.`,
        frequency: group.highConfErrors,
        high_confidence_errors: group.highConfErrors,
        sample_student_responses: group.incorrect.slice(0, 3).map((a) => a.student_response),
        identified_at: new Date().toISOString(),
        resolved: false,
        topic: observedTopic,
      });
    }
  });

  return { diagnoses, misconceptions };
}
