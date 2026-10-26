import { NextResponse } from "next/server";
import { checkBackendHealth } from "@/lib/services/supabase-sync-service";

export async function GET() {
  try {
    const health = await checkBackendHealth();
    return NextResponse.json(health);
  } catch (err: any) {
    return NextResponse.json(
      {
        isConfigured: false,
        isConnected: false,
        message: err?.message || "Health check failed",
      },
      { status: 500 }
    );
  }
}
