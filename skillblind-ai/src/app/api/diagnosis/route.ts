import { NextResponse } from "next/server";
import { DEMO_ROOT_CAUSE, DEMO_MISCONCEPTIONS } from "@/lib/demo-data";

export async function GET() {
  return NextResponse.json({
    diagnoses: [DEMO_ROOT_CAUSE],
    misconceptions: DEMO_MISCONCEPTIONS,
  });
}
