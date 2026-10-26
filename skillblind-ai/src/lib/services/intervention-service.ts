import {
  RootCauseDiagnosis,
  LearningIntervention,
  RevisionPlan,
  RevisionTask,
  TransferAssessment,
  QuizQuestion,
} from "@/types";

export function generateInterventionsFromDiagnoses(
  diagnoses: RootCauseDiagnosis[],
  userId: string
): LearningIntervention[] {
  return diagnoses.map((diag, index) => {
    const isPrereqGap = diag.root_cause_topic_id !== diag.observed_topic_id;
    const targetTopicId = diag.root_cause_topic_id;

    return {
      id: `intv-${diag.id}-${index}`,
      user_id: userId,
      diagnosis_id: diag.id,
      topic_id: targetTopicId,
      title: isPrereqGap
        ? `Foundational Remediation: Master ${diag.root_cause_topic?.name || "Prerequisite"}`
        : `Targeted Concept Re-alignment: ${diag.observed_topic?.name || "Concept"}`,
      intervention_type: isPrereqGap ? "tracing_exercise" : "worked_example",
      rationale: diag.hypothesized_cause,
      estimated_duration_minutes: isPrereqGap ? 30 : 20,
      source_excerpt: diag.recommended_intervention,
      status: "pending",
      created_at: new Date().toISOString(),
      topic: isPrereqGap ? diag.root_cause_topic : diag.observed_topic,
    };
  });
}

export function generateAdaptiveRevisionPlan(
  userId: string,
  subjectId: string,
  interventions: LearningIntervention[],
  examDate?: string,
  dailyHours: number = 2
): RevisionPlan {
  const planId = `plan-${Date.now().toString().slice(-6)}`;
  const now = new Date();

  const tasks: RevisionTask[] = interventions.map((intv, idx) => {
    const scheduled = new Date(now);
    scheduled.setDate(now.getDate() + idx);

    return {
      id: `tsk-${planId}-${idx + 1}`,
      plan_id: planId,
      intervention_id: intv.id,
      topic_id: intv.topic_id,
      title: intv.title,
      description: intv.rationale,
      scheduled_date: scheduled.toISOString().split("T")[0],
      estimated_minutes: intv.estimated_duration_minutes,
      completed: false,
      verification_status: "pending",
      topic: intv.topic,
    };
  });

  // Always append a Transfer-of-Knowledge Verification task
  const lastDate = new Date(now);
  lastDate.setDate(now.getDate() + tasks.length);
  tasks.push({
    id: `tsk-${planId}-verification`,
    plan_id: planId,
    topic_id: interventions[0]?.topic_id || "top-tree-traversal",
    title: "Transfer-of-Knowledge Verification Assessment",
    description: "Solve a new, unfamiliar scenario assessing deep conceptual transfer rather than rote recall.",
    scheduled_date: lastDate.toISOString().split("T")[0],
    estimated_minutes: 20,
    completed: false,
    verification_status: "pending",
  });

  return {
    id: planId,
    user_id: userId,
    subject_id: subjectId,
    title: "Adaptive Mastery Roadmap",
    target_exam_date: examDate || "2026-11-20",
    daily_study_hours: dailyHours,
    tasks,
    created_at: new Date().toISOString(),
  };
}

export function createTransferVerificationAssessment(
  intervention: LearningIntervention,
  baselineScore: number,
  verificationScore: number,
  userId: string
): TransferAssessment {
  const delta = Math.round((verificationScore - baselineScore) * 100) / 100;
  return {
    id: `trans-${Date.now().toString().slice(-6)}`,
    user_id: userId,
    intervention_id: intervention.id,
    original_topic_id: intervention.topic_id,
    baseline_score: baselineScore,
    verification_score: verificationScore,
    status: verificationScore >= 0.75 ? "mastery_verified" : "needs_more_practice",
    new_context_scenario:
      "Novel Application Context: Tracing recursive stack behavior in hierarchical file system directory traversal.",
    question_id: "q-trans-gen",
    evaluated_at: new Date().toISOString(),
    improvement_delta: delta,
    original_topic: intervention.topic,
  };
}
