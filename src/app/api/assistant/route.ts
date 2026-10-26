import { NextRequest, NextResponse } from "next/server";
import { DEMO_CHUNKS } from "@/lib/demo-data";
import { askGroundedAssistant } from "@/lib/services/rag-assistant-service";
import { z } from "zod";

const RequestSchema = z.object({
  question: z.string().min(2),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const result = await askGroundedAssistant(
      parsed.data.question,
      DEMO_CHUNKS,
      "CS201 Uploaded Textbook & Notes"
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error("Assistant API error", err);
    return NextResponse.json(
      {
        answer: "I couldn't find enough evidence in your uploaded materials to answer this accurately.",
        citations: [],
        isGrounded: false,
      },
      { status: 500 }
    );
  }
}
