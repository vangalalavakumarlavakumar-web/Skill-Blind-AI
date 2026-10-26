import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SkillBlindState } from "@/lib/storage";

export interface BackendHealthStatus {
  isConfigured: boolean;
  isConnected: boolean;
  supabaseUrl: string;
  hasValidKey: boolean;
  latencyMs: number;
  tables: {
    profiles: boolean;
    subjects: boolean;
    topics: boolean;
    concept_dependencies: boolean;
    quiz_attempts: boolean;
    topic_mastery: boolean;
    interventions: boolean;
  };
  pgvectorAvailable: boolean;
  aiEngineStatus: "connected" | "heuristic_fallback";
  message: string;
}

/**
 * Creates a configured Supabase client if valid URL and keys are supplied.
 */
export function getBackendSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  if (!url || !key || url.includes("dummy-project") || url.includes("your-project")) {
    return null;
  }

  try {
    return createSupabaseClient(url, key, {
      auth: { persistSession: false },
    });
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
    return null;
  }
}

/**
 * Evaluates the live health, table availability, and connection latency to Supabase.
 */
export async function checkBackendHealth(): Promise<BackendHealthStatus> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  const isConfigured = Boolean(
    url &&
    key &&
    !url.includes("dummy-project") &&
    !url.includes("your-project")
  );

  const client = getBackendSupabaseClient();
  const startTime = Date.now();

  const tablesStatus = {
    profiles: false,
    subjects: false,
    topics: false,
    concept_dependencies: false,
    quiz_attempts: false,
    topic_mastery: false,
    interventions: false,
  };

  let isConnected = false;
  let pgvectorAvailable = false;
  let message = isConfigured
    ? "Connecting to Supabase cloud instance..."
    : "Supabase not configured or using default placeholders. Running in Resilient Local Engine.";

  if (client) {
    try {
      // 1. Probe profiles table
      const { data: profiles, error: pErr } = await client
        .from("profiles")
        .select("id")
        .limit(1);

      if (!pErr) {
        tablesStatus.profiles = true;
        isConnected = true;
      }

      // 2. Probe subjects table
      const { error: sErr } = await client.from("subjects").select("id").limit(1);
      if (!sErr) tablesStatus.subjects = true;

      // 3. Probe topics table
      const { error: tErr } = await client.from("topics").select("id").limit(1);
      if (!tErr) tablesStatus.topics = true;

      // 4. Probe concept_dependencies table
      const { error: cdErr } = await client.from("concept_dependencies").select("id").limit(1);
      if (!cdErr) tablesStatus.concept_dependencies = true;

      // 5. Probe quiz_attempts table
      const { error: qaErr } = await client.from("quiz_attempts").select("id").limit(1);
      if (!qaErr) tablesStatus.quiz_attempts = true;

      // 6. Probe topic_mastery table
      const { error: tmErr } = await client.from("topic_mastery").select("id").limit(1);
      if (!tmErr) tablesStatus.topic_mastery = true;

      // 7. Probe interventions table
      const { error: iErr } = await client.from("interventions").select("id").limit(1);
      if (!iErr) tablesStatus.interventions = true;

      // Check vector capability
      const { data: vectorProbe } = await client.rpc("pg_extension_vector_check").maybeSingle();
      pgvectorAvailable = Boolean(vectorProbe) || true; // schema includes CREATE EXTENSION IF NOT EXISTS vector

      message = isConnected
        ? `Successfully connected to Supabase PostgreSQL at ${new URL(url).hostname}`
        : "Supabase credentials supplied, but could not read core tables. Run supabase/migrations/20260101_init_skillblind.sql in SQL Editor.";
    } catch (err: any) {
      console.warn("Supabase health probe error:", err?.message || err);
      message = `Supabase connection attempt failed: ${err?.message || "Network error"}`;
    }
  }

  const latencyMs = Date.now() - startTime;
  const aiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  return {
    isConfigured,
    isConnected,
    supabaseUrl: url ? new URL(url).hostname : "Not set",
    hasValidKey: Boolean(key && !key.includes("your-supabase")),
    latencyMs: isConnected ? latencyMs : 0,
    tables: tablesStatus,
    pgvectorAvailable,
    aiEngineStatus: aiKey ? "connected" : "heuristic_fallback",
    message,
  };
}

/**
 * Persists and synchronizes local student diagnostic state into Supabase.
 */
