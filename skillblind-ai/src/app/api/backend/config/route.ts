import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { checkBackendHealth } from "@/lib/services/supabase-sync-service";

export async function POST(req: NextRequest) {
  try {
    const { supabaseUrl, supabaseAnonKey, geminiApiKey } = await req.json();

    if (!supabaseUrl && !geminiApiKey) {
      return NextResponse.json({ error: "No credentials provided" }, { status: 400 });
    }

    const envPath = path.join(process.cwd(), ".env.local");
    let currentEnv = "";
    if (fs.existsSync(envPath)) {
      currentEnv = fs.readFileSync(envPath, "utf-8");
    }

    // Helper to replace or append env vars
    const updateEnvVar = (env: string, key: string, val: string) => {
      const regex = new RegExp(`^${key}=.*$`, "m");
      if (regex.test(env)) {
        return env.replace(regex, `${key}=${val}`);
      } else {
        return env ? `${env.trim()}\n${key}=${val}\n` : `${key}=${val}\n`;
      }
    };

    let updated = currentEnv;
    if (supabaseUrl) {
      updated = updateEnvVar(updated, "NEXT_PUBLIC_SUPABASE_URL", supabaseUrl);
      process.env.NEXT_PUBLIC_SUPABASE_URL = supabaseUrl;
    }
    if (supabaseAnonKey) {
      updated = updateEnvVar(updated, "NEXT_PUBLIC_SUPABASE_ANON_KEY", supabaseAnonKey);
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = supabaseAnonKey;
    }
    if (geminiApiKey) {
      updated = updateEnvVar(updated, "GEMINI_API_KEY", geminiApiKey);
      updated = updateEnvVar(updated, "NEXT_PUBLIC_GEMINI_API_KEY", geminiApiKey);
      process.env.GEMINI_API_KEY = geminiApiKey;
      process.env.NEXT_PUBLIC_GEMINI_API_KEY = geminiApiKey;
    }

    fs.writeFileSync(envPath, updated, "utf-8");

    // Re-check health with new credentials
    const health = await checkBackendHealth();

    return NextResponse.json({
      success: true,
      message: "Credentials saved to .env.local and activated in runtime!",
      health,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to update configuration" },
      { status: 500 }
    );
  }
}
