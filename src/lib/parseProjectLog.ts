export interface ParsedProjectLog {
  title: string;
  date: string | null;
  summary: string;
  tech_stack: string[];
  files_built: string[];
  key_decisions: string[];
  lessons_learned: string[];
}

export function parseProjectLog(markdown: string): ParsedProjectLog {
  const lines = markdown.split("\n");

  // Title: first # heading
  const titleMatch = lines.find((l) => /^# /.test(l));
  const title = titleMatch ? titleMatch.replace(/^# /, "").trim() : "Untitled";

  // Date
  const dateMatch = markdown.match(/\*\*Date:\*\*\s*(.+)/);
  const date = dateMatch ? dateMatch[1].trim() : null;

  // Sections
  const summary = extractSection(lines, "Summary");
  const techStackRaw = extractSection(lines, "Tech Stack");
  const filesBuiltRaw = extractSection(lines, "Files Built");
  const decisionsRaw = extractSection(lines, "Key Decisions");
  const lessonsRaw = extractSection(lines, "Lessons Learned");

  return {
    title,
    date,
    summary,
    tech_stack: parseListItems(techStackRaw),
    files_built: parseListItems(filesBuiltRaw),
    key_decisions: parseListItems(decisionsRaw),
    lessons_learned: parseListItems(lessonsRaw),
  };
}

function extractSection(lines: string[], heading: string): string {
  const headingIndex = lines.findIndex(
    (l) => l.replace(/^#+\s*/, "").trim().toLowerCase() === heading.toLowerCase()
  );
  if (headingIndex === -1) return "";

  const sectionLines: string[] = [];
  for (let i = headingIndex + 1; i < lines.length; i++) {
    // Stop at next heading
    if (/^##\s/.test(lines[i])) break;
    sectionLines.push(lines[i]);
  }

  return sectionLines.join("\n").trim();
}

function parseListItems(section: string): string[] {
  if (!section) return [];
  return section
    .split("\n")
    .filter((l) => /^-\s/.test(l.trim()))
    .map((l) => l.trim().replace(/^-\s*/, "").trim())
    .filter(Boolean);
}