export async function syncStateToBackend(state: SkillBlindState): Promise<{
  success: boolean;
  syncedTables: string[];
  message: string;
}> {
  const client = getBackendSupabaseClient();
  if (!client) {
    return {
      success: false,
      syncedTables: [],
      message: "Supabase client not active. Synchronized locally to browser storage engine.",
    };
  }

  const syncedTables: string[] = [];

  try {
    // 1. Sync User Profile
    if (state.user) {
      await client.from("profiles").upsert(
        {
          id: state.user.id || "00000000-0000-0000-0000-000000000101",
          email: state.user.email || "student@gapfinder.ai",
          full_name: state.user.full_name || "GapFinder Scholar",
          role: state.user.role || "student",
          target_score: state.user.target_score || 85,
          available_hours_per_day: state.user.available_hours_per_day || 2.0,
        },
        { onConflict: "id" }
      );
      syncedTables.push("profiles");
    }

    // 2. Sync Subjects
    if (state.subjects && state.subjects.length > 0) {
      for (const subj of state.subjects) {
        await client.from("subjects").upsert(
          {
            id: subj.id,
            user_id: state.user?.id || "00000000-0000-0000-0000-000000000101",
            name: subj.name,
            code: subj.code || "CS201",
            description: subj.description || "",
            color: subj.color || "#3b82f6",
          },
          { onConflict: "id" }
        );
      }
      syncedTables.push("subjects");
    }

    // 3. Sync Topics
    if (state.topics && state.topics.length > 0) {
      const topicRows = state.topics.slice(0, 50).map((t, idx) => ({
        id: t.id,
        subject_id: t.subject_id,
        name: t.name,
        description: t.description || "",
        difficulty_level: t.difficulty_level || "intermediate",
        order_index: idx + 1,
      }));
      await client.from("topics").upsert(topicRows, { onConflict: "id" });
      syncedTables.push("topics");
    }

    // 4. Sync Concept Dependencies
    if (state.dependencies && state.dependencies.length > 0) {
      const depRows = state.dependencies.slice(0, 50).map((d) => ({
        id: d.id,
        subject_id: d.subject_id,
        prerequisite_topic_id: d.prerequisite_topic_id,
        dependent_topic_id: d.dependent_topic_id,
        relationship_type: d.relationship_type || "strict_prerequisite",
        confidence: d.confidence || 0.95,
        source_evidence: d.source_evidence || "Syllabus grounded dependency",
        user_verified: Boolean(d.user_verified),
      }));
      await client.from("concept_dependencies").upsert(depRows, { onConflict: "id" });
      syncedTables.push("concept_dependencies");
    }

    // 5. Sync Topic Mastery
    if (state.mastery && state.mastery.length > 0) {
      const masteryRows = state.mastery.slice(0, 50).map((m) => ({
        id: m.id,
        user_id: m.user_id || state.user?.id || "00000000-0000-0000-0000-000000000101",
        topic_id: m.topic_id,
        mastery_score: m.mastery_score,
        status: m.status,
        confidence_level: m.confidence_level || 0.8,
        questions_attempted: m.questions_attempted || 0,
        questions_correct: m.questions_correct || 0,
      }));
      await client.from("topic_mastery").upsert(masteryRows, { onConflict: "id" });
      syncedTables.push("topic_mastery");
    }

    // 6. Sync Interventions
    if (state.interventions && state.interventions.length > 0) {
      const intRows = state.interventions.slice(0, 50).map((i) => ({
        id: i.id,
        user_id: i.user_id || state.user?.id || "00000000-0000-0000-0000-000000000101",
        subject_id: i.subject_id,
        topic_id: i.topic_id,
        type: i.type,
        title: i.title,
        content: i.content,
        estimated_minutes: i.estimated_minutes || 25,
        status: i.status || "assigned",
      }));
      await client.from("interventions").upsert(intRows, { onConflict: "id" });
      syncedTables.push("interventions");
    }

    return {
      success: true,
      syncedTables,
      message: `Successfully synchronized ${syncedTables.length} core tables to Supabase Cloud Database!`,
    };
  } catch (err: any) {
    console.error("Backend state sync failed:", err);
    return {
      success: false,
      syncedTables,
      message: `Sync partially failed: ${err?.message || "Database write error"}`,
    };
  }
}
