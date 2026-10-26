import { NextRequest, NextResponse } from "next/server";
import { syncStateToBackend } from "@/lib/services/supabase-sync-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const state = body.state;

    if (!state) {
      return NextResponse.json({ error: "Missing state payload" }, { status: 400 });
    }

    const result = await syncStateToBackend(state);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Sync processing error",
      },
      { status: 500 }
    );
  }
}
