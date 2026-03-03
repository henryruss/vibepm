import { createClient } from "@supabase/supabase-js";
import { parseProjectLog } from "../src/lib/parseProjectLog";
import * as fs from "fs";
import * as path from "path";
import { config } from "dotenv";

config({ path: path.join(process.cwd(), ".env.local") });

const LOGS_DIR = path.join(
  process.env.HOME || "~",
  "Projects/claude-project-logs/logs"
);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role bypasses RLS
const USER_ID = process.env.IMPORT_USER_ID; // Pass your Supabase user ID

if (!SUPABASE_URL || !SUPABASE_KEY || !USER_ID) {
  console.error(
    "Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and IMPORT_USER_ID"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  if (!fs.existsSync(LOGS_DIR)) {
    console.error(`Logs directory not found: ${LOGS_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(LOGS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  console.log(`Found ${files.length} log file(s)\n`);

  for (const file of files) {
    const filePath = path.join(LOGS_DIR, file);
    const markdown = fs.readFileSync(filePath, "utf-8");
    const parsed = parseProjectLog(markdown);
    const sourceLogPath = `logs/${file}`;

    // Check for existing (dedupe on source_log_path)
    const { data: existing } = await supabase
      .from("projects")
      .select("id")
      .eq("source_log_path", sourceLogPath)
      .eq("user_id", USER_ID)
      .limit(1);

    if (existing && existing.length > 0) {
      console.log(`  SKIP (exists): ${parsed.title}`);
      continue;
    }

    const { error } = await supabase.from("projects").insert({
      user_id: USER_ID,
      title: parsed.title,
      description: "",
      stage: "complete",
      order: 0,
      summary: parsed.summary,
      tech_stack: parsed.tech_stack,
      files_built: parsed.files_built,
      key_decisions: parsed.key_decisions,
      lessons_learned: parsed.lessons_learned,
      source_log_path: sourceLogPath,
    });

    if (error) {
      console.log(`  ERROR: ${parsed.title} — ${error.message}`);
    } else {
      console.log(`  IMPORTED: ${parsed.title}`);
    }
  }

  console.log("\nDone!");
}

main();
