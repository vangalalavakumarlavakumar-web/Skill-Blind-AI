import { NextRequest, NextResponse } from "next/server";
import { getQuestionsForSubject } from "@/lib/subject-question-banks";
import { DEMO_QUIZ } from "@/lib/demo-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subjectId") || searchParams.get("subject") || "subj-dsa-101";

  const questions = getQuestionsForSubject(subjectId);

  return NextResponse.json({
    quiz: {
      ...DEMO_QUIZ,
      subject_id: subjectId,
      questions,
      questions_count: questions.length,
    },
    questions,
    total: questions.length,
  });
}
