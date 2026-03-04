import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parseProjectLog } from "@/lib/parseProjectLog";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USER_ID = process.env.IMPORT_USER_ID;

function verifySignature(payload: string, signature: string | null): boolean {
  if (!WEBHOOK_SECRET || !signature) return false;
  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  hmac.update(payload, "utf-8");
  const expected = `sha256=${hmac.digest("hex")}`;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(request: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !USER_ID) {
    return NextResponse.json(
      { error: "Server not configured for webhook imports" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = request.headers.get("x-github-event");
  if (event !== "push") {
    return NextResponse.json({ message: `Ignored event: ${event}` });
  }

  const payload = JSON.parse(body);

  // Only process pushes to main/master
  const ref = payload.ref as string;
  if (ref !== "refs/heads/main" && ref !== "refs/heads/master") {
    return NextResponse.json({ message: "Ignored non-default branch push" });
  }

  // Collect all added/modified .md files from commits
  const mdFiles = new Set<string>();
  for (const commit of payload.commits ?? []) {
    for (const file of [...(commit.added ?? []), ...(commit.modified ?? [])]) {
      if (typeof file === "string" && file.endsWith(".md") && file.startsWith("logs/")) {
        mdFiles.add(file);
      }
    }
  }

  if (mdFiles.size === 0) {
    return NextResponse.json({ message: "No log files changed" });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const repoFullName = payload.repository?.full_name as string;
  const results: { file: string; status: string }[] = [];

  for (const filePath of mdFiles) {
    try {
      // Fetch raw file content from GitHub
      const rawUrl = `https://raw.githubusercontent.com/${repoFullName}/${payload.after}/${filePath}`;
      const res = await fetch(rawUrl);
      if (!res.ok) {
        results.push({ file: filePath, status: `fetch failed: ${res.status}` });
        continue;
      }

      const markdown = await res.text();
      const parsed = parseProjectLog(markdown);

      // Check for existing (dedupe on source_log_path)
      const { data: existing } = await supabase
        .from("projects")
        .select("id")
        .eq("source_log_path", filePath)
        .eq("user_id", USER_ID)
        .limit(1);

      if (existing && existing.length > 0) {
        // Update existing project
        const updateData: Record<string, unknown> = {
            title: parsed.title,
            summary: parsed.summary,
            tech_stack: parsed.tech_stack,
            files_built: parsed.files_built,
            key_decisions: parsed.key_decisions,
            lessons_learned: parsed.lessons_learned,
            github_repo_url: parsed.github_repo_url,
        };
        if (parsed.stage) {
            updateData.stage = parsed.stage;
        }
        if (parsed.category && (parsed.category === "website" || parsed.category === "agent")) {
            updateData.category = parsed.category;
        }
        const { error } = await supabase
          .from("projects")
          .update(updateData)
          .eq("id", existing[0].id);

        results.push({
          file: filePath,
          status: error ? `update error: ${error.message}` : "updated",
        });
      } else {
        // Insert new project
        const { error } = await supabase.from("projects").insert({
          user_id: USER_ID,
          title: parsed.title,
          description: "",
          stage: parsed.stage ?? "complete",
          category: (parsed.category === "website" || parsed.category === "agent") ? parsed.category : "website",
          order: 0,
          summary: parsed.summary,
          tech_stack: parsed.tech_stack,
          files_built: parsed.files_built,
          key_decisions: parsed.key_decisions,
          lessons_learned: parsed.lessons_learned,
          source_log_path: filePath,
          github_repo_url: parsed.github_repo_url ?? null,
        });

        results.push({
          file: filePath,
          status: error ? `insert error: ${error.message}` : "imported",
        });
      }
    } catch (err) {
      results.push({
        file: filePath,
        status: `error: ${err instanceof Error ? err.message : "unknown"}`,
      });
    }
  }

  return NextResponse.json({ processed: results });
}
