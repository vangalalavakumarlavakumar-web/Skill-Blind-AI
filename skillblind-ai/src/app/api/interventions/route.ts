import { NextResponse } from "next/server";
import {
  DEMO_INTERVENTIONS,
  DEMO_REVISION_PLAN,
  DEMO_TRANSFER_ASSESSMENT,
} from "@/lib/demo-data";

export async function GET() {
  return NextResponse.json({
    interventions: DEMO_INTERVENTIONS,
    revisionPlan: DEMO_REVISION_PLAN,
    transferAssessment: DEMO_TRANSFER_ASSESSMENT,
  });
}
