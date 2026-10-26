import { QuizQuestion, StudentAnswer, AnswerEvaluation, TopicMastery, ConfidenceRating } from "@/types";

export function evaluateAnswer(
  question: QuizQuestion,
  studentResponse: string,
  confidence: ConfidenceRating = "somewhat"
): { isCorrect: boolean; score: number; evaluation: AnswerEvaluation } {
  const normResponse = studentResponse.trim().toLowerCase();
  const normCorrect = question.correct_answer.trim().toLowerCase();

  // 1. Multiple Choice or True/False
  if (question.question_type === "multiple_choice" || question.question_type === "true_false") {
    const isCorrect = normResponse === normCorrect;
    const score = isCorrect ? 1.0 : 0.0;

    const misconceptionIndicators: string[] = [];
    if (!isCorrect && confidence === "confident") {
      misconceptionIndicators.push("High-confidence mistake indicates deep conceptual misconception");
    }

    return {
      isCorrect,
      score,
      evaluation: {
        score,
        status: isCorrect ? "correct" : "incorrect",
        feedback: isCorrect
          ? "Correct! " + question.explanation
          : `Incorrect. Expected '${question.correct_answer}'. ` + question.explanation,
        missing_concepts: isCorrect ? [] : [question.correct_answer],
        misconception_indicators: misconceptionIndicators,
        grounding_citation: question.citations[0]
          ? `${question.citations[0].source_title} (Page ${question.citations[0].page_number || "N/A"})`
          : undefined,
      },
    };
  }

  // 2. Short Answer / Scenario-based with Scoring Rubric
  const rubric = question.scoring_rubric;
  if (rubric && rubric.required_keywords.length > 0) {
    let matchedKeywords = 0;
    const missingKeywords: string[] = [];

    rubric.required_keywords.forEach((kw) => {
      if (normResponse.includes(kw.toLowerCase())) {
        matchedKeywords++;
      } else {
        missingKeywords.push(kw);
      }
    });

    const ratio = matchedKeywords / rubric.required_keywords.length;
    let score = 0;
    let status: "correct" | "partially_correct" | "incorrect" = "incorrect";

    if (ratio >= 0.8) {
      score = 1.0;
      status = "correct";
    } else if (ratio >= (rubric.partial_credit_threshold || 0.4)) {
      score = Math.round(ratio * 100) / 100;
      status = "partially_correct";
    } else {
      score = 0.1;
      status = "incorrect";
    }

    const misconceptionIndicators: string[] = [];
    if (rubric.sample_flawed_thinking && normResponse.includes(rubric.sample_flawed_thinking.toLowerCase())) {
      misconceptionIndicators.push("Exhibited known flawed mental model: " + rubric.sample_flawed_thinking);
    }
    if (status !== "correct" && confidence === "confident") {
      misconceptionIndicators.push("High-confidence error on open-ended concept application");
    }

    return {
      isCorrect: score >= 0.7,
      score,
      evaluation: {
        score,
        status,
        feedback:
          status === "correct"
            ? "Strong answer covering essential concepts. " + question.explanation
            : `Identified ${matchedKeywords} of ${rubric.required_keywords.length} critical concepts. ${question.explanation}`,
        missing_concepts: missingKeywords,
        misconception_indicators: misconceptionIndicators,
        grounding_citation: question.citations[0]
          ? `${question.citations[0].source_title} (Page ${question.citations[0].page_number || "N/A"})`
          : undefined,
      },
    };
  }

  // General fallback
  const isCorrect = normResponse.includes(normCorrect);
  const score = isCorrect ? 1.0 : 0.0;
  return {
    isCorrect,
    score,
    evaluation: {
      score,
      status: isCorrect ? "correct" : "incorrect",
      feedback: question.explanation,
      missing_concepts: isCorrect ? [] : [question.correct_answer],
      misconception_indicators: !isCorrect && confidence === "confident" ? ["High-confidence mistake"] : [],
    },
  };
}

export function recalculateTopicMastery(
  existingMastery: TopicMastery | undefined,
  topicId: string,
  userId: string,
  newScore: number,
  isCorrect: boolean
): TopicMastery {
  const currentAttempts = existingMastery ? existingMastery.questions_attempted + 1 : 1;
  const currentCorrect = existingMastery ? existingMastery.questions_correct + (isCorrect ? 1 : 0) : isCorrect ? 1 : 0;

  // Exponential moving average or weighted average
  let newMasteryScore: number;
  if (!existingMastery) {
    newMasteryScore = newScore;
  } else {
    // 70% history, 30% new attempt
    newMasteryScore = Math.round((existingMastery.mastery_score * 0.7 + newScore * 0.3) * 100) / 100;
  }

  let status: TopicMastery["status"] = "insufficient_evidence";
  if (currentAttempts < 2) {
    status = "insufficient_evidence";
  } else if (newMasteryScore >= 0.75) {
    status = "strong";
  } else if (newMasteryScore >= 0.45) {
    status = "developing";
  } else {
    status = "weak";
  }

  return {
    id: existingMastery ? existingMastery.id : `mst-${topicId}`,
    user_id: userId,
    topic_id: topicId,
    mastery_score: newMasteryScore,
    status,
    questions_attempted: currentAttempts,
    questions_correct: currentCorrect,
    last_assessed_at: new Date().toISOString(),
  };
}
