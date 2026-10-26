import { NextRequest, NextResponse } from "next/server";
import { DEMO_TOPICS, DEMO_DEPENDENCIES, DEMO_TOPIC_MASTERY } from "@/lib/demo-data";
import {
  calculateLearningRiskPredictions,
  DEFAULT_WEIGHTS,
} from "@/lib/services/predictive-risk-service";

export async function GET() {
  const predictions = calculateLearningRiskPredictions(
    DEMO_TOPICS,
    DEMO_DEPENDENCIES,
    DEMO_TOPIC_MASTERY,
    "demo-user-101",
    DEFAULT_WEIGHTS
  );

  return NextResponse.json({
    predictions,
    weights: DEFAULT_WEIGHTS,
  });
}
