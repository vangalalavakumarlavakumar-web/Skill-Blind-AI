import { NextResponse } from "next/server";
import { DEMO_QUIZ } from "@/lib/demo-data";

export async function GET() {
  return NextResponse.json({
    quiz: DEMO_QUIZ,
  });
}
